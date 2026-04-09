import React from 'react';
import { makeStyles } from '@material-ui/core';
import ExtensionIcon from '@material-ui/icons/Extension';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import SchoolIcon from '@material-ui/icons/School';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import CategoryIcon from '@material-ui/icons/Category';
import {
    Link,
    Sidebar,
    sidebarConfig,
    SidebarDivider,
    SidebarGroup,
    SidebarItem,
    SidebarScrollWrapper,
    SidebarSpace,
    useSidebarOpenState,
} from '@backstage/core-components';
import {
    Settings as SidebarSettings,
    UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
import { SidebarSearchModal } from '@backstage/plugin-search';
import { NavContentBlueprint } from '@backstage/plugin-app-react';
import LogoFull from '../../components/Root/LogoFull';
import LogoIcon from '../../components/Root/LogoIcon';

const useSidebarLogoStyles = makeStyles({
    root: {
        width: sidebarConfig.drawerWidthClosed,
        height: 3 * sidebarConfig.logoHeight,
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
        marginBottom: -14,
    },
    link: {
        width: sidebarConfig.drawerWidthClosed,
        marginLeft: 24,
    },
});

const SidebarLogo = () => {
    const classes = useSidebarLogoStyles();
    const { isOpen } = useSidebarOpenState();

    return (
        <div className={classes.root}>
            <Link
                to="/"
                underline="none"
                className={classes.link}
                aria-label="Home"
            >
                {isOpen ? <LogoFull /> : <LogoIcon />}
            </Link>
        </div>
    );
};

export const SidebarContent = NavContentBlueprint.make({
    params: {
        component: ({ navItems }) => {
            const nav = navItems.withComponent(item => (
                <SidebarItem
                    icon={item.icon ? () => item.icon : ExtensionIcon}
                    to={item.href}
                    text={item.title}
                />
            ));

            // Search and primary pages are placed in fixed groups below.
            const homeItem = nav.take('page:home');
            nav.take('page:search');
            nav.take('page:catalog');
            nav.take('page:api-docs');
            nav.take('page:techdocs');
            nav.take('page:scaffolder');
            nav.take('page:tech-radar');
            nav.take('page:skill-exchange');
            nav.take('page:soundcheck');
            nav.take('page:copilot');
            nav.take('page:insights');
            nav.take('page:rbac');
            nav.take('page:pagerduty');
            nav.take('page:user-settings');

            return (
                <Sidebar>
                    <SidebarLogo />
                    <SidebarGroup
                        label="Search"
                        icon={<SearchIcon />}
                        to="/search"
                    >
                        <SidebarSearchModal />
                    </SidebarGroup>
                    <SidebarDivider />
                    <SidebarGroup label="Menu" icon={<MenuIcon />}>
                        {homeItem}
                        <SidebarItem
                            icon={CategoryIcon}
                            to="/catalog"
                            text="Catalog"
                        />
                        <SidebarItem
                            icon={ExtensionIcon}
                            to="/api-docs"
                            text="APIs"
                        />
                        <SidebarItem
                            icon={LibraryBooks}
                            to="/docs"
                            text="Docs"
                        />
                        <SidebarItem
                            icon={CreateComponentIcon}
                            to="/create"
                            text="Create..."
                        />
                        <SidebarItem
                            icon={ExtensionIcon}
                            to="/tech-radar"
                            text="Tech Radar"
                        />
                        <SidebarDivider />
                        <SidebarScrollWrapper>
                            <SidebarItem
                                icon={SchoolIcon}
                                to="/skill-exchange"
                                text="Skill Exchange"
                            />
                            <SidebarItem
                                icon={DoneAllIcon}
                                to="/soundcheck"
                                text="Soundcheck"
                            />
                            <SidebarItem
                                icon={ExtensionIcon}
                                to="/copilot"
                                text="Copilot"
                            />
                            <SidebarItem
                                icon={ExtensionIcon}
                                to="/rbac"
                                text="RBAC"
                            />
                            {nav.rest({ sortBy: 'title' })}
                        </SidebarScrollWrapper>
                    </SidebarGroup>
                    <SidebarSpace />
                    <SidebarDivider />
                    <SidebarGroup
                        label="Settings"
                        icon={<UserSettingsSignInAvatar />}
                        to="/settings"
                    >
                        <SidebarSettings />
                    </SidebarGroup>
                </Sidebar>
            );
        },
    },
});
