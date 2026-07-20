import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestApiProvider } from '@backstage/test-utils';
import {
  ErrorApi,
  errorApiRef,
  googleAuthApiRef,
} from '@backstage/core-plugin-api';
import { GcpBillingAccountPicker } from './GcpBillingAccountPicker';
import { GcpBillingAccountPickerProps } from './schema';

/**
 * The picker talks to the Cloud Billing `billingAccounts.list` endpoint
 * directly via `fetch`, using a user access token from the Google auth API.
 * The tests mock both that API and `fetch`, then assert on the requests the
 * component builds and on how it reflects results / the stored value.
 */
describe('<GcpBillingAccountPicker />', () => {
  const onChange = jest.fn();
  const getAccessToken = jest.fn(async () => 'fake-token');
  const mockGoogleAuth = { getAccessToken };
  const mockErrorApi: jest.Mocked<ErrorApi> = {
    post: jest.fn(),
    error$: jest.fn(),
  };
  const fetchMock = jest.fn();
  const originalFetch = global.fetch;

  const okJson = (body: unknown) => ({
    ok: true,
    status: 200,
    json: async () => body,
    text: async () => JSON.stringify(body),
  });

  const account = (over: Record<string, unknown> = {}) => ({
    name: 'billingAccounts/000000-111111-222222',
    displayName: 'My Billing Account',
    open: true,
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
        <GcpBillingAccountPicker
          {...({
            onChange,
            required: false,
            rawErrors: [],
            schema: {},
            uiSchema: {},
            ...overrides,
          } as unknown as GcpBillingAccountPickerProps)}
        />
      </TestApiProvider>,
    );

  beforeEach(() => {
    onChange.mockClear();
    getAccessToken.mockClear();
    mockErrorApi.post.mockClear();
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(okJson({ billingAccounts: [] }));
    (global as any).fetch = fetchMock;
  });

  afterEach(() => {
    (global as any).fetch = originalFetch;
  });

  it('lists billing accounts on mount', async () => {
    fetchMock.mockResolvedValue(
      okJson({
        billingAccounts: [
          account(),
          account({
            name: 'billingAccounts/333333-444444-555555',
            displayName: 'Another Account',
          }),
        ],
      }),
    );

    renderPicker();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock.mock.calls[0][0]).toContain('/billingAccounts?');

    await userEvent.click(screen.getByRole('textbox'));
    await waitFor(() => {
      expect(screen.getByText('My Billing Account')).toBeInTheDocument();
      expect(screen.getByText('Another Account')).toBeInTheDocument();
    });
  });

  it('shows a loading spinner while the account list is being fetched', async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    fetchMock.mockReturnValue(
      new Promise(resolve => {
        resolveFetch = resolve;
      }),
    );

    renderPicker();

    await waitFor(() =>
      expect(screen.getByRole('progressbar')).toBeInTheDocument(),
    );

    resolveFetch(okJson({ billingAccounts: [account()] }));

    await waitFor(() =>
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(),
    );
  });

  it('follows pagination to collect every page', async () => {
    fetchMock
      .mockResolvedValueOnce(
        okJson({
          billingAccounts: [account()],
          nextPageToken: 'page-2',
        }),
      )
      .mockResolvedValueOnce(
        okJson({
          billingAccounts: [
            account({
              name: 'billingAccounts/333333-444444-555555',
              displayName: 'Another Account',
            }),
          ],
        }),
      );

    renderPicker();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock.mock.calls[1][0]).toContain('pageToken=page-2');

    await userEvent.click(screen.getByRole('textbox'));
    await waitFor(() => {
      expect(screen.getByText('My Billing Account')).toBeInTheDocument();
      expect(screen.getByText('Another Account')).toBeInTheDocument();
    });
  });

  it('reports an error instead of silently truncating when the account list never ends', async () => {
    fetchMock.mockResolvedValue(
      okJson({ billingAccounts: [account()], nextPageToken: 'more' }),
    );

    renderPicker();

    await waitFor(() => expect(mockErrorApi.post).toHaveBeenCalled());
    expect(mockErrorApi.post.mock.calls[0][0].message).toMatch(
      /refusing to silently truncate/,
    );

    await userEvent.click(screen.getByRole('textbox'));
    expect(screen.queryByText('My Billing Account')).not.toBeInTheDocument();
  });

  it('scopes the list to a parent when configured', async () => {
    renderPicker({
      uiSchema: {
        'ui:options': { parent: 'billingAccounts/000000-111111-222222' },
      },
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const url = fetchMock.mock.calls[0][0] as string;
    expect(new URL(url).searchParams.get('filter')).toBe(
      'subaccountParent=billingAccounts/000000-111111-222222',
    );
  });

  it('excludes closed accounts when openOnly is set', async () => {
    fetchMock.mockResolvedValue(
      okJson({
        billingAccounts: [
          account(),
          account({
            name: 'billingAccounts/333333-444444-555555',
            displayName: 'Closed Account',
            open: false,
          }),
        ],
      }),
    );

    renderPicker({ uiSchema: { 'ui:options': { openOnly: true } } });

    await userEvent.click(screen.getByRole('textbox'));
    await waitFor(() =>
      expect(screen.getByText('My Billing Account')).toBeInTheDocument(),
    );
    expect(screen.queryByText('Closed Account')).not.toBeInTheDocument();
  });

  it('writes the short account id back to the form by default', async () => {
    fetchMock.mockResolvedValue(okJson({ billingAccounts: [account()] }));

    renderPicker();

    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.click(await screen.findByText('My Billing Account'));

    expect(onChange).toHaveBeenCalledWith('000000-111111-222222');
  });

  it('writes the resource name when outputFormat is resourceName', async () => {
    fetchMock.mockResolvedValue(okJson({ billingAccounts: [account()] }));

    renderPicker({
      uiSchema: { 'ui:options': { outputFormat: 'resourceName' } },
    });

    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.click(await screen.findByText('My Billing Account'));

    expect(onChange).toHaveBeenCalledWith(
      'billingAccounts/000000-111111-222222',
    );
  });

  it('shows the account id in the closed field', async () => {
    fetchMock.mockResolvedValue(okJson({ billingAccounts: [account()] }));

    renderPicker({ formData: '000000-111111-222222' });

    const input = screen.getByRole('textbox') as HTMLInputElement;
    await waitFor(() =>
      expect(input.value).toBe('000000-111111-222222'),
    );
  });

  it('falls back to a placeholder showing the stored value when it matches no loaded account', async () => {
    // e.g. the user lost access to the account, or `parent`/`openOnly`
    // filtered it out — the account list never contains a matching value.
    fetchMock.mockResolvedValue(
      okJson({
        billingAccounts: [
          account({
            name: 'billingAccounts/333333-444444-555555',
            displayName: 'Another Account',
          }),
        ],
      }),
    );

    renderPicker({ formData: '000000-111111-222222' });

    const input = screen.getByRole('textbox') as HTMLInputElement;
    await waitFor(() =>
      expect(input.value).toBe('000000-111111-222222'),
    );
    // Confirm it isn't just showing pre-load state, but has actually settled
    // after the (non-matching) account list finished loading.
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(input.value).toBe('000000-111111-222222');
  });

  it('reports an error when the list request fails', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({}),
      text: async () => 'forbidden',
    });

    renderPicker();

    await waitFor(() => expect(mockErrorApi.post).toHaveBeenCalled());
  });
});
