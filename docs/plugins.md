# Backstage Plugins

## Plugin Databases

The following plugins need databases. The databases are created by
Terraform in the deployment directory for dev and prod. It is important
to ensure that when adding a plugin that expects a database, that the
database is created, otherwise the deployment will fail.

The databases are:

* backstage_plugin_app
* backstage_plugin_auth
* backstage_plugin_catalog
* backstage_plugin_scaffolder
* backstage_plugin_search
* backstage_plugin_proxy
* backstage_plugin_techdocs
* backstage_plugin_permission
* backstage_plugin_kubernetes

## Plugins Installed and Configured

### Kubernetes Plugin

This plugin is enabled and is configured to show the Kubernetes tab on the
Entity Page. It is enabled on a component by adding this annotation to the
component's catalog-info.yaml file:

```Yaml
    backstage.io/kubernetes-id: backstage
    backstage.io/kubernetes-namespace: backstage
```

## GCP Project Creator

This plugin is used to create a new GCP project. It is not currently added to
the UI, however can be viewed but browsing to the following URL:
https://backstage.broadinstitute.org/gcp-projects currently in production you'll
recieve a 403 error.

## GitHub Pull Requests Plugin

This plugin is installed and creates a card on the Entity Page.

## GitHub Actions Plugin

This plugin is installed and viewable through the CI/CD Tab on the Entity Page.

It is enabled on a component by adding this annotation to the component's
catalog-info.yaml file:

```Yaml
  annotations:
    github.com/project-slug: 'org/sample-service'
```

## Google Cloud Build

This has been install but is still a work in progress.

## PagerDuty

>Note: This plugin is not currently installed.

Annotating entities For every component that shows up in your Backstage catalog
you have a .yaml file with its configuration. Add an annotation to the entity
like this:

```Yaml
annotations:
  pagerduty.com/integration-key: [INTEGRATION-KEY]
```

You can optionally decide to annotate with a service id instead but you won't be
able to create incidents from Backstage if you do so.

```Yaml
annotations:
    pagerduty.com/service-id: [SERVICE-ID]
```

## Cost Insights

The Cost Insights plugin is installed and configured to show the Cost Insights
using mock data.

## todo

Configuration as Data (kpt)
