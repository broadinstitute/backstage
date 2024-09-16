import {
    createRouter,
    providers,
    defaultAuthProviderFactories,
    getDefaultOwnershipEntityRefs,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {
    stringifyEntityRef,
    DEFAULT_NAMESPACE,
} from '@backstage/catalog-model';

export default async function createPlugin(
    env: PluginEnvironment,
): Promise<Router> {
    return await createRouter({
        logger: env.logger,
        config: env.config,
        database: env.database,
        discovery: env.discovery,
        tokenManager: env.tokenManager,
        providerFactories: {
            ...defaultAuthProviderFactories,

            google: providers.google.create({
                signIn: {
                    resolver: async ({ profile }, ctx) => {
                        if (!profile.email) {
                            throw new Error(
                                'Login failed, user profile does not contain an email',
                            );
                        }
                        // Split the email into the local part and the domain.
                        const [localPart, domain] = profile.email.split('@');

                        // Next we verify the email domain. It is recommended to include this
                        // kind of check if you don't look up the user in an external service.
                        if (domain !== 'broadinstitute.org') {
                            throw new Error(
                                `Login failed, this email ${profile.email} does not belong to the expected domain`,
                            );
                        }
                        return ctx.signInWithCatalogUser({
                            filter: {
                                kind: ['User'],
                                'spec.profile.email': profile.email,
                            },
                        });
                    },
                },
            }),
        },
    });
}
