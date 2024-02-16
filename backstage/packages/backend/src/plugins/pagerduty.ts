import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { createRouter } from '@pagerduty/backstage-plugin-backend';

export default async function createPlugin(
    env: PluginEnvironment,
): Promise<Router> {
    return await createRouter({
        config: env.config,
        logger: env.logger,
    });
}
