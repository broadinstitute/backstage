import React from 'react';
import { Grid } from '@material-ui/core';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import {
    EntityCardBlueprint,
    EntityContentBlueprint,
} from '@backstage/plugin-catalog-react/alpha';
import {
    EntityHasApisCard,
    EntityConsumedApisCard,
    EntityProvidedApisCard,
} from '@backstage/plugin-api-docs';
import {
    EntityDependsOnComponentsCard,
    EntityDependsOnResourcesCard,
} from '@backstage/plugin-catalog';
import {
    Direction,
    EntityCatalogGraphCard,
} from '@backstage/plugin-catalog-graph';
import {
    Entity,
    RELATION_API_CONSUMED_BY,
    RELATION_API_PROVIDED_BY,
    RELATION_CONSUMES_API,
    RELATION_DEPENDENCY_OF,
    RELATION_DEPENDS_ON,
    RELATION_HAS_PART,
    RELATION_PART_OF,
    RELATION_PROVIDES_API,
} from '@backstage/catalog-model';

const SystemHasApisEntityCard = () => <EntityHasApisCard variant="gridItem" />;

const DependenciesEntityContent = () => (
    <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
            <EntityDependsOnComponentsCard />
        </Grid>
        <Grid item md={6}>
            <EntityDependsOnResourcesCard />
        </Grid>
    </Grid>
);

const SystemDiagramEntityContent = () => (
    <EntityCatalogGraphCard
        direction={Direction.TOP_BOTTOM}
        title="System Diagram"
        height={700}
        relations={[
            RELATION_PART_OF,
            RELATION_HAS_PART,
            RELATION_API_CONSUMED_BY,
            RELATION_API_PROVIDED_BY,
            RELATION_CONSUMES_API,
            RELATION_PROVIDES_API,
            RELATION_DEPENDENCY_OF,
            RELATION_DEPENDS_ON,
        ]}
        unidirectional={false}
    />
);

const ComponentApiEntityContent = () => (
    <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
            <EntityProvidedApisCard />
        </Grid>
        <Grid item md={6}>
            <EntityConsumedApisCard />
        </Grid>
    </Grid>
);

const isServiceOrWebsiteComponent = (entity: Entity): boolean => {
    if (entity.kind.toLocaleLowerCase('en-US') !== 'component') {
        return false;
    }

    const type = entity.spec?.type;
    return type === 'service' || type === 'website';
};

export const catalogEntityModule = createFrontendModule({
    pluginId: 'catalog',
    extensions: [
        EntityCardBlueprint.make({
            name: 'has-apis-system',
            params: {
                filter: 'kind:system',
                loader: async () => <SystemHasApisEntityCard />,
            },
        }),
        EntityContentBlueprint.make({
            name: 'api-component',
            params: {
                path: '/api',
                title: 'API',
                filter: (entity: Entity) =>
                    entity.kind.toLocaleLowerCase('en-US') === 'component' &&
                    entity.spec?.type === 'service',
                loader: async () => <ComponentApiEntityContent />,
            },
        }),
        EntityContentBlueprint.make({
            name: 'diagram-system',
            params: {
                path: '/diagram',
                title: 'Diagram',
                filter: 'kind:system',
                loader: async () => <SystemDiagramEntityContent />,
            },
        }),
    ],
});
