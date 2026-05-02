import React from 'react';
import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import {
    CATALOG_FILTER_EXISTS,
    catalogApiRef,
    entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    KUBERNETES_ANNOTATION,
    KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION,
} from '@backstage/plugin-kubernetes-common';
import { KubernetesLandingPage } from './KubernetesLandingPage';

describe('<KubernetesLandingPage />', () => {
    const catalogApi = {
        getEntities: jest.fn(),
    } as unknown as jest.Mocked<CatalogApi>;

    const kubernetesEntity = (overrides: Partial<Entity> = {}): Entity => ({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
            name: 'default-name',
            namespace: 'default',
            annotations: {
                [KUBERNETES_ANNOTATION]: 'cluster:default/name',
            },
        },
        spec: {
            type: 'service',
            owner: 'group:default/platform',
        },
        ...overrides,
    });

    const renderPage = async () => {
        return renderInTestApp(
            <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
                <KubernetesLandingPage />
            </TestApiProvider>,
            {
                mountedRoutes: {
                    '/catalog/:namespace/:kind/:name': entityRouteRef,
                },
            },
        );
    };

    beforeEach(() => {
        catalogApi.getEntities.mockReset();
    });

    it('shows a loading state while entities are being fetched', async () => {
        let resolveEntities: ((value: { items: Entity[] }) => void) | undefined;
        const pendingEntities = new Promise<{ items: Entity[] }>(resolve => {
            resolveEntities = resolve;
        });

        catalogApi.getEntities.mockReturnValue(pendingEntities as any);

        await renderPage();

        expect(screen.getByTestId('progress')).toBeInTheDocument();

        resolveEntities?.({ items: [] });

        await screen.findByText('Kubernetes');
    });

    it('shows an error state when catalogApi.getEntities fails', async () => {
        catalogApi.getEntities.mockRejectedValueOnce(
            new Error('catalog failed'),
        );

        await renderPage();

        expect(await screen.findByRole('alert')).toBeInTheDocument();
        expect(
            screen.getByText((content, element) => {
                return (
                    element?.tagName.toLowerCase() === 'h6' &&
                    content.includes('catalog failed')
                );
            }),
        ).toBeInTheDocument();
    });

    it('shows empty state when no Kubernetes entities are returned', async () => {
        catalogApi.getEntities.mockResolvedValueOnce({ items: [] });

        await renderPage();

        expect(
            await screen.findByText('No matching entities'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('Found 0 Kubernetes-enabled entities.'),
        ).toBeInTheDocument();

        expect(catalogApi.getEntities).toHaveBeenCalledWith({
            filter: [
                {
                    [`metadata.annotations.${KUBERNETES_ANNOTATION}`]:
                        CATALOG_FILTER_EXISTS,
                },
                {
                    [`metadata.annotations.${KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION}`]:
                        CATALOG_FILTER_EXISTS,
                },
            ],
            fields: [
                'kind',
                'metadata.name',
                'metadata.namespace',
                'metadata.title',
                'metadata.annotations',
                'spec.owner',
                'spec.type',
            ],
            order: {
                field: 'metadata.name',
                order: 'asc',
            },
        });
    });

    it('filters entities by search query', async () => {
        catalogApi.getEntities.mockResolvedValueOnce({
            items: [
                kubernetesEntity({
                    metadata: {
                        name: 'payments-service',
                        namespace: 'default',
                        annotations: {
                            [KUBERNETES_ANNOTATION]: 'cluster:prod/payments',
                        },
                        title: 'Payments Service',
                    },
                    spec: {
                        type: 'service',
                        owner: 'group:default/payments',
                    },
                }),
                kubernetesEntity({
                    metadata: {
                        name: 'checkout-service',
                        namespace: 'default',
                        annotations: {
                            [KUBERNETES_ANNOTATION]: 'cluster:prod/checkout',
                        },
                        title: 'Checkout Service',
                    },
                    spec: {
                        type: 'service',
                        owner: 'group:default/checkout',
                    },
                }),
            ],
        });

        await renderPage();

        await screen.findByText('payments-service');
        expect(screen.getByText('checkout-service')).toBeInTheDocument();
        expect(screen.getAllByText('Open Kubernetes tab')).toHaveLength(2);

        const user = userEvent.setup();
        const searchInput = screen.getByPlaceholderText(
            'Filter by name, owner, kind, namespace, or annotation',
        );
        await user.type(searchInput, 'checkout');

        await waitFor(() => {
            expect(
                screen.queryByText('payments-service'),
            ).not.toBeInTheDocument();
            expect(screen.getByText('checkout-service')).toBeInTheDocument();
            expect(screen.getAllByText('Open Kubernetes tab')).toHaveLength(1);
        });
    });
});
