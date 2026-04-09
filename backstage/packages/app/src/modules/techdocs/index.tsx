import React from 'react';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { TechDocsAddonLocations } from '@backstage/plugin-techdocs-react';
import { AddonBlueprint } from '@backstage/plugin-techdocs-react/alpha';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { Mermaid } from 'backstage-plugin-techdocs-addon-mermaid';
import elkLayouts from '@mermaid-js/layout-elk';

const mermaidElkLayouts = elkLayouts as unknown as React.ComponentProps<
    typeof Mermaid
>['layoutLoaders'];

const DefaultMermaidAddon = () => (
    <Mermaid
        config={{
            theme: 'forest',
            themeVariables: { lineColor: '#000000' },
        }}
    />
);

const ElkMermaidAddon = () => (
    <Mermaid layoutLoaders={mermaidElkLayouts} config={{ layout: 'elk' }} />
);

const reportIssueAddon = AddonBlueprint.make({
    name: 'report-issue',
    params: {
        name: 'ReportIssue',
        location: TechDocsAddonLocations.Content,
        component: ReportIssue,
    },
});

const mermaidAddon = AddonBlueprint.make({
    name: 'mermaid-default',
    params: {
        name: 'MermaidDefault',
        location: TechDocsAddonLocations.Content,
        component: DefaultMermaidAddon,
    },
});

const mermaidElkAddon = AddonBlueprint.make({
    name: 'mermaid-elk',
    params: {
        name: 'MermaidElk',
        location: TechDocsAddonLocations.Content,
        component: ElkMermaidAddon,
    },
});

export const techdocsAddonsModule = createFrontendModule({
    pluginId: 'techdocs',
    extensions: [reportIssueAddon, mermaidAddon, mermaidElkAddon],
});
