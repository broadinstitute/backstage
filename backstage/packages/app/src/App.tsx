import React from 'react';
import { ScaffolderPage } from '@backstage/plugin-scaffolder';
import {
    TechDocsIndexPage,
    TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { searchPage } from './components/search/SearchPage';

import { createApp } from '@backstage/frontend-defaults';
import { googleAuthApiRef } from '@backstage/core-plugin-api';
import { SignInPage } from '@backstage/core-components';
import { ScaffolderFieldExtensions } from '@backstage/plugin-scaffolder-react';
import { SelectFieldFromApiExtension } from '@roadiehq/plugin-scaffolder-frontend-module-http-request-field';
import { GithubTeamPickerExtension } from './scaffolder/GithubTeamPicker/GithubTeamPicker';
import skillExchangePlugin from '@spotify/backstage-plugin-skill-exchange/alpha';
import soundcheckPlugin from '@spotify/backstage-plugin-soundcheck/alpha';
import { HomePage } from './components/home/HomePage';
import githubPullRequestsBoardPlugin from '@backstage-community/plugin-github-pull-requests-board/alpha';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import { navModule } from './modules/nav';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import apiDocsPlugin from '@backstage/plugin-api-docs/alpha';
import catalogGraphPlugin from '@backstage/plugin-catalog-graph/alpha';
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';
import insightsPlugin from '@spotify/backstage-plugin-insights/alpha';
import rbacPlugin from '@spotify/backstage-plugin-rbac/alpha';
import pagerDutyPlugin from '@pagerduty/backstage-plugin/alpha';
import homePlugin from '@backstage/plugin-home/alpha';
import searchPlugin from '@backstage/plugin-search/alpha';
import techdocsPlugin from '@backstage/plugin-techdocs/alpha';
import scaffolderPlugin from '@backstage/plugin-scaffolder/alpha';
import catalogImportPlugin from '@backstage/plugin-catalog-import/alpha';
import techRadarPlugin from '@backstage-community/plugin-tech-radar/alpha';
import githubActionsPlugin from '@backstage-community/plugin-github-actions/alpha';
import copilotPlugin from '@backstage-community/plugin-copilot/alpha';
import kubernetesPlugin from '@backstage/plugin-kubernetes/alpha';
import { catalogEntityModule } from './modules/catalog';
import { techdocsAddonsModule } from './modules/techdocs';
import orgPlugin from '@backstage/plugin-org/alpha';

const signInPageExtension = SignInPageBlueprint.make({
    params: {
        loader: async () => props => (
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
});

const appModule = createFrontendModule({
    pluginId: 'app',
    extensions: [signInPageExtension],
});

const homeModuleOverrides = createFrontendModule({
    pluginId: 'home',
    extensions: [
        homePlugin.getExtension('api:home/visits').override({
            disabled: false,
        }),
        homePlugin
            .getExtension('app-root-element:home/visit-listener')
            .override({
                disabled: false,
            }),
        homePlugin.getExtension('page:home').override({
            params: {
                path: '/',
                routeRef: homePlugin.routes.root,
                loader: async () => <HomePage />,
            },
        }),
    ],
});

const searchModuleOverrides = createFrontendModule({
    pluginId: 'search',
    extensions: [
        searchPlugin.getExtension('page:search').override({
            params: {
                routeRef: searchPlugin.routes.root,
                loader: async () => searchPage,
            },
        }),
    ],
});

const techdocsModuleOverrides = createFrontendModule({
    pluginId: 'techdocs',
    extensions: [
        techdocsPlugin.getExtension('page:techdocs').override({
            params: {
                routeRef: techdocsPlugin.routes.root,
                loader: async () => <TechDocsIndexPage />,
            },
        }),
        techdocsPlugin.getExtension('page:techdocs/reader').override({
            params: {
                path: '/docs/:namespace/:kind/:name',
                routeRef: techdocsPlugin.routes.docRoot,
                loader: async () => <TechDocsReaderPage />,
            },
        }),
    ],
});

const scaffolderModuleOverrides = createFrontendModule({
    pluginId: 'scaffolder',
    extensions: [
        scaffolderPlugin.getExtension('page:scaffolder').override({
            params: {
                routeRef: scaffolderPlugin.routes.root,
                loader: async () => (
                    <>
                        <ScaffolderPage
                            groups={[
                                {
                                    title: 'Recommended',
                                    filter: entity =>
                                        entity?.metadata?.tags?.includes(
                                            'recommended',
                                        ) ?? false,
                                },
                                {
                                    title: 'Terraform',
                                    filter: entity =>
                                        entity?.metadata?.tags?.includes(
                                            'terraform',
                                        ) ?? false,
                                },
                                {
                                    title: 'Python',
                                    filter: entity =>
                                        entity?.metadata?.tags?.includes(
                                            'python',
                                        ) ?? false,
                                },
                            ]}
                        />
                        <ScaffolderFieldExtensions>
                            <SelectFieldFromApiExtension />
                            <GithubTeamPickerExtension />
                        </ScaffolderFieldExtensions>
                    </>
                ),
            },
        }),
    ],
});

const githubActionsModuleOverrides = createFrontendModule({
    pluginId: 'github-actions',
    extensions: [
        githubActionsPlugin.getExtension('entity-content:github-actions').override({
            params: {
                path: '/ci-cd',
                title: 'CI/CD',
            },
        }),
    ],
});

const app = createApp({
    features: [
        appModule,
        navModule,
        catalogPlugin,
        catalogEntityModule,
        apiDocsPlugin,
        catalogGraphPlugin,
        orgPlugin,
        userSettingsPlugin,
        insightsPlugin,
        rbacPlugin,
        pagerDutyPlugin,
        homePlugin,
        homeModuleOverrides,
        searchPlugin,
        searchModuleOverrides,
        techdocsPlugin,
        techdocsModuleOverrides,
        techdocsAddonsModule,
        techRadarPlugin,
        githubActionsPlugin,
        githubActionsModuleOverrides,
        kubernetesPlugin,
        scaffolderPlugin,
        scaffolderModuleOverrides,
        copilotPlugin,
        githubPullRequestsBoardPlugin,
        skillExchangePlugin,
        soundcheckPlugin,
        catalogImportPlugin,
    ],
});
export default app.createRoot();
