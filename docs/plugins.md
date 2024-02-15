# Plugins Intalled and Configured


## Kubernetes Plugin

This plugin is enabled and is configured to show the Kubernetes tab on the Entity Page. It is enabled on a component by adding this annotation to the component's catalog-info.yaml file:

```Yaml
    backstage.io/kubernetes-id: backstage
    backstage.io/kubernetes-namespace: backstage
```

## GCP Project Creator
This plugin is used to create a new GCP project. It is not currently added to the UI, however can be viewed but browsing to the following URL: https://backstage.broadinstitute.org/gcp-projects  currently in production you'll recieve a 403 error.

## GitHub Pull Requests Plugin

This plugin is installed and creates a card on the Entity Page.

## GitHub Actions Plugin

This plugin is installed and viewable through the CI/CD Tab on the Entity Page.

It is enabled on a component by adding this annotation to the component's catalog-info.yaml file:

```Yaml
  annotations:
    github.com/project-slug: 'org/sample-service'
```

## Google Cloud Build

This has been install but is still a work in progress.

## PagerDuty

Annotating entities
For every component that shows up in your Backstage catalog you have a .yaml file with its configuration. Add an annotation to the entity like this:

```Yaml
annotations:
  pagerduty.com/integration-key: [INTEGRATION-KEY]
  ```
You can optionally decide to annotate with a service id instead but you won't be able to create incidents from Backstage if you do so.

```Yaml
annotations:
    pagerduty.com/service-id: [SERVICE-ID]
```

## todo
Configuration as Data (kpt)
