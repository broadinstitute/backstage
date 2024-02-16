import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { ScmIntegrations } from '@backstage/integration';
import { createPagerDutyServiceAction } from '@pagerduty/backstage-plugin-backend';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });

  // Pull integrations
  const integrations = ScmIntegrations.fromConfig(env.config);

  // Rebuild built-in actions
  const builtInActions = createBuiltinActions({
  integrations,
  catalogClient,
  config: env.config,
  reader: env.reader,
  });

  // Append PagerDuty custom action to the list
  const actions = [...builtInActions, createPagerDutyServiceAction()];

  return await createRouter({
    actions,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
    identity: env.identity,
    permissions: env.permissions,
  });
}
