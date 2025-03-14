import {
    ScmIntegrationsApi,
    scmIntegrationsApiRef,
    ScmAuth,
} from '@backstage/integration-react';
import {
    AnyApiFactory,
    configApiRef,
    createApiFactory,
} from '@backstage/core-plugin-api';
import { costInsightsApiRef } from '@backstage-community/plugin-cost-insights';
import { CostInsightsApi } from '@backstage-community/plugin-cost-insights';
import { ExampleCostInsightsClient } from '@backstage-community/plugin-cost-insights';
import { BackstageInsights } from '@spotify/backstage-plugin-analytics-module-insights';

export const apis: AnyApiFactory[] = [
    createApiFactory({
        api: scmIntegrationsApiRef,
        deps: { configApi: configApiRef },
        factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
    }),
    createApiFactory({
        api: costInsightsApiRef,
        deps: {},
        factory: () => new ExampleCostInsightsClient(),
    }),
    BackstageInsights.createDefaultApiFactory(),
    ScmAuth.createDefaultApiFactory(),
];
