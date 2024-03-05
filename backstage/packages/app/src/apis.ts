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
import { costInsightsApiRef } from '@backstage/plugin-cost-insights';
import { CostInsightsApi } from '@backstage/plugin-cost-insights';
import { ExampleCostInsightsClient } from '@backstage/plugin-cost-insights';


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
  ScmAuth.createDefaultApiFactory(),
];
