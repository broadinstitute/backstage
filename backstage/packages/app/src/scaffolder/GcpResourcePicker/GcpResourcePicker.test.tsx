import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestApiProvider } from '@backstage/test-utils';
import {
  ErrorApi,
  errorApiRef,
  googleAuthApiRef,
} from '@backstage/core-plugin-api';
import { GcpResourcePicker } from './GcpResourcePicker';
import { GcpResourcePickerProps } from './schema';

/**
 * The picker talks to the Cloud Resource Manager `:search` endpoints directly
 * via `fetch`, using a user access token from the Google auth API. The tests
 * mock both that API and `fetch`, then assert on the query strings the
 * component builds and on how it reflects results / the stored value.
 */
describe('<GcpResourcePicker />', () => {
  const onChange = jest.fn();
  const getAccessToken = jest.fn(async () => 'fake-token');
  const mockGoogleAuth = { getAccessToken };
  const mockErrorApi: jest.Mocked<ErrorApi> = {
    post: jest.fn(),
    error$: jest.fn(),
  };
  const fetchMock = jest.fn();

  const okJson = (body: unknown) => ({
    ok: true,
    status: 200,
    json: async () => body,
    text: async () => JSON.stringify(body),
  });

  const project = (over: Record<string, unknown> = {}) => ({
    name: 'projects/1',
    projectId: 'my-proj-1',
    displayName: 'My Project One',
    state: 'ACTIVE',
    ...over,
  });

  const renderPicker = (overrides: Record<string, unknown> = {}) =>
    render(
      <TestApiProvider
        apis={[
          [googleAuthApiRef, mockGoogleAuth],
          [errorApiRef, mockErrorApi],
        ]}
      >
        <GcpResourcePicker
          {...({
            onChange,
            required: false,
            rawErrors: [],
            schema: {},
            uiSchema: {},
            ...overrides,
          } as unknown as GcpResourcePickerProps)}
        />
      </TestApiProvider>,
    );

  const lastQuery = () => {
    const calls = fetchMock.mock.calls;
    const url = calls[calls.length - 1][0] as string;
    return new URL(url).searchParams.get('query');
  };

  beforeEach(() => {
    onChange.mockClear();
    getAccessToken.mockClear();
    mockErrorApi.post.mockClear();
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(okJson({ projects: [] }));
    (global as any).fetch = fetchMock;
  });

  it('searches projects on mount and lists the results', async () => {
    fetchMock.mockResolvedValue(
      okJson({
        projects: [
          project(),
          project({
            name: 'projects/2',
            projectId: 'my-proj-2',
            displayName: 'My Project Two',
          }),
        ],
      }),
    );

    renderPicker();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock.mock.calls[0][0]).toContain('/projects:search');

    await userEvent.click(screen.getByRole('textbox'));
    await waitFor(() => {
      expect(screen.getByText('My Project One')).toBeInTheDocument();
      expect(screen.getByText('My Project Two')).toBeInTheDocument();
    });
  });

  it('ORs id and displayName for a single-word term', async () => {
    renderPicker();

    await userEvent.type(screen.getByRole('textbox'), 'alaric');

    await waitFor(() =>
      expect(lastQuery()).toBe('id:alaric* OR displayName:alaric*'),
    );
  });

  it('builds a tokenised prefix query for a multi-word term', async () => {
    renderPicker();

    await userEvent.type(screen.getByRole('textbox'), 'IT Looker');

    await waitFor(() =>
      expect(lastQuery()).toBe('displayName:IT* AND displayName:Looker*'),
    );
  });

  it('searches folders and scopes by parent when configured', async () => {
    renderPicker({
      uiSchema: {
        'ui:options': { resourceType: 'folder', parent: 'folders/123' },
      },
    });

    await userEvent.type(screen.getByRole('textbox'), 'data');

    await waitFor(() => {
      const url = fetchMock.mock.calls[fetchMock.mock.calls.length - 1][0];
      expect(url).toContain('/folders:search');
      expect(lastQuery()).toBe('displayName:data* AND parent=folders/123');
    });
  });

  it('writes the selected resource value back to the form', async () => {
    fetchMock.mockResolvedValue(okJson({ projects: [project()] }));

    renderPicker();

    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.click(await screen.findByText('My Project One'));

    expect(onChange).toHaveBeenCalledWith('my-proj-1');
  });

  it('shows the stored value, upgrading to its label once results load', async () => {
    fetchMock.mockResolvedValue(okJson({ projects: [project()] }));

    renderPicker({ formData: 'my-proj-1' });

    const input = screen.getByRole('textbox') as HTMLInputElement;
    await waitFor(() => expect(input.value).toBe('My Project One'));
  });

  it('reports an error when the search request fails', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({}),
      text: async () => 'bad request',
    });

    renderPicker();

    await waitFor(() => expect(mockErrorApi.post).toHaveBeenCalled());
  });
});
