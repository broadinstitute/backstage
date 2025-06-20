/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    HomePageToolkit,
    HomePageCompanyLogo,
    HomePageStarredEntities,
    TemplateBackstageLogo,
    TemplateBackstageLogoIcon,
} from '@backstage/plugin-home';
import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';
import {
    Content,
    Page,
    InfoCard,
    GitHubIcon,
    HelpIcon,
    DashboardIcon,
    Header,
} from '@backstage/core-components';
import { Box } from '@material-ui/core';
import {
    starredEntitiesApiRef,
    entityRouteRef,
    catalogApiRef,
} from '@backstage/plugin-catalog-react';
import { configApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/config';
import { HomePageSearchBar, searchPlugin } from '@backstage/plugin-search';
import {
    searchApiRef,
    SearchContextProvider,
} from '@backstage/plugin-search-react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, { ComponentType, PropsWithChildren } from 'react';
import { SupportButton } from '@backstage/core-components';

export default {
    title: 'Backstage Home Page',
    // decorators: [
    //   (Story: ComponentType<PropsWithChildren<{}>>) =>
    //     wrapInTestApp(
    //       <>
    //         <TestApiProvider
    //           apis={[
    //             [catalogApiRef, catalogApi],
    //             [starredEntitiesApiRef, starredEntitiesApi],
    //             [searchApiRef, { query: () => Promise.resolve({ results: [] }) }],
    //             [
    //               configApiRef,
    //               new ConfigReader({
    //                 stackoverflow: {
    //                   baseUrl: 'https://api.stackexchange.com/2.2',
    //                 },
    //               }),
    //             ],
    //           ]}
    //         >
    //           <Story />
    //         </TestApiProvider>
    //       </>,
    //       {
    //         mountedRoutes: {
    //           '/hello-company': searchPlugin.routes.root,
    //           '/catalog/:namespace/:kind/:name': entityRouteRef,
    //         },
    //       },
    //     ),
    // ],
};

const useStyles = makeStyles(theme => ({
    searchBarInput: {
        maxWidth: '60vw',
        margin: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '50px',
        boxShadow: theme.shadows[1],
    },
    searchBarOutline: {
        borderStyle: 'none',
    },
    supportButton: {
        '& button': {
            color: '#ffffff',
            backgroundColor: '#1976d2',
            '&:hover': {
                backgroundColor: '#1565c0',
            },
        },
    },
}));

const useLogoStyles = makeStyles(theme => ({
    container: {
        margin: theme.spacing(5, 0),
    },
    svg: {
        width: 'auto',
        height: 100,
    },
    path: {
        fill: '#7df3e1',
    },
}));

export const HomePage = () => {
    const classes = useStyles();
    const { svg, path, container } = useLogoStyles();

    return (
        <SearchContextProvider>
            <Page themeId="home">
                <Header title="Welcome to Backstage" pageTitleOverride="Home">
                    <Box className={classes.supportButton}>
                        <SupportButton />
                    </Box>
                </Header>
                <Content>
                    <Grid container justifyContent="center" spacing={6}>
                        <HomePageCompanyLogo
                            className={container}
                            logo={
                                <TemplateBackstageLogo
                                    classes={{ svg, path }}
                                />
                            }
                        />
                        <Grid container item xs={12} justifyContent="center">
                            <HomePageSearchBar
                                InputProps={{
                                    classes: {
                                        root: classes.searchBarInput,
                                        notchedOutline:
                                            classes.searchBarOutline,
                                    },
                                }}
                                placeholder="Search"
                            />
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={12} md={6}>
                                <HomePageStarredEntities />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <HomePageToolkit
                                    tools={[
                                        {
                                            url: '#',
                                            label: 'Backstage',
                                            icon: <TemplateBackstageLogoIcon />,
                                        },
                                        {
                                            url: 'https://github.com/broadinstitute',
                                            label: 'Broad Institute',
                                            icon: <GitHubIcon />,
                                        },
                                        {
                                            url: 'https://broad.service-now.com/esc?id=ec_pro_dashboard',
                                            label: 'ServiceNow',
                                            icon: <HelpIcon />,
                                        },
                                        {
                                            url: 'https://netbox.broadinstitute.org/',
                                            label: 'Netbox',
                                            icon: <DashboardIcon />,
                                        },
                                        {
                                            url: 'https://ddi.broadinstitute.org/',
                                            label: 'DNS, DHCP, IPAM (DDI)',
                                            icon: <DashboardIcon />,
                                        },
                                        {
                                            url: 'https://grafana-devnull.broadinstitute.org/',
                                            label: 'Grafana (DevNull)',
                                            icon: <DashboardIcon />,
                                        },
                                    ]}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InfoCard title="Getting Started Documentation">
                                    Pages to get started
                                    <ul>
                                        <li>
                                            <a href="/docs/default/system/backstage">
                                                Getting started with Backstage
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/docs/default/component/bits-adr">
                                                Getting started with
                                                Architecture Decision Records
                                                (ADRs)
                                            </a>
                                        </li>

                                        <li>
                                            <a href="/docs/default/component/kubernetes-configs">
                                                Getting started with Kubernetes
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/docs/default/component/shared-workflows">
                                                Getting started with Broad
                                                curated GitHub Actions
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/docs/default/component/bits-packaging-pipeline/spack-quickstart">
                                                Getting started with Spack
                                                Packages
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/docs/default/component/ge-user-docs">
                                                Getting started with Grid Engine
                                            </a>
                                        </li>

                                        <li>
                                            <a href="/docs/default/component/disco-docs">
                                                Getting started with DISCO
                                                (Being retired)
                                            </a>
                                        </li>
                                    </ul>
                                    <div style={{ height: 370 }} />
                                </InfoCard>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InfoCard title="Composable Section">
                                    {/* pl</EntitySwitch.Case> placeholder for content */}
                                </InfoCard>
                            </Grid>
                        </Grid>
                    </Grid>
                </Content>
            </Page>
        </SearchContextProvider>
    );
};
