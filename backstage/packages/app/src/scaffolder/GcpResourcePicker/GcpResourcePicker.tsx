/*
 * --------------------------------------------------------------------------
 * Custom Scaffolder field extension that lets the signed-in user pick a GCP
 * project or folder they have access to, authenticating to the Cloud
 * Resource Manager API with the user's own Google OAuth credentials.
 *
 * The set of projects/folders a single user can see may be very large, so
 * this field does NOT eagerly load everything. Instead it performs a
 * debounced, server-side search against the Resource Manager `:search`
 * endpoints (which only return resources the caller has access to) and caps
 * each request to a single page. When more results exist than were
 * returned, the user is prompted to refine their search.
 *
 * Companion to `GoogleAccessTokenFieldExtension` — that field forwards the
 * user's token to the Scaffolder backend as a task secret; this field uses
 * the same user credentials in the browser to populate a picker.
 *
 * Drop it into your Backstage app (typically
 * `packages/app/src/scaffolder/GcpResourcePicker/`) and register it as shown
 * in `extensions.ts`. Reference it from a template via
 * `ui:field: GcpResourcePicker`.
 * --------------------------------------------------------------------------
 */
import React, { useState } from 'react';
import {
  useApi,
  googleAuthApiRef,
  errorApiRef,
} from '@backstage/core-plugin-api';
import { TextField, FormControl } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import useAsync from 'react-use/lib/useAsync';
import useDebounce from 'react-use/lib/useDebounce';
import { GcpResourcePickerProps } from './schema';

/**
 * Default OAuth scopes used to acquire the user's Google access token. The
 * read-only Cloud Platform scope is sufficient to list projects/folders.
 * Whatever scopes are requested here must also be listed under the Google
 * auth provider's `additionalScopes` in app-config so the session covers
 * them.
 */
const DEFAULT_SCOPES = [
  'https://www.googleapis.com/auth/cloud-platform.read-only',
];

/** How many results to request per search. Kept small on purpose. */
const DEFAULT_PAGE_SIZE = 25;

const RESOURCE_MANAGER_BASE = 'https://cloudresourcemanager.googleapis.com/v3';

export type GcpResourceType = 'project' | 'folder';
export type GcpResourceOutputFormat = 'id' | 'resourceName';

type GcpResourceOption = {
  /** Human-readable label shown in the dropdown. */
  label: string;
  /** Secondary text (the id / resource name) shown under the label. */
  secondary: string;
  /** The value written back to the template, per `outputFormat`. */
  value: string;
};

type SearchResult = {
  options: GcpResourceOption[];
  /** True when the API reported more results than we fetched. */
  hasMore: boolean;
};

/**
 * Build the value emitted to the template for a given API resource.
 */
const formatProjectValue = (
  project: { name?: string; projectId?: string },
  outputFormat: GcpResourceOutputFormat,
): string =>
  outputFormat === 'resourceName' ? project.name ?? '' : project.projectId ?? '';

const formatFolderValue = (
  folder: { name?: string },
  outputFormat: GcpResourceOutputFormat,
): string => {
  const name = folder.name ?? '';
  if (outputFormat === 'resourceName') {
    return name;
  }
  // name looks like `folders/123456789`; strip the prefix for the short id.
  return name.replace(/^folders\//, '');
};

const searchProjects = async (
  token: string,
  query: string,
  pageSize: number,
  outputFormat: GcpResourceOutputFormat,
  signal: AbortSignal,
): Promise<SearchResult> => {
  const params = new URLSearchParams({ pageSize: String(pageSize) });
  const term = query.trim();
  if (term) {
    // The search grammar has no bare free-text mode: a raw term (especially
    // one containing a hyphen, which is read as an operator) is rejected with
    // a 400. It also splits a query on unquoted whitespace and ANDs the
    // resulting expressions, with no quoted-phrase prefix mode — so a
    // multi-word term such as a display name ("IT Looker Dashboards") must be
    // broken into one prefix expression per token, or it 400s. Each
    // `displayName:<tok>*` matches that token (as a prefix) within the name.
    const tokens = term.split(/\s+/);
    if (tokens.length === 1) {
      // A single token may be an id or a display name; match either.
      params.set('query', `id:${term}* OR displayName:${term}*`);
    } else {
      // Project ids never contain spaces, so a multi-word term can only be a
      // display name. Require every token to be present (prefix match).
      params.set(
        'query',
        tokens.map(token => `displayName:${token}*`).join(' AND '),
      );
    }
  }
  const res = await fetch(
    `${RESOURCE_MANAGER_BASE}/projects:search?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` }, signal },
  );
  if (!res.ok) {
    throw new Error(
      `Cloud Resource Manager projects:search failed (${res.status}): ${await res
        .text()
        .catch(() => '')}`,
    );
  }
  const body = (await res.json()) as {
    projects?: {
      name?: string;
      projectId?: string;
      displayName?: string;
      state?: string;
    }[];
    nextPageToken?: string;
  };
  const options = (body.projects ?? [])
    // projects:search returns projects in every lifecycle state (including
    // DELETE_REQUESTED); only surface live ones.
    .filter(project => (project.state ?? 'ACTIVE') === 'ACTIVE')
    // Defensive guard: only keep genuine project resources.
    .filter(
      project =>
        Boolean(project.projectId) ||
        (project.name ?? '').startsWith('projects/'),
    )
    .map(project => ({
      label: project.displayName ?? project.projectId ?? project.name ?? '',
      secondary: project.projectId ?? project.name ?? '',
      value: formatProjectValue(project, outputFormat),
    }));
  return { options, hasMore: Boolean(body.nextPageToken) };
};

const searchFolders = async (
  token: string,
  query: string,
  parent: string | undefined,
  pageSize: number,
  outputFormat: GcpResourceOutputFormat,
  signal: AbortSignal,
): Promise<SearchResult> => {
  // folders:search query supports `displayName`, `parent` and `state`.
  const terms: string[] = [];
  const term = query.trim();
  if (term) {
    // See searchProjects: the grammar ANDs whitespace-separated expressions
    // and has no quoted-phrase mode, so split a multi-word display name into
    // one prefix expression per token.
    terms.push(...term.split(/\s+/).map(token => `displayName:${token}*`));
  }
  if (parent) {
    terms.push(`parent=${parent}`);
  }
  const params = new URLSearchParams({ pageSize: String(pageSize) });
  if (terms.length > 0) {
    params.set('query', terms.join(' AND '));
  }
  const res = await fetch(
    `${RESOURCE_MANAGER_BASE}/folders:search?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` }, signal },
  );
  if (!res.ok) {
    throw new Error(
      `Cloud Resource Manager folders:search failed (${res.status}): ${await res
        .text()
        .catch(() => '')}`,
    );
  }
  const body = (await res.json()) as {
    folders?: { name?: string; displayName?: string; state?: string }[];
    nextPageToken?: string;
  };
  const options = (body.folders ?? [])
    // folders:search returns folders in every lifecycle state; only surface
    // live ones.
    .filter(folder => (folder.state ?? 'ACTIVE') === 'ACTIVE')
    // Defensive guard: only keep genuine folder resources.
    .filter(folder => (folder.name ?? '').startsWith('folders/'))
    .map(folder => ({
      label: folder.displayName ?? folder.name ?? '',
      secondary: folder.name ?? '',
      value: formatFolderValue(folder, outputFormat),
    }));
  return { options, hasMore: Boolean(body.nextPageToken) };
};

/**
 * Field component: a search-as-you-type picker for GCP projects or folders
 * the signed-in user has access to.
 */
export const GcpResourcePicker = (props: GcpResourcePickerProps) => {
  const {
    onChange,
    rawErrors,
    required,
    schema: { title, description },
    uiSchema,
  } = props;

  const googleAuth = useApi(googleAuthApiRef);
  const errorApi = useApi(errorApiRef);

  const options = uiSchema?.['ui:options'];
  const resourceType: GcpResourceType = options?.resourceType ?? 'project';
  const outputFormat: GcpResourceOutputFormat = options?.outputFormat ?? 'id';
  const parent = options?.parent;
  const scopes = options?.scopes ?? DEFAULT_SCOPES;
  const pageSize = options?.pageSize ?? DEFAULT_PAGE_SIZE;

  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<GcpResourceOption | null>(null);

  // Debounce the typed input so we don't fire a request per keystroke.
  useDebounce(() => setQuery(inputValue), 300, [inputValue]);

  const { loading, value: result } = useAsync(
    async (): Promise<SearchResult> => {
      const controller = new AbortController();
      try {
        const token = await googleAuth.getAccessToken(scopes);
        if (resourceType === 'folder') {
          return await searchFolders(
            token,
            query,
            parent,
            pageSize,
            outputFormat,
            controller.signal,
          );
        }
        return await searchProjects(
          token,
          query,
          pageSize,
          outputFormat,
          controller.signal,
        );
      } catch (e) {
        errorApi.post(e as Error);
        return { options: [], hasMore: false };
      }
      // Re-run whenever the debounced query (or relevant config) changes.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [query, resourceType, parent, pageSize, outputFormat],
  );

  const updateChange = (
    _: React.ChangeEvent<{}>,
    value: GcpResourceOption | null,
  ) => {
    setSelected(value);
    onChange(value?.value ?? '');
  };

  const noun = resourceType === 'folder' ? 'folder' : 'project';
  const hasMore = result?.hasMore ?? false;
  const helperText = hasMore
    ? `Showing the first ${pageSize} matches — refine your search to narrow results.`
    : description;

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0}
    >
      <Autocomplete
        id="GcpResourcePicker"
        options={result?.options ?? []}
        value={selected}
        loading={loading}
        onChange={updateChange}
        onInputChange={(_, newInput) => setInputValue(newInput)}
        getOptionLabel={option => option.label}
        getOptionSelected={(option, val) => option.value === val.value}
        // Disable client-side filtering — results are already filtered by the
        // Resource Manager search query on the server.
        filterOptions={x => x}
        renderOption={option => (
          <div>
            <div>{option.label}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
              {option.secondary}
            </div>
          </div>
        )}
        noOptionsText={
          query
            ? `No ${noun}s match "${query}"`
            : `Start typing to search ${noun}s`
        }
        renderInput={params => (
          <TextField
            {...params}
            label={title ?? `GCP ${noun}`}
            margin="dense"
            required={required}
            helperText={helperText}
            variant="outlined"
            FormHelperTextProps={{
              margin: 'dense',
              style: { marginLeft: 0 },
            }}
          />
        )}
      />
    </FormControl>
  );
};

