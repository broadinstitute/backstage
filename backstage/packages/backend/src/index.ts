import { createBackend } from '@backstage/backend-defaults';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { githubOrgEntityProviderTransformsExtensionPoint } from '@backstage/plugin-catalog-backend-module-github-org';


const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend/alpha'));
backend.add(import('@backstage/plugin-proxy-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
backend.add(import('@backstage/plugin-techdocs-backend/alpha'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-google-provider'));
// See https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));

// See https://backstage.io/docs/auth/guest/provider

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
backend.add(import('@backstage/plugin-catalog-backend-module-github/alpha'));
backend.add(import('@backstage/plugin-catalog-backend-module-github-org'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);

// See https://backstage.io/docs/features/software-catalog/configuration#subscribing-to-catalog-errors
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// permission plugin
backend.add(import('@backstage/plugin-permission-backend/alpha'));
// See https://backstage.io/docs/permissions/getting-started for how to create your own permission policy
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// search plugin
backend.add(import('@backstage/plugin-search-backend/alpha'));

// search engine
// See https://backstage.io/docs/features/search/search-engines
backend.add(import('@backstage/plugin-search-backend-module-pg/alpha'));

// search collators
backend.add(import('@backstage/plugin-search-backend-module-catalog/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs/alpha'));

// kubernetes
backend.add(import('@backstage/plugin-kubernetes-backend/alpha'));

backend.start();


// /*
//  * Hi!
//  *
//  * Note that this is an EXAMPLE Backstage backend. Please check the README.
//  *
//  * Happy hacking!
//  */

// import Router from 'express-promise-router';
// import {
//   createServiceBuilder,
//   loadBackendConfig,
//   getRootLogger,
//   useHotMemoize,
//   notFoundHandler,
//   CacheManager,
//   DatabaseManager,
//   HostDiscovery,
//   UrlReaders,
//   ServerTokenManager,
// } from '@backstage/backend-common';
// import { TaskScheduler } from '@backstage/backend-tasks';
// import { Config } from '@backstage/config';
// import app from './plugins/app';
// import auth from './plugins/auth';
// import catalog from './plugins/catalog';
// import scaffolder from './plugins/scaffolder';
// import proxy from './plugins/proxy';
// import techdocs from './plugins/techdocs';
// import search from './plugins/search';
// import { PluginEnvironment } from './types';
// import { ServerPermissionClient } from '@backstage/plugin-permission-node';
// import { DefaultIdentityClient } from '@backstage/plugin-auth-node';
// import kubernetes from './plugins/kubernetes';
// import pagerduty from './plugins/pagerduty';

// function makeCreateEnv(config: Config) {
//   const root = getRootLogger();
//   const reader = UrlReaders.default({ logger: root, config });
//   const discovery = HostDiscovery.fromConfig(config);
//   const cacheManager = CacheManager.fromConfig(config);
//   const databaseManager = DatabaseManager.fromConfig(config, { logger: root });
//   const tokenManager = ServerTokenManager.noop();
//   const taskScheduler = TaskScheduler.fromConfig(config, { databaseManager });

//   const identity = DefaultIdentityClient.create({
//     discovery,
//   });
//   const permissions = ServerPermissionClient.fromConfig(config, {
//     discovery,
//     tokenManager,
//   });

//   root.info(`Created UrlReader ${reader}`);

//   return (plugin: string): PluginEnvironment => {
//     const logger = root.child({ type: 'plugin', plugin });
//     const database = databaseManager.forPlugin(plugin);
//     const cache = cacheManager.forPlugin(plugin);
//     const scheduler = taskScheduler.forPlugin(plugin);
//     return {
//       logger,
//       database,
//       cache,
//       config,
//       reader,
//       discovery,
//       tokenManager,
//       scheduler,
//       permissions,
//       identity,
//     };
//   };
// }

// async function main() {
//   const config = await loadBackendConfig({
//     argv: process.argv,
//     logger: getRootLogger(),
//   });
//   const createEnv = makeCreateEnv(config);

//   const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
//   const scaffolderEnv = useHotMemoize(module, () => createEnv('scaffolder'));
//   const authEnv = useHotMemoize(module, () => createEnv('auth'));
//   const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));
//   const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));
//   const searchEnv = useHotMemoize(module, () => createEnv('search'));
//   const appEnv = useHotMemoize(module, () => createEnv('app'));
//   const kubernetesEnv = useHotMemoize(module, () => createEnv('kubernetes'));
//   const pagerdutyEnv = useHotMemoize(module, () => createEnv('pagerduty'));

//   const apiRouter = Router();
//   apiRouter.use('/catalog', await catalog(catalogEnv));
//   apiRouter.use('/scaffolder', await scaffolder(scaffolderEnv));
//   apiRouter.use('/auth', await auth(authEnv));
//   apiRouter.use('/techdocs', await techdocs(techdocsEnv));
//   apiRouter.use('/proxy', await proxy(proxyEnv));
//   apiRouter.use('/search', await search(searchEnv));
//   apiRouter.use('/kubernetes', await kubernetes(kubernetesEnv));
//   apiRouter.use('/pagerduty', await pagerduty(pagerdutyEnv));

//   // Add backends ABOVE this line; this 404 handler is the catch-all fallback
//   apiRouter.use(notFoundHandler());

//   const service = createServiceBuilder(module)
//     .loadConfig(config)
//     .addRouter('/api', apiRouter)
//     .addRouter('', await app(appEnv));

//   await service.start().catch(err => {
//     console.log(err);
//     process.exit(1);
//   });
// }

// module.hot?.accept();
// main().catch(error => {
//   console.error('Backend failed to start up', error);
//   process.exit(1);
// });
