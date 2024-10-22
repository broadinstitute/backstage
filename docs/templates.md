# Introduction to Software Templates

List of actions https://backstage.broadinstitute.org/create/actions

Interactive Editor for Software Templates
https://backstage.broadinstitute.org/create/edit

Local Development of Software Templates

[!NOTE]
This document is a work in progress. Currently Software Templates are still a monolithic template, and we are working on breaking them up into reusable components.

Because we are breaking up software templates into reusable components, we have to use the `url` field in the app-config.yaml to reference the templates.
This means that when you are developing a new template, you need to push your changes to a branch in order to test them. You can also create a monolithic
template that includes all the components, and then split the config into separate files once you are happy with the result.
If you do this, put your local template in `app-config.local.yaml` using a `file` type url, and then use the `url` field
in `app-config.production.yaml` to reference the final template.

Example of a local refrence using `file` in `app-config.local.yaml`:

```yaml
- type: file
  target: ../../templates/scaffolder/terraform-control-module/template.yaml
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

If you want to reference software templates in your feature branch, so that you can test templates you'll need to add a `BRANCH_NAME` environment variable. The `.envrc` file does this for you if you use `direnv`, or you can do so manually with a command like : `export BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)`
