import { createBackend } from '@backstage/backend-defaults';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { githubOrgEntityProviderTransformsExtensionPoint } from '@backstage/plugin-catalog-backend-module-github-org';
// Import { legacyPlugin } from '@backstage/backend-common';
import { myVerifiedUserTransformer } from './transformers';

// Sign in users who are not in the catalog
import { googleAuthenticator } from '@backstage/plugin-auth-backend-module-google-provider';
import { githubAuthenticator } from '@backstage/plugin-auth-backend-module-github-provider';
import {
    stringifyEntityRef,
    DEFAULT_NAMESPACE,
} from '@backstage/catalog-model';
import {
    authProvidersExtensionPoint,
    createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { NotFoundError } from '@backstage/errors';

const customAuth = createBackendModule({
    // This ID must be exactly "auth" because that's the plugin it targets
    pluginId: 'auth',
    // This ID must be unique, but can be anything
    moduleId: 'custom-google-auth-provider',
    register(reg) {
        reg.registerInit({
            deps: {
                providers: authProvidersExtensionPoint,
            },
            async init({ providers }) {
                providers.registerProvider({
                    // This ID must match the actual provider config, e.g. addressing
                    // auth.providers.github means that this must be "github".
                    providerId: 'google',
                    factory: createOAuthProviderFactory({
                        authenticator: googleAuthenticator,
                        async signInResolver({ profile }, ctx) {
                            if (!profile.email) {
                                throw new Error(
                                    'Login failed, user profile does not contain an email',
                                );
                            }
                            // Split the email into the local part and the domain.
                            const [localPart, domain] =
                                profile.email.split('@');

                            // Next we verify the email domain. It is recommended to include this
                            // kind of check if you don't look up the user in an external service.
                            if (domain !== 'broadinstitute.org') {
                                throw new Error(
                                    `Login failed, '${profile.email}' does not belong to the expected domain`,
                                );
                            }

                            const userEntityRef = stringifyEntityRef({
                                kind: 'User',
                                name: localPart,
                                namespace: DEFAULT_NAMESPACE,
                            });
                            try {
                                await ctx.findCatalogUser({
                                    filter: {
                                        kind: ['User'],
                                        'spec.profile.email': profile.email,
                                    },
                                });
                            } catch (error) {
                                if (error instanceof NotFoundError) {
                                    // findCatalogUser will throw a NotFoundError if the User is not found in the Catalog

                                    return ctx.issueToken({
                                        claims: {
                                            sub: userEntityRef,
                                            ent: [userEntityRef],
                                        },
                                    });
                                }
                            }

                            // User exists sign them in with their Catalog User
                            return ctx.signInWithCatalogUser({
                                filter: {
                                    kind: ['User'],
                                    'spec.profile.email': profile.email,
                                },
                            });
                        },
                    }),
                });
            },
        });
    },
});

// Transforms the User entity to add the verified email from the GitHub Org
const githubOrgModule = createBackendModule({
    pluginId: 'catalog',
    moduleId: 'github-org-extensions',
    register(env) {
        env.registerInit({
            deps: {
                githubOrg: githubOrgEntityProviderTransformsExtensionPoint,
            },
            async init({ githubOrg }) {
                githubOrg.setUserTransformer(myVerifiedUserTransformer);
            },
        });
    },
});

const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend/alpha'));
backend.add(import('@backstage/plugin-proxy-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
backend.add(import('@backstage/plugin-techdocs-backend/alpha'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
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

// scaffolder plugins
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(
  import('@roadiehq/scaffolder-backend-module-http-request/new-backend'),
);
backend.add(import('@roadiehq/scaffolder-backend-module-utils/new-backend'));

// Map  Org emails to GitHub user entities in the catalog
backend.add(githubOrgModule);

// Custom auth provider
backend.add(customAuth);

backend.start();
