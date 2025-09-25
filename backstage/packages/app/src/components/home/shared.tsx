/*
 * Copyright 2025 The Backstage Authors
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

import { TemplateBackstageLogoIcon } from '@backstage/plugin-home';
import { makeStyles } from '@material-ui/core/styles';
import {
    Content,
    Page,
    InfoCard,
    GitHubIcon,
    HelpIcon,
    DashboardIcon,
    Header,
} from '@backstage/core-components';

export const useLogoStyles = makeStyles(theme => ({
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

export const tools = [
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
    {
        url: 'https://www.cloudskillsboost.google/',
        label: 'No Cost Training (Google)',
        icon: <DashboardIcon />,
    },
];
