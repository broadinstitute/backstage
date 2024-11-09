# Introduction to Software Templates

List of actions https://backstage.broadinstitute.org/create/actions

Interactive Editor for Software Templates
[!NOTE]
The interactive editor does [not currently support placeholders](https://backstage.io/docs/features/software-templates/input-examples#use-placeholders-to-reference-remote-files:~:text=Testing%20of%20this%20functionality%20is%20not%20yet%20supported%20using%20create/edit.%20In%20addition%2C%20this%20functionality%20only%20works%20for%20remote%20files%20and%20not%20local%20files.%20You%20also%20cannot%20nest%20files.), so you will need to manually replace placeholders with the appropriate values.
https://backstage.broadinstitute.org/create/edit

### Local Development of Software Templates

Because have broken software templates into [reusable components(https://backstage.io/docs/features/software-templates/input-examples#use-placeholders-to-reference-remote-files)], we have to use the `url` field in the app-config.yaml to reference the templates.

This means that when you are developing a new template, you need to push your changes to a branch in order to test them. You can also create a monolithic template in order to run local development without neededing to push to a branch. The config can be made into separate files once you are happy with the result.
If you do this, put your local template in `app-config.local.yaml` using a `file` type url, and then use the `url` field
in `app-config.production.yaml` to reference the final template.

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

If you want to reference software templates in your feature branch, so that you can test templates you'll need to add a `BRANCH_NAME` environment variable. The `.envrc` file does this for you if you use `direnv`, or you can do so manually with a command like : `export BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)`


Useful resources
https://backstage.io/docs/features/software-templates/ui-options-examples/

Scafolder parameters - https://roadie.io/docs/scaffolder/scaffolder-parameters/

highlightin this page https://roadie.io/docs/scaffolder/scaffolder-parameters/#picker-from-external-api-source

useful actions summary page https://roadie.io/docs/scaffolder/scaffolder-actions-directory/

conditionals
`if: ${{ parameters.skipStep }}`

https://backstage.io/docs/features/software-templates/writing-templates/#specsteps---action

Conditional steps
https://backstage.io/docs/features/software-templates/input-examples/#use-parameters-as-condition-in-steps

```yaml
- name: Only development environments
  if: ${{ parameters.environment === "staging" or parameters.environment === "development" }}
  action: debug:log
  input:
    message: 'development step'

- name: Only production environments
  if: ${{ parameters.environment === "prod" or parameters.environment === "production" }}
  action: debug:log
  input:
    message: 'production step'

- name: Non-production environments
  if: ${{ parameters.environment !== "prod" and parameters.environment !== "production" }}
  action: debug:log
  input:
    message: 'non-production step'
```

```
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
