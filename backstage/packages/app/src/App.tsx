import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
    CatalogEntityPage,
    CatalogIndexPage,
    catalogPlugin,
} from '@backstage/plugin-catalog';
import {
    CatalogImportPage,
    catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage-community/plugin-tech-radar';
import {
    TechDocsIndexPage,
    techdocsPlugin,
    TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';

import { AlertDisplay, OAuthRequestDialog } from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { googleAuthApiRef } from '@backstage/core-plugin-api';
import { SignInPage } from '@backstage/core-components';
import { GcpProjectsPage } from '@backstage-community/plugin-gcp-projects';
import { githubAuthApiRef } from '@backstage/core-plugin-api';
import { ScaffolderFieldExtensions } from '@backstage/plugin-scaffolder-react';
import { SelectFieldFromApiExtension } from '@roadiehq/plugin-scaffolder-frontend-module-http-request-field';
import { CostInsightsPage } from '@backstage-community/plugin-cost-insights';
import { GithubTeamPickerExtension } from './scaffolder/GithubTeamPicker/GithubTeamPicker';

interface SignInProviderConfig {
    id: string;
    title: string;
    message: string;
    apiRef: any;
}

const googleProvider: SignInProviderConfig = {
    id: 'google-auth-provider',
    title: 'Google',
    message: 'Sign in using Google',
    apiRef: googleAuthApiRef,
};

const app = createApp({
    components: {
        SignInPage: props => (
            <SignInPage
                {...props}
                auto
                provider={{
                    id: 'google-auth-provider',
                    title: 'Google',
                    message: 'Sign in using Google',
                    apiRef: googleAuthApiRef,
                }}
            />
        ),
    },
    apis,
    bindRoutes({ bind }) {
        bind(catalogPlugin.externalRoutes, {
            createComponent: scaffolderPlugin.routes.root,
            viewTechDoc: techdocsPlugin.routes.docRoot,
            createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
        });
        bind(apiDocsPlugin.externalRoutes, {
            registerApi: catalogImportPlugin.routes.importPage,
        });
        bind(scaffolderPlugin.externalRoutes, {
            registerComponent: catalogImportPlugin.routes.importPage,
            viewTechDoc: techdocsPlugin.routes.docRoot,
        });
        bind(orgPlugin.externalRoutes, {
            catalogIndex: catalogPlugin.routes.catalogIndex,
        });
    },
});

const routes = (
    <FlatRoutes>
        <Route path="/" element={<Navigate to="catalog" />} />
        <Route path="/cost-insights" element={<CostInsightsPage />} />
        <Route path="/catalog" element={<CatalogIndexPage />} />
        <Route
            path="/catalog/:namespace/:kind/:name"
            element={<CatalogEntityPage />}
        >
            {entityPage}
        </Route>
        <Route path="/docs" element={<TechDocsIndexPage />} />
        <Route
            path="/docs/:namespace/:kind/:name/*"
            element={<TechDocsReaderPage />}
        >
            <TechDocsAddons>
                <ReportIssue />
            </TechDocsAddons>
        </Route>
        <Route
            path="/create"
            element={
                <ScaffolderPage
                    groups={[
                        {
                            title: 'Recommended',
                            filter: entity =>
                                entity?.metadata?.tags?.includes(
                                    'recommended',
                                ) ?? false,
                        },
                    ]}
                />
            }
        >
            <ScaffolderFieldExtensions>
                <SelectFieldFromApiExtension />
                <GithubTeamPickerExtension />
            </ScaffolderFieldExtensions>
        </Route>
        <Route path="/api-docs" element={<ApiExplorerPage />} />
        <Route path="/gcp-projects" element={<GcpProjectsPage />} />
        <Route
            path="/tech-radar"
            element={<TechRadarPage width={1500} height={800} />}
        />
        <Route
            path="/catalog-import"
            element={
                <RequirePermission permission={catalogEntityCreatePermission}>
                    <CatalogImportPage />
                </RequirePermission>
            }
        />
        <Route path="/search" element={<SearchPage />}>
            {searchPage}
        </Route>
        <Route path="/settings" element={<UserSettingsPage />} />
        <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    </FlatRoutes>
);

export default app.createRoot(
    <>
        <AlertDisplay />
        <OAuthRequestDialog />
        <AppRouter>
            <Root>{routes}</Root>
        </AppRouter>
    </>,
);
