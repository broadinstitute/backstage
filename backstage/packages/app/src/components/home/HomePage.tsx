import {
    HomePageCompanyLogo,
    TemplateBackstageLogo,
    HomePageStarredEntities,
    HomePageToolkit,
    HomePageTopVisited,
    HomePageRecentlyVisited,
    WelcomeTitle,
    HeaderWorldClock,
    ClockConfig,
    TemplateBackstageLogoIcon,
} from '@backstage/plugin-home';
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
import { tools, useLogoStyles } from './shared';

export default {
    title: 'Backstage Home Page',
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
            color: theme.palette.common.white,
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
                backgroundColor: theme.palette.primary.dark,
            },
        },
    },
}));

const clockConfigs: ClockConfig[] = [
    {
        label: 'NYC',
        timeZone: 'America/New_York',
    },
    {
        label: 'UTC',
        timeZone: 'UTC',
    },
    {
        label: 'STO',
        timeZone: 'Europe/Stockholm',
    },
    {
        label: 'TYO',
        timeZone: 'Asia/Tokyo',
    },
];

const timeFormat: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
};

export const HomePage = () => {
    const classes = useStyles();
    const { svg, path, container } = useLogoStyles();

    return (
        <SearchContextProvider>
            <Page themeId="home">
                <Header title={<WelcomeTitle />} pageTitleOverride="Home">
                    <HeaderWorldClock
                        clockConfigs={clockConfigs}
                        customTimeFormat={timeFormat}
                    />
                </Header>
                <Content>
                    <Grid container justifyContent="center" spacing={2}>
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
                                <HomePageTopVisited />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <HomePageRecentlyVisited />
                            </Grid>
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={6}>
                                <HomePageStarredEntities />
                            </Grid>
                            <Grid item xs={6}>
                                <HomePageToolkit tools={tools} />
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
                                </InfoCard>
                            </Grid>
                        </Grid>
                    </Grid>
                </Content>
            </Page>
        </SearchContextProvider>
    );
};
