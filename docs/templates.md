# Introduction to Software Templates

List of actions https://backstage.broadinstitute.org/create/actions

Interactive Editor for Software Templates **_NOTE_** The interactive editor does
[not currently support placeholders](https://backstage.io/docs/features/software-templates/input-examples#use-placeholders-to-reference-remote-files:~:text=Testing%20of%20this%20functionality%20is%20not%20yet%20supported%20using%20create/edit.%20In%20addition%2C%20this%20functionality%20only%20works%20for%20remote%20files%20and%20not%20local%20files.%20You%20also%20cannot%20nest%20files.),
so you will need to manually replace placeholders with the appropriate values.
in order to use the [interactive editor](/create/edit)

We have created a helper script to help "compile" template yaml files that use
placeholders. This can be run as
`mise expand_template ./scaffolder-templates/example/template.yaml` from the
root of the `software-templates` repo.

## Sharing Software Templates

When publishing a software template, in order to share it outside the group that
owns the template, templates require either the `recommended` or `production`
tag to be added to the template. Otherwise other folks will only see templates
that are owned by them, and templates with the `recommended` or `production`
tags.

### Local Development of Software Templates

Our software templates are stored in a
[separate repository](/catalog/default/component/software-templates). Because we
have split software templates into reusable parts, make sure that you run the
`expand_template` workflow to replace placeholders with actual values during
development and testing.

This link has more information about
[reusable components](https://backstage.io/docs/features/software-templates/input-examples#use-placeholders-to-reference-remote-files),
and how we use the `url` field in the app-config.yaml to reference templates.

This means that when you are developing a new template, you need to push your
changes to a branch in order to test them. You can also create a monolithic
template in order to run local development without neededing to push to a
branch. The config can be made into separate files once you are happy with the
result. If you do this, put your local template in `app-config.local.yaml` using
a `file` type url, and then use the `url` field in `app-config.production.yaml`
to reference the final template.

Example of a local refrence using `file` in `app-config.local.yaml`:

```yaml
- type: file
  target: ../../templates/scaffolder/example/template.yaml
  rules:
    - allow: [Template]
```

Example of a remote reference using `url` in `app-config.production.yaml`:

```yaml
- type: url
  target: https://raw.githubusercontent.com/broadinstitute/backstage-terraform-provider/main/templates/scaffolder/terraform-control-module/template.yaml
  rules:
    - allow: [Template]
```

If you want to reference software templates in your feature branch, so that you
can test templates you'll need to add a `BRANCH_NAME` environment variable. The
`.envrc` file does this for you if you use `direnv`, or you can do so manually
with a command like : `export BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)`

### Useful resources

[UI Examples](https://backstage.io/docs/features/software-templates/ui-options-examples/)

[Scafolder parameters](https://roadie.io/docs/scaffolder/scaffolder-parameters/)

highlightin this page
https://roadie.io/docs/scaffolder/scaffolder-parameters/#picker-from-external-api-source

[Summary page of usefal actions](https://roadie.io/docs/scaffolder/scaffolder-actions-directory/)

https://backstage.io/docs/features/software-templates/writing-templates/#specsteps---action

[Conditional steps in a software template](https://backstage.io/docs/features/software-templates/input-examples/#use-parameters-as-condition-in-steps)

conditionals use this syntax: `if: ${{ parameters.skipStep }}`

A few examples:

```yaml
- name: Only development environments
  if:
    ${{ parameters.environment === "staging" or parameters.environment ===
    "development" }}
  action: debug:log
  input:
    message: "development step"

- name: Only production environments
  if:
    ${{ parameters.environment === "prod" or parameters.environment ===
    "production" }}
  action: debug:log
  input:
    message: "production step"

- name: Non-production environments
  if:
    ${{ parameters.environment !== "prod" and parameters.environment !==
    "production" }}
  action: debug:log
  input:
    message: "non-production step"
```

Use parameters as conditional for fields:

```yaml
parameters:
  - title: Fill in some steps
    properties:
      includeName:
        title: Include Name?
        type: boolean
        default: true

    dependencies:
      includeName:
        allOf:
          - if:
              properties:
                includeName:
                  const: true
            then:
              properties:
                lastName:
                  title: Last Name
                  type: string
              # You can use additional fields of parameters within conditional parameters such as required.
              required:
                - lastName
```

## Custom Field Extensions

Besides Roadie's
[picker from API source](https://roadie.io/docs/scaffolder/scaffolder-parameters/#picker-from-external-api-source),
we maintain two custom Scaffolder field extensions for working with GCP, adapted
from the patterns in
[datolabs-io/backstage-plugins](https://github.com/datolabs-io/backstage-plugins).
Both live under `packages/app/src/scaffolder/` and are registered in
`packages/app/src/App.tsx`. They rely on the `additionalScopes` already
configured for the `google` auth provider in `app-config.production.yaml`
(`https://www.googleapis.com/auth/cloud-platform`), which is why they only work
for users who sign in with Google.

They are commonly used together: `GcpResourcePicker` lets the user pick a
project or folder, and `GoogleAccessToken` forwards that same user's credentials
to a backend action so it can act on GCP as them instead of as a service
account.

### GoogleAccessToken

`ui:field: GoogleAccessToken` renders nothing in the form. Instead it silently
fetches the signed-in user's Google OAuth access token and puts it into the
Scaffolder task's secrets under `googleAccessToken` (not into `parameters`, so
it is never persisted to the template's stored values). Later steps can read it
as `${{ secrets.googleAccessToken }}`, which is useful for any backend action
that needs to call GCP as the requesting user rather than as a shared service
account.

Add it as a hidden field so it doesn't show a widget:

```yaml
parameters:
  - title: Authenticate to GCP
    properties:
      googleAccessToken:
        type: string
        ui:field: GoogleAccessToken
        ui:widget: hidden
```

Then use the secret in a later step:

```yaml
steps:
  - id: gcp-action
    name: Do something in GCP
    action: gcp:some-action
    input:
      token: ${{ secrets.googleAccessToken }}
```

By default it requests the `cloud-platform` scope. You can narrow this with
`ui:options.scopes`, as long as the scope is also listed under the `google`
provider's `additionalScopes`:

```yaml
ui:options:
  scopes:
    - https://www.googleapis.com/auth/cloud-platform.read-only
```

### GcpResourcePicker

`ui:field: GcpResourcePicker` renders a search-as-you-type autocomplete for
picking a GCP project or folder the signed-in user has access to, backed by the
Cloud Resource Manager `:search` API called with the user's own credentials (so
results are naturally scoped to what they can see). Because this field also
ships a schema, it shows up in Backstage's
[Custom Field Explorer](https://backstage.io/docs/features/software-templates/writing-custom-field-extensions/#previewing-custom-field-extensions)
for interactive testing.

```yaml
parameters:
  - title: Choose a GCP project
    properties:
      gcpProject:
        title: GCP Project
        type: string
        ui:field: GcpResourcePicker
        ui:options:
          resourceType: project
          outputFormat: id
```

`ui:options` supported on this field:

- `resourceType`: `project` (default) or `folder`.
- `outputFormat`: `id` (default, e.g. `my-project-123` / `123456789`) or
  `resourceName` (canonical name, e.g. `projects/415104041262` /
  `folders/123456789`).
- `parent`: restrict a folder search to a parent, e.g. `folders/123` or
  `organizations/456` (ignored for project searches).
- `scopes`: override the requested Google OAuth scopes (default is the read-only
  Cloud Platform scope).
- `pageSize`: override how many results are requested per search (default 25).
  If a search matches more than this, the field prompts the user to refine their
  search rather than silently truncating.

Example picking a folder scoped to a specific parent:

```yaml
parameters:
  - title: Choose a GCP folder
    properties:
      gcpFolder:
        title: GCP Folder
        type: string
        ui:field: GcpResourcePicker
        ui:options:
          resourceType: folder
          parent: folders/123456789
          outputFormat: resourceName
```

### GcpBillingAccountPicker

`ui:field: GcpBillingAccountPicker` renders a picker for Google Cloud Billing
accounts the signed-in user has access to — the same accounts they'd see listed
at [console.cloud.google.com/billing](https://console.cloud.google.com/billing)
— authenticated with the user's own Google OAuth credentials against the Cloud
Billing API. Unlike `GcpResourcePicker`, the Cloud Billing API has no free-text
search endpoint, so this field loads the user's list of billing accounts once
(following pagination, up to a **2,000 account cap** — 20 pages of 100) and
filters client-side as they type.

The closed field shows the **billing account ID**; hovering over it shows the
**account name** as a tooltip. The open dropdown lists both the account name and
ID for every option, similar to the "Account name" / "ID" columns in the Cloud
Billing console.

Since the whole account list has to be fetched before it can be searched, the
field shows a spinner in the input while that initial fetch is in flight
(and "Loading billing accounts…" if opened before it finishes).

```yaml
parameters:
  - title: Choose a billing account
    properties:
      billingAccount:
        title: Billing Account
        type: string
        ui:field: GcpBillingAccountPicker
```

`ui:options` supported on this field:

- `outputFormat`: `id` (default, e.g. `013939-8DE5F0-6BF33F`) or `resourceName`
  (canonical name, e.g. `billingAccounts/013939-8DE5F0-6BF33F`). Note the field
  always _displays_ the short ID regardless of this setting — `outputFormat`
  only changes the value written to the template.
- `openOnly`: when `true`, excludes closed/disabled billing accounts from the
  list. Defaults to `false`.
- `parent`: restrict the list to the sub-accounts of a parent billing account,
  e.g. `billingAccounts/013939-8DE5F0-6BF33F`. Omit to list top-level accounts.
- `scopes`: override the requested Google OAuth scopes (default is the read-only
  Cloud Billing scope).

Because `billingAccounts.list` has no free-text filter, the field fetches every
account up front rather than paging lazily as you search — but only up to
**2,000 accounts** (20 pages of 100). If a user can see more than that, the
field raises an error rather than silently showing a truncated list (and a real
account could look like it's "missing" from the picker). If you hit this, use
`parent` to scope the list to a specific billing account's sub-accounts instead
of listing everything the user can see.

Example restricting to open sub-accounts of a parent, writing the full resource
name:

```yaml
parameters:
  - title: Choose a billing sub-account
    properties:
      billingAccount:
        title: Billing Account
        type: string
        ui:field: GcpBillingAccountPicker
        ui:options:
          parent: billingAccounts/013939-8DE5F0-6BF33F
          openOnly: true
          outputFormat: resourceName
```
