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
} from '@backstage/plugin-home';
import {
    Content,
    Page,
    InfoCard,
    Header,
} from '@backstage/core-components';
import {
    Box,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    TextField,
    Typography,
} from '@material-ui/core';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { searchPlugin } from '@backstage/plugin-search';
import { SearchContextProvider } from '@backstage/plugin-search-react';
import { useRouteRef } from '@backstage/core-plugin-api';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { SupportButton } from '@backstage/core-components';
import { useNavigate } from 'react-router-dom';
import { tools, useLogoStyles } from './shared';

export default {
    title: 'Backstage Home Page',
};

const useStyles = makeStyles(theme => ({
    hero: {
        borderRadius: theme.shape.borderRadius * 2,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        padding: theme.spacing(5, 3),
        marginBottom: theme.spacing(4),
        textAlign: 'center',
    },
    searchBarInput: {
        maxWidth: '60vw',
        margin: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '50px',
        boxShadow: theme.shadows[2],
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover, &:focus-within': {
            boxShadow: theme.shadows[4],
        },
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
    sectionTitle: {
        fontWeight: 600,
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(1),
    },
    panel: {
        height: '100%',
    },
    docsList: {
        padding: 0,
    },
    docsListItem: {
        borderRadius: theme.shape.borderRadius,
        transition: 'background-color 0.15s ease-in-out',
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    },
    docsIcon: {
        minWidth: theme.spacing(4),
        color: theme.palette.primary.main,
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

const gettingStartedLinks = [
    {
        href: '/docs/default/system/idp',
        label: 'Getting started with Backstage',
    },
    {
        href: '/docs/default/component/bits-adr',
        label: 'Getting started with Architecture Decision Records (ADRs)',
    },
    {
        href: '/docs/default/component/kubernetes-configs',
        label: 'Getting started with Kubernetes',
    },
    {
        href: '/docs/default/component/shared-workflows',
        label: 'Getting started with Broad curated GitHub Actions',
    },
    {
        href: '/docs/default/component/bits-packaging-pipeline/spack-quickstart',
        label: 'Getting started with Spack Packages',
    },
    {
        href: '/docs/default/component/ge-user-docs',
        label: 'Getting started with Grid Engine',
    },
    {
        href: '/docs/default/component/disco-docs',
        label: 'Getting started with DISCO (Being retired)',
    },
];

export const HomePage = () => {
    const classes = useStyles();
    const { svg, path, container } = useLogoStyles();
    const searchRouteRef = useRouteRef(searchPlugin.routes.root);
    const navigate = useNavigate();

    const handleSearchSubmit = (query: string) => {
        const searchUrl = `${searchRouteRef()}?query=${encodeURIComponent(query)}`;
        navigate(searchUrl);
    };

    return (
        <SearchContextProvider>
            <Page themeId="home">
                <Header title={<WelcomeTitle />} pageTitleOverride="Home">
                    <HeaderWorldClock
                        clockConfigs={clockConfigs}
                        customTimeFormat={timeFormat}
                    />
                    <Box className={classes.supportButton}>
                        <SupportButton />
                    </Box>
                </Header>
                <Content>
                    <Grid container justifyContent="center" spacing={3}>
                        <Grid item xs={12}>
                            <Box className={classes.hero}>
                                <HomePageCompanyLogo
                                    className={container}
                                    logo={
                                        <TemplateBackstageLogo
                                            classes={{ svg, path }}
                                        />
                                    }
                                />
                                <Box
                                    component="form"
                                    onSubmit={(
                                        e: React.FormEvent<HTMLFormElement>,
                                    ) => {
                                        e.preventDefault();
                                        const formData = new FormData(
                                            e.currentTarget,
                                        );
                                        const query = formData.get(
                                            'query',
                                        ) as string;
                                        if (query) {
                                            handleSearchSubmit(query);
                                        }
                                    }}
                                    sx={{
                                        maxWidth: '60vw',
                                        width: '100%',
                                        margin: '0 auto',
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        name="query"
                                        placeholder="Search"
                                        variant="outlined"
                                        InputProps={{
                                            classes: {
                                                root: classes.searchBarInput,
                                                notchedOutline:
                                                    classes.searchBarOutline,
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <InfoCard
                                title="Getting Started Documentation"
                                className={classes.panel}
                            >
                                <List className={classes.docsList}>
                                    {gettingStartedLinks.map(link => (
                                        <ListItem
                                            key={link.href}
                                            button
                                            component="a"
                                            href={link.href}
                                            className={classes.docsListItem}
                                        >
                                            <ListItemIcon
                                                className={classes.docsIcon}
                                            >
                                                <MenuBookIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={link.label}
                                            />
                                            <ChevronRightIcon
                                                color="disabled"
                                                fontSize="small"
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </InfoCard>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper variant="outlined" className={classes.panel}>
                                <Box p={2}>
                                    <Typography
                                        variant="h6"
                                        className={classes.sectionTitle}
                                    >
                                        Quick Links
                                    </Typography>
                                    <HomePageToolkit tools={tools} />
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <HomePageStarredEntities />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <HomePageTopVisited />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <HomePageRecentlyVisited />
                        </Grid>
                    </Grid>
                </Content>
            </Page>
        </SearchContextProvider>
    );
};
