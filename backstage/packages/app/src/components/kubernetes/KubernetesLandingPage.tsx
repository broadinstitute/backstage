import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Grid,
    TextField,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import {
    CATALOG_FILTER_EXISTS,
    catalogApiRef,
    EntityRefLink,
    useEntityRefLink,
} from '@backstage/plugin-catalog-react';
import { Progress, ResponseErrorPanel, Link } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import {
    KUBERNETES_ANNOTATION,
    KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION,
} from '@backstage/plugin-kubernetes-common';

const useStyles = makeStyles(theme => ({
    page: {
        padding: theme.spacing(3),
    },
    intro: {
        marginBottom: theme.spacing(3),
    },
    search: {
        marginBottom: theme.spacing(3),
        maxWidth: 420,
    },
    metaRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(1),
        marginTop: theme.spacing(1.5),
        marginBottom: theme.spacing(1.5),
    },
    linkRow: {
        marginTop: theme.spacing(2),
        display: 'flex',
        gap: theme.spacing(2),
        alignItems: 'center',
    },
    emptyState: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(3),
    },
}));

type KubernetesEntity = Entity & {
    spec?: {
        owner?: string;
        type?: string;
    };
};

const hasKubernetesConfig = (entity: KubernetesEntity) => {
    const annotations = entity.metadata.annotations ?? {};

    return Boolean(
        annotations[KUBERNETES_ANNOTATION] ||
            annotations[KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION],
    );
};

export const KubernetesLandingPage = () => {
    const classes = useStyles();
    const catalogApi = useApi(catalogApiRef);
    const entityRefLink = useEntityRefLink();
    const [entities, setEntities] = useState<KubernetesEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            setLoading(true);
            setError(undefined);

            try {
                const response = await catalogApi.getEntities({
                    filter: [
                        {
                            [`metadata.annotations.${KUBERNETES_ANNOTATION}`]:
                                CATALOG_FILTER_EXISTS,
                        },
                        {
                            [`metadata.annotations.${KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION}`]:
                                CATALOG_FILTER_EXISTS,
                        },
                    ],
                    fields: [
                        'kind',
                        'metadata.name',
                        'metadata.namespace',
                        'metadata.title',
                        'metadata.annotations',
                        'spec.owner',
                        'spec.type',
                    ],
                    order: {
                        field: 'metadata.name',
                        order: 'asc',
                    },
                });

                if (!mounted) {
                    return;
                }

                setEntities(
                    response.items
                        .filter(hasKubernetesConfig)
                        .sort((left, right) => {
                            const leftName =
                                left.metadata.title ?? left.metadata.name;
                            const rightName =
                                right.metadata.title ?? right.metadata.name;

                            return leftName.localeCompare(rightName);
                        }) as KubernetesEntity[],
                );
            } catch (loadError) {
                if (mounted) {
                    setError(loadError as Error);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, [catalogApi]);

    const normalizedQuery = deferredQuery.trim().toLocaleLowerCase('en-US');
    const filteredEntities = useMemo(
        () =>
            entities.filter(entity => {
                if (!normalizedQuery) {
                    return true;
                }

                const values = [
                    entity.metadata.title,
                    entity.metadata.name,
                    entity.kind,
                    entity.metadata.namespace,
                    entity.spec?.owner,
                    entity.spec?.type,
                    entity.metadata.annotations?.[KUBERNETES_ANNOTATION],
                    entity.metadata.annotations?.[
                        KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION
                    ],
                ]
                    .filter(Boolean)
                    .map(value => String(value).toLocaleLowerCase('en-US'));

                return values.some(value => value.includes(normalizedQuery));
            }),
        [entities, normalizedQuery],
    );

    if (loading) {
        return <Progress />;
    }

    if (error) {
        return <ResponseErrorPanel error={error} />;
    }

    return (
        <Box className={classes.page}>
            <Box className={classes.intro}>
                <Typography variant="h4" gutterBottom>
                    Kubernetes
                </Typography>
                <Typography variant="body1" paragraph>
                    Browse catalog entities that expose Kubernetes metadata and
                    jump directly to their Kubernetes tabs.
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Found {entities.length} Kubernetes-enabled
                    {entities.length === 1 ? ' entity' : ' entities'}.
                </Typography>
            </Box>

            <TextField
                className={classes.search}
                fullWidth
                label="Search Kubernetes entities"
                placeholder="Filter by name, owner, kind, namespace, or annotation"
                value={query}
                onChange={event => setQuery(event.target.value)}
                variant="outlined"
            />

            {!filteredEntities.length ? (
                <Card className={classes.emptyState}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            No matching entities
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Adjust the search text or add Kubernetes annotations
                            to catalog entities to surface them here.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {filteredEntities.map(entity => {
                        const entityRef = stringifyEntityRef(entity);
                        const kubernetesPath = `${entityRefLink(entityRef)}/kubernetes`;
                        const kubernetesId =
                            entity.metadata.annotations?.[
                                KUBERNETES_ANNOTATION
                            ];
                        const labelSelector =
                            entity.metadata.annotations?.[
                                KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION
                            ];

                        return (
                            <Grid item xs={12} md={6} lg={4} key={entityRef}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            <EntityRefLink
                                                entityRef={entityRef}
                                            />
                                        </Typography>

                                        <Box className={classes.metaRow}>
                                            <Chip
                                                label={entity.kind}
                                                size="small"
                                            />
                                            <Chip
                                                label={
                                                    entity.metadata.namespace ??
                                                    'default'
                                                }
                                                size="small"
                                            />
                                            {entity.spec?.type ? (
                                                <Chip
                                                    label={entity.spec.type}
                                                    size="small"
                                                />
                                            ) : null}
                                            {entity.spec?.owner ? (
                                                <Chip
                                                    label={`Owner: ${entity.spec.owner}`}
                                                    size="small"
                                                />
                                            ) : null}
                                        </Box>

                                        {kubernetesId ? (
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                paragraph
                                            >
                                                Kubernetes ID: {kubernetesId}
                                            </Typography>
                                        ) : null}

                                        {labelSelector ? (
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                paragraph
                                            >
                                                Label selector: {labelSelector}
                                            </Typography>
                                        ) : null}

                                        <Box className={classes.linkRow}>
                                            <Link to={kubernetesPath}>
                                                Open Kubernetes tab
                                            </Link>
                                            <Link to={entityRefLink(entityRef)}>
                                                Open entity
                                            </Link>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
};
