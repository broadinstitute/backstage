import React, { useMemo } from 'react';
import { ScaffolderPage } from '@backstage/plugin-scaffolder';

import { createApp } from '@backstage/frontend-defaults';
import { googleAuthApiRef, configApiRef, useApi } from '@backstage/core-plugin-api';
import {
    filterPredicateToFilterFunction,
    readFilterPredicateFromConfig,
} from '@backstage/filter-predicates';
import { SignInPage } from '@backstage/core-components';
import { ScaffolderFieldExtensions } from '@backstage/plugin-scaffolder-react';
import { SelectFieldFromApiExtension } from '@roadiehq/plugin-scaffolder-frontend-module-http-request-field';
import { GithubTeamPickerExtension } from './scaffolder/GithubTeamPicker/GithubTeamPicker';
import { GoogleAccessTokenFieldExtension } from './scaffolder/GoogleAccessTokenFieldExtension';
import { GcpResourcePickerExtension } from './scaffolder/GcpResourcePicker';
import { GcpBillingAccountPickerExtension } from './scaffolder/GcpBillingAccountPicker';
import skillExchangePlugin from '@spotify/backstage-plugin-skill-exchange/alpha';
import soundcheckPlugin from '@spotify/backstage-plugin-soundcheck/alpha';
import { HomePage } from './components/home/HomePage';
import githubPullRequestsBoardPlugin from '@backstage-community/plugin-github-pull-requests-board/alpha';
import {
    createFrontendModule,
    PageBlueprint,
} from '@backstage/frontend-plugin-api';
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
import { KubernetesLandingPage } from './components/kubernetes/KubernetesLandingPage';
import { catalogEntityModule } from './modules/catalog';
import { techdocsAddonsModule } from './modules/techdocs';
import { techDocsMermaidAddonModule } from 'backstage-plugin-techdocs-addon-mermaid';
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

// Reads the template groupings shown on the Create page from
// `scaffolder.groups` in app-config.yaml (title + a filter predicate, see
// @backstage/filter-predicates) instead of hardcoding them here. We can't use
// the scaffolder plugin's own native `sub-page:scaffolder/templates` groups
// config for this, since that only applies to the *default* page:scaffolder
// — this override replaces the whole page with the legacy <ScaffolderPage>
// component (needed for our custom field extensions, notably
// SelectFieldFromApiExtension, which has no new-frontend-system support), so
// the default page's subpages and their config never render.
const ScaffolderCreatePage = () => {
    const configApi = useApi(configApiRef);
    const groups = useMemo(
        () =>
            configApi
                .getOptionalConfigArray('scaffolder.groups')
                ?.map(groupConfig => ({
                    title: groupConfig.getString('title'),
                    filter: filterPredicateToFilterFunction(
                        readFilterPredicateFromConfig(groupConfig, {
                            key: 'filter',
                        }),
                    ),
                })),
        [configApi],
    );

    return (
        <ScaffolderPage groups={groups}>
            <ScaffolderFieldExtensions>
                <SelectFieldFromApiExtension />
                <GithubTeamPickerExtension />
                <GoogleAccessTokenFieldExtension />
                <GcpResourcePickerExtension />
                <GcpBillingAccountPickerExtension />
            </ScaffolderFieldExtensions>
        </ScaffolderPage>
    );
};

const scaffolderModuleOverrides = createFrontendModule({
    pluginId: 'scaffolder',
    extensions: [
        scaffolderPlugin.getExtension('page:scaffolder').override({
            params: {
                routeRef: scaffolderPlugin.routes.root,
                loader: async () => <ScaffolderCreatePage />,
            },
        }),
    ],
});

const githubActionsModuleOverrides = createFrontendModule({
    pluginId: 'github-actions',
    extensions: [
        githubActionsPlugin
            .getExtension('entity-content:github-actions')
            .override({
                params: {
                    path: '/ci-cd',
                    title: 'CI/CD',
                },
            }),
    ],
});

// The kubernetes plugin no longer registers a standalone page (it was
// removed upstream as unintentional — see @backstage/plugin-kubernetes
// CHANGELOG "Removed the default Kubernetes standalone page that was
// registered at `/kubernetes`"), so we define our own page extension here
// instead of overriding one.
const kubernetesLandingPageExtension = PageBlueprint.make({
    name: 'kubernetes-landing',
    params: {
        path: '/kubernetes',
        title: 'Kubernetes',
        routeRef: kubernetesPlugin.routes.kubernetes,
        loader: async () => <KubernetesLandingPage />,
    },
});

const kubernetesModuleOverrides = createFrontendModule({
    pluginId: 'kubernetes',
    extensions: [kubernetesLandingPageExtension],
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
        techdocsPlugin,
        techdocsAddonsModule,
        techDocsMermaidAddonModule,
        techRadarPlugin,
        githubActionsPlugin,
        githubActionsModuleOverrides,
        kubernetesPlugin,
        kubernetesModuleOverrides,
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
