# Backstage Plugins

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

> Note: This plugin is not currently installed.

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

## Tech Radar

The Technology Radar is a concept created by ThoughtWorks which allows you to
visualize the official guidelines of software languages, processes,
infrastructure, and platforms at that particular company.

In order to edit the tech radar, you will need to edit the `tech-radar.json`
file in the `plugin-configs` directory.

The lifecycle definition is as follows:

- Use: This technology is recommended for use by the majority of teams with a
  specific use case.
- Trial: This technology has been evaluated for specific use cases and has shown
  clear benefits.
- Assess: This technology has the potential to be beneficial for the company.
  Some teams are evaluating it and using it in experimental projects. Using it
  in production comes with a high cost and risk due to lack of in-house
  knowledge, maintenance, and support.
- Hold: We don't want to further invest in this technology or we evaluated it
  and we don't see it as beneficial for the company. Teams should not use it in
  new projects and should plan on migrating to a supported alternative if they
  use it for historical reasons. For broadly adopted technologies, the Radar
  should refer to a migration path to a supported alternative.
- Deprecated: This technology is actively being phased out, or refactored. Teams
  should not use it in new projects and should plan on migrating to a supported
  alternative if they use it for historical reasons.

You can read more about the Tech Radar plugin on this blog post
[here](https://backstage.io/blog/2020/05/14/tech-radar-plugin/). As well as on
the original Authors [blog post](https://opensource.zalando.com/tech-radar/).

## Spotify Plugins

These are Spotify Enterprise Plugins

### Insights

The goals for the
[Insights](https://backstage.spotify.com/docs/plugins/insights/) plugin are to:

- Measure user and plugin adoption
- Identify trends
- Understand user behavior
- Evaluate program success

#### Recent Updates

**Search Integration** - The `searchPage` external route now defaults to
`search.root`, removing the need to include a binding for this route in
`bindRoutes` when setting up the Backstage frontend, unless you want to override
it to point to a different route.

### Skills Exchange

The goals for the
[Skills Exchange](https://backstage.spotify.com/docs/plugins/skill-exchange/)
plugin are to: Provide an internal marketplace to promote and seek out unique,
on-the-job learning opportunities for team members. In Skills Exchange you can
create a skills profile, advertise yourself as a mentor in your topics of
expertise, and browse for mentors that match your learning goals!

You can also create hacks, and events, and create embed opportunities

#### Administration Features

**Admin Moderation** - Skills Exchange now supports configurable admin
moderation via `skillExchange.admins.postCleanupAdmins` configuration. This
allows administrators to:

- Delete or archive Skill Exchange content directly in the UI
- Manage hacks, hack events, mentorships, and mentorship events
- Grant delete and archive permissions to specified user entity references

These admin controls are visible only to configured admins, while post owners
retain the ability to delete their own content.

#### Configuration

**Skills Management** - Skills can be added by updating the `default-lists.yaml`
file in root of the backstage repository. Details on how to do this can be found
in the
[Skills Exchange](https://backstage.spotify.com/docs/plugins/skill-exchange/setup-and-installation#defining-skills-for-ingestion)
documentation.

### Soundcheck

[Soundcheck](https://backstage.spotify.com/docs/plugins/soundcheck/#what-does-soundcheck-help-me-do)
is a tool that helps engineering organizations define and measure development
and operational standards. It provides guidance to improve DevOps practices and
overall tech health. Soundcheck also allows for the prioritization and
visualization of tech health within Backstage.

There are 5 fundamental elements that make up Soundcheck:

Check: A standard or best practice a component is graded against. Check Result:
The result of running a check against a component. Results are either pass or
fail. Track: A long-term tech health initiative. Level: A group of checks that
represent a milestone within a track. Certification: The outcome of passing all
checks within a level.

#### Key Features

**Tech Insights** - Soundcheck provides a Tech Insights page that offers
analytics to track software quality metrics across your organization. This
feature helps teams understand their software quality trends and identify areas
for improvement. Note: For this feature to render correctly, the
[@backstage/ui](https://ui.backstage.io/install) package must be installed and
available in your Backstage instance.

**Track Management** - Teams can manage their tracks with enhanced capabilities
including:

- Manual recertification options for tracks
- Total track and campaign counts for better visibility
- Status filters for entities tables on Campaign Insights pages

**Jira Integration** - Enhanced integration with Jira including:

- Support for personal access token (bearer token) authentication
- New `issues-count` fact that returns the number of issues matching a JQL query
- Improved fact collection capabilities

**Configuration Updates** - Several configuration options have been updated:

- `soundcheck.remote_file_updates` has been deprecated in favor of
  `soundcheck.remoteFileUpdates`
- `soundcheck.programs` has been deprecated in favor of `soundcheck.tracks`

#### Slack Integration Setup

In order to get Slack notifications from your Slack app, it must be added to a
Slack channel. The Slack channel can be either a public or a private channel
that lives in the same workspace that you selected when creating the Slack app.

Right-click on the desired channel in Slack, select View Channel Details, click
on the Integrations tab, and then click on Add Apps. Search for your Slack app
by name, find it in the search results, and then click on the Add button.

### RBAC

The RBAC plugin is a no-code management UI for restricting access to plugins,
routes, and data within Backstage.
[Core Concepts](https://backstage.spotify.com/docs/plugins/rbac/core-concepts)
can be found are on the Spotify Backstage docs site and will be useful for
admins to understand how to configure new policies.

The default policy is to allow all authorized users to access all catalog
entities and nearly all plugins. The only exceptions are the RBAC plugin itself.

## todo

Configuration as Data (kpt)
