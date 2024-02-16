import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-catalog-backend-module-scaffolder-entity-model';
import { GithubOrgEntityProvider, GithubEntityProvider, defaultUserTransformer, GithubUser } from '@backstage/plugin-catalog-backend-module-github';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {
  isUserEntity,
} from '@backstage/catalog-model';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);

  // The org URL below needs to match a configured integrations.github entry
  // specified in your app-config.
  builder.addEntityProvider(
    GithubOrgEntityProvider.fromConfig(env.config, {
      id: 'production',
      orgUrl: 'https://github.com/broadinstitute',
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 60 },
        timeout: { minutes: 15 },
      }),

      userTransformer: async (user: GithubUser, ctx) => {
        const entity = await defaultUserTransformer(user, ctx); // Call your userTransformer function

        if (entity && isUserEntity(entity) && user.organizationVerifiedDomainEmails?.length) {
          entity.spec.profile!.email = user.organizationVerifiedDomainEmails[0];
        }
        return entity;
      },
    }),

    GithubEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      scheduler: env.scheduler,
    }),
  );

  builder.addProcessor(new ScaffolderEntitiesProcessor());
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
