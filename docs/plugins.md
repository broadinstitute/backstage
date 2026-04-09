# Backstage Plugins

## Frontend Architecture

This Backstage app uses the new frontend system. Frontend plugins are registered
in the app feature list in `backstage/packages/app/src/App.tsx` using alpha
plugin exports and `createFrontendModule` overrides where needed.

## Plugin Databases

The following plugins need databases. The databases are created by Terraform in
the deployment directory for dev and prod. It is important to ensure that when
adding a plugin that expects a database, that the database is created, otherwise
the deployment will fail.

The databases are:

- backstage_plugin_app
- backstage_plugin_auth
- backstage_plugin_catalog
- backstage_plugin_scaffolder
- backstage_plugin_search
- backstage_plugin_proxy
- backstage_plugin_techdocs
- backstage_plugin_permission
- backstage_plugin_kubernetes

## Plugins Installed and Configured

### Core Backstage Plugins

The following first-party Backstage plugins are enabled in this instance:

- Kubernetes: Shows Kubernetes resources for annotated catalog entities.
- TechDocs: Builds and renders technical documentation for catalog entities.
- Catalog Graph: Displays software catalog relationships as a graph.
- API Docs: Renders API definitions and explorer pages.
- Scaffolder: Provides software templates and self-service creation flows.
- Search: Indexes and searches catalog, docs, and plugin content.

### Third-Party Plugins

The following third-party plugins are currently installed in this repository.

#### Backstage Community Plugins

- Copilot: Adds the GitHub Copilot page and backend integration for Copilot in
  Backstage.
- GitHub Actions: Adds GitHub Actions workflow history to the CI/CD tab for
  entities with a `github.com/project-slug` annotation.
- GitHub Pull Requests Board: Adds pull request views for teams and components.
- Tech Radar: Renders the engineering tech radar using
  `plugin-configs/tech-radar.json`.
- Scaffolder Backend Annotator Module: Adds scaffolder backend support for
  writing annotations during template execution.
- Tech Radar Backend: Serves backend support for the Tech Radar plugin.

#### PagerDuty Plugins

- PagerDuty: Adds entity cards and integrations for PagerDuty services and
  incidents.
- PagerDuty Entity Processor: Enriches catalog entities with PagerDuty metadata.
- PagerDuty Scaffolder Actions: Adds PagerDuty-related actions to software
  templates.

Entities can be linked to PagerDuty with annotations such as:

```yaml
annotations:
  pagerduty.com/integration-key: [INTEGRATION-KEY]
```

or:

```yaml
annotations:
  pagerduty.com/service-id: [SERVICE-ID]
```

#### Roadie Plugins and Modules

- HTTP Request Field for Scaffolder: Adds a custom scaffolder field that can
  load values from HTTP APIs.
- HTTP Request Scaffolder Backend Module: Adds backend support for Roadie HTTP
  request scaffolder actions.
- Scaffolder Utils Module: Adds helper utilities used by Roadie scaffolder
  actions.

#### Spotify Plugins

- Insights: Collects and visualizes Backstage adoption and usage analytics.
- Insights Analytics Module: Sends analytics events to Spotify Insights.
- RBAC: Provides a UI and backend policy model for role-based access control.
- RBAC Permission Backend Module: Connects RBAC policy data into the Backstage
  permission framework.
- Skill Exchange: Provides an internal marketplace for mentorship, events, and
  skills discovery.
- Skill Exchange Search Backend Module: Indexes Skill Exchange content into
  Backstage search.
- Soundcheck: Adds scorecards, checks, and entity health views to Backstage.
- Soundcheck Backend: Runs Soundcheck checks and serves Soundcheck APIs.
- Soundcheck GitHub Backend Module: Collects GitHub facts for Soundcheck.
- Soundcheck HTTP Backend Module: Collects HTTP-based facts for Soundcheck.
- Soundcheck SCM Backend Module: Collects SCM facts for Soundcheck.

#### TechDocs Addons

- Mermaid TechDocs Addon: Renders Mermaid diagrams inside TechDocs pages.

### Plugin-Specific Notes

#### Kubernetes Plugin

This plugin is enabled and configured to show the Kubernetes tab on the entity
page. It is enabled on a component by adding these annotations to the
component's `catalog-info.yaml` file:

```yaml
annotations:
  backstage.io/kubernetes-id: backstage
  backstage.io/kubernetes-namespace: backstage
```

#### GitHub Actions Plugin

This plugin is visible through the CI/CD tab on the entity page. It is enabled
on a component by adding this annotation:

```yaml
annotations:
  github.com/project-slug: "org/sample-service"
```

#### Catalog Import

Catalog Import is enabled and available in the app through the catalog import
frontend plugin.

#### Tech Radar

To edit the radar contents, update `plugin-configs/tech-radar.json`.

#### Skill Exchange

Skills are managed through `plugin-configs/default-lists.yaml`.

#### Soundcheck

Soundcheck is configured to provide entity scorecards and related health views.
Slack, GitHub, HTTP, and SCM fact collection modules are installed in the
backend.

### Removed Plugins

- Google Cloud Build: This plugin has been removed from the app and is no longer
  in use.

## todo

Configuration as Data (kpt)
