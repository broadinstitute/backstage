/*
 * --------------------------------------------------------------------------
 * Custom Scaffolder field extension that lets the signed-in user pick a
 * Google Cloud Billing account they have access to — the same set of
 * accounts they'd see listed at https://console.cloud.google.com/billing —
 * authenticating to the Cloud Billing API with the user's own Google OAuth
 * credentials.
 *
 * Unlike the Resource Manager `:search` endpoints used by
 * `GcpResourcePicker`, the Cloud Billing API's `billingAccounts.list` has no
 * free-text query support. So this field lists every billing account the
 * user can see once (following pagination), then filters client-side as the
 * user types. If a user can see more accounts than the pagination cap
 * allows, the field surfaces an error rather than silently hiding accounts
 * — use `ui:options.parent` to scope the list to a specific billing
 * account's sub-accounts instead.
 *
 * The closed field displays the billing account id, with the account's
 * display name available as a hover tooltip; the open dropdown shows both
 * the display name and id for each option, mirroring the "Account name" /
 * "ID" columns on the Cloud Billing console.
 *
 * Drop it into your Backstage app (typically
 * `packages/app/src/scaffolder/GcpBillingAccountPicker/`) and register it as
 * shown in `extensions.ts`. Reference it from a template via
 * `ui:field: GcpBillingAccountPicker`.
 * --------------------------------------------------------------------------
 */
import React, { useEffect, useState } from 'react';
import {
  useApi,
  googleAuthApiRef,
  errorApiRef,
} from '@backstage/core-plugin-api';
import {
  TextField,
  FormControl,
  Tooltip,
  CircularProgress,
} from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { GcpBillingAccountPickerProps } from './schema';

/**
 * Default OAuth scope used to acquire the user's Google access token. The
 * read-only Cloud Billing scope is sufficient to list billing accounts.
 * Whatever scope is requested here must also be listed under the Google
 * auth provider's `additionalScopes` in app-config so the session covers
 * it.
 */
const DEFAULT_SCOPES = [
  'https://www.googleapis.com/auth/cloud-billing.readonly',
];

/** How many accounts to request per page. */
const PAGE_SIZE = 100;

/**
 * Cap on how many pages to fetch before giving up. This is not a silent
 * truncation limit — if the account list is still incomplete after this
 * many pages, `listBillingAccounts` throws rather than returning a partial
 * list, since a partial list would hide real accounts from the picker
 * without any indication that's happening.
 */
const MAX_PAGES = 20;

const BILLING_BASE = 'https://cloudbilling.googleapis.com/v1';

export type GcpBillingAccountOutputFormat = 'id' | 'resourceName';

type RawBillingAccount = {
  name?: string;
  displayName?: string;
  open?: boolean;
};

type BillingAccountOption = {
  /** Resource name, e.g. `billingAccounts/013939-8DE5F0-6BF33F`. */
  name: string;
  /** Short id, e.g. `013939-8DE5F0-6BF33F`. */
  accountId: string;
  /** Human-readable display name, e.g. "My Team's Billing Account". */
  displayName: string;
  /** Whether the account is still open (accepting new charges/links). */
  open: boolean;
  /** The value written back to the template, per `outputFormat`. */
  value: string;
};

/**
 * Fetch every billing account the caller can see, following pagination.
 * `billingAccounts.list` has no text-search filter — only `subaccountParent`
 * — so the full (bounded) result set is fetched up front and filtered
 * client-side by the picker.
 */
const listBillingAccounts = async (
  token: string,
  parent: string | undefined,
  signal: AbortSignal,
): Promise<RawBillingAccount[]> => {
  const accounts: RawBillingAccount[] = [];
  let pageToken: string | undefined;
  let pages = 0;
  do {
    const params = new URLSearchParams({ pageSize: String(PAGE_SIZE) });
    if (parent) {
      params.set('filter', `subaccountParent=${parent}`);
    }
    if (pageToken) {
      params.set('pageToken', pageToken);
    }
    const res = await fetch(
      `${BILLING_BASE}/billingAccounts?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` }, signal },
    );
    if (!res.ok) {
      throw new Error(
        `Cloud Billing billingAccounts.list failed (${res.status}): ${await res
          .text()
          .catch(() => '')}`,
      );
    }
    const body = (await res.json()) as {
      billingAccounts?: RawBillingAccount[];
      nextPageToken?: string;
    };
    accounts.push(...(body.billingAccounts ?? []));
    pageToken = body.nextPageToken;
    pages += 1;
  } while (pageToken && pages < MAX_PAGES);
  if (pageToken) {
    throw new Error(
      `Cloud Billing billingAccounts.list has more than ${
        MAX_PAGES * PAGE_SIZE
      } accounts visible to this user; refusing to silently truncate the list. Use ui:options.parent to restrict the picker to a specific billing account's sub-accounts.`,
    );
  }
  return accounts;
};

const formatValue = (
  accountId: string,
  name: string,
  outputFormat: GcpBillingAccountOutputFormat,
): string => (outputFormat === 'resourceName' ? name : accountId);

/** Filter typed input against both the display name and the account id. */
const filterOptions = createFilterOptions<BillingAccountOption>({
  stringify: option => `${option.displayName} ${option.accountId}`,
});

/**
 * Field component: a searchable picker for Google Cloud Billing accounts
 * the signed-in user has access to, e.g. for passing as a `billingAccount`
 * input to a project-creation action.
 */
export const GcpBillingAccountPicker = (
  props: GcpBillingAccountPickerProps,
) => {
  const {
    onChange,
    rawErrors,
    required,
    formData,
    schema: { title, description },
    uiSchema,
  } = props;

  const googleAuth = useApi(googleAuthApiRef);
  const errorApi = useApi(errorApiRef);

  const options = uiSchema?.['ui:options'];
  const outputFormat: GcpBillingAccountOutputFormat =
    options?.outputFormat ?? 'id';
  const openOnly = options?.openOnly ?? false;
  const parent = options?.parent;
  const scopes = options?.scopes ?? DEFAULT_SCOPES;

  const [accounts, setAccounts] = useState<BillingAccountOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<BillingAccountOption | null>(null);

  // Load the full list of accessible billing accounts once (and whenever the
  // relevant config changes) rather than per-keystroke, since the API has no
  // server-side text search to debounce against.
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setLoading(true);
    (async () => {
      try {
        const token = await googleAuth.getAccessToken(scopes);
        const raw = await listBillingAccounts(token, parent, signal);
        if (signal.aborted) return;
        const mapped = raw
          .filter((account): account is RawBillingAccount & { name: string } =>
            Boolean(account.name),
          )
          .filter(account => !openOnly || account.open !== false)
          .map(account => {
            const accountId = account.name.replace(/^billingAccounts\//, '');
            const displayName = account.displayName ?? accountId;
            return {
              name: account.name,
              accountId,
              displayName,
              open: account.open ?? true,
              value: formatValue(accountId, account.name, outputFormat),
            };
          })
          .sort((a, b) => a.displayName.localeCompare(b.displayName));
        setAccounts(mapped);
      } catch (e) {
        if (!signal.aborted) {
          errorApi.post(e as Error);
          setAccounts([]);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    })();
    return () => controller.abort();
  }, [parent, openOnly, outputFormat, scopes, googleAuth, errorApi]);

  // Keep the displayed selection in sync with the field's stored value. The
  // form may seed `formData` (a configured default, or a value restored when
  // the user navigates back to this step) before the account list has
  // loaded — or the value may never resolve at all, e.g. the user lost
  // access to that account, `parent`/`openOnly` changed, or the account list
  // was too large to fully load. Prefer a fully-labelled match from the
  // loaded accounts; otherwise fall back to a placeholder built from the raw
  // value so the stored value still shows instead of rendering blank. An
  // existing placeholder for the same value is reused so we don't downgrade
  // a richer selection on every render.
  useEffect(() => {
    setSelected(prev => {
      if (!formData) {
        return prev ? null : prev;
      }
      const match = accounts.find(account => account.value === formData);
      if (match) {
        return match;
      }
      if (prev?.value === formData) {
        return prev;
      }
      return {
        name: formData,
        accountId: formData,
        displayName: formData,
        open: true,
        value: formData,
      };
    });
  }, [formData, accounts]);

  const updateChange = (
    _: React.ChangeEvent<{}>,
    option: BillingAccountOption | null,
  ) => {
    onChange(option?.value ?? '');
  };

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0}
    >
      <Autocomplete
        id="GcpBillingAccountPicker"
        options={accounts}
        value={selected}
        loading={loading}
        onChange={updateChange}
        getOptionLabel={option => option.accountId}
        getOptionSelected={(option, val) => option.value === val.value}
        filterOptions={filterOptions}
        renderOption={option => (
          <div>
            <div>{option.displayName}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
              {option.accountId}
              {!option.open && ' (closed)'}
            </div>
          </div>
        )}
        loadingText="Loading billing accounts…"
        noOptionsText="No billing accounts found"
        renderInput={params => (
          <Tooltip
            title={selected?.displayName ?? ''}
            disableHoverListener={!selected}
          >
            <TextField
              {...params}
              label={title ?? 'Billing Account'}
              margin="dense"
              required={required}
              helperText={description}
              variant="outlined"
              FormHelperTextProps={{
                margin: 'dense',
                style: { marginLeft: 0 },
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={16} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          </Tooltip>
        )}
      />
    </FormControl>
  );
};
