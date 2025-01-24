# Operational Docs

## App Configuration

The Backstage Project docs on configuration can be found
[here](https://backstage.io/docs/conf/). In our implementations we use the
`app-config.yaml` and `app-config.production.yaml` when running in production,
and use app-config.local.yaml to over-ride the default configuration when
running locally.

Example of `app-config.local.yaml`:

```yaml
# Backstage override configuration for your local development environment
app:
    baseUrl: http://localhost:3000

backend:
    reading:
        allow:
            - host: "gist.githubusercontent.com"
            - host: "netftp.broadinstitute.org"
    database:
        client: better-sqlite3
        connection: ":memory:"

    cors:
        origin: http://localhost:3000
        methods: [GET, HEAD, PATCH, POST, PUT, DELETE]
        credentials: true

integrations:
    github:
        - host: github.com
          # This is a Personal Access Token or PAT from GitHub. You can find out how to generate this token,
          # and more information about setting up the GitHub integration here:
          # https://backstage.io/docs/getting-started/configuration#setting-up-a-github-integration
          # token: ${GITHUB_TOKEN}
          apps:
              - $include: github-app-backstage-bits-dev-credentials.yaml

techdocs:
    builder: "local" # Alternatives - 'external'
    generator:
        runIn: "docker" # Alternatives - 'local'
    publisher:
        type: "local" # Alternatives - 'googleGcs' or 'awsS3'. Read documentation for using alternatives.

catalog:
    locations:
    # Local example template
    - type: file
      target: ../../templates/scaffolder/terraform-control-module/template.yaml
      rules:
        - allow: [Template]

    # Example of a remote reference using `url` in `app-config.production.yaml`:
    - type: url
      target: "https://raw.githubusercontent.com/broadinstitute/backstage/refs/heads/${BRANCH_NAME}/backstage/templates/scaffolder/pr-with-catalog-entry/template.yaml"
      rules:
        - allow: [Template]

    - type: url
      target: "https://raw.githubusercontent.com/broadinstitute/backstage/refs/heads/${BRANCH_NAME}/backstage/templates/scaffolder/terraform-control-module/template.yaml"
      rules:
        - allow: [Template]

    - type: file
      target: "https://raw.githubusercontent.com/broadinstitute/backstage/refs/heads/${BRANCH_NAME}/backstage/templates/scaffolder/terraform-with-terragrunt/template.yaml"
      rules:
        - allow: [Template]

    - type: file
      target: "https://raw.githubusercontent.com/broadinstitute/backstage/refs/heads/${BRANCH_NAME}/backstage/templates/scaffolder/terraform-storage-transfer/template.yaml"
      rules:
        - allow: [Template]

        - type: file
          target: ../../examples/entities.yaml

        # Local example template
        - type: file
          target: ../../examples/template/template.yaml
          rules:
              - allow: [Template]

        # Local example PagerDuty template
        - type: file
          target: ../../examples/template/pagerduty.yaml
          rules:
              - allow: [Template]

        # Local example organizational data
        - type: file
          target: ../../examples/org.yaml
          rules:
              - allow: [User, Group]
```

## Local Development

In order to run backstage locally, you need to set up a few things after cloning
the repo.

Node and yarn will need to be installed. For the correct version of node, you
can use `nvm` to manage your node versions. This will pick up the correct
version from the .nvmrc file in the repo.

#### Local Secrets

To run Backstage locally, you need to set up a number of secrets locally. These
secrets are stored in 1Password, and can be found in the `Backstage` vault. The
secrets can be manually sourced, or you can use the `1password-cli` to source
them. To use the `1password-cli`, you need to install it and authenticate with
your 1Password account. You can find instructions on how to do this
[here](https://support.1password.com/command-line-getting-started/).

This repo uses [direnv](https://direnv.net/) to manage environment variables.
You can install direnv by running `brew install direnv` on MacOS. Once you have
direnv installed, you can use the `.envrc` files in the repo to source the
secrets. You can also manually source the secrets by running the following
commands from the app root (i.e the backstage directory in the repo):
`source op.bash` and the file can be found in the repo at `backstage/op.bash`.

!!! NOTE All the above works **_GREAT_** if you have access to the 1Password
Vault, however, if you don't have access to the 1Password Vault, you must
manually create the `github-app-backstage-bits-dev-credentials.yaml` file and
populate the expected environment variables.

The `github-app-credentials.yaml` is created when you create a new GitHub OAuth
App. You can find instructions on how to create a GitHub OAuth App
[here](https://backstage.io/docs/getting-started/config/authentication).

Similarly the Google auth credentials are created when creating a new Google
OAuth App. You can find instructions on how to create a Google OAuth App
[here](https://backstage.io/docs/auth/google/provider#create-oauth-credentials).

#### Specifying a branch name

To reduce config duplication, the scaffolder templates pull reuseable snippets
directly from Github based on branch name. For this to work, the
`app-config.yaml` (or `app-config.local.yaml` during development) has repeated
reference to an environment variable `BRANCH_NAME`. To work with templates in
development, push your changes to Github and set this environment variable,
e.g.:

```bash
export BRANCH_NAME="$(git rev-parse --abbrev-ref HEAD)"
```

If this variable is not set, you may see the catalog plugin fail, immediately
resulting in Google Auth not working.

#### Running Backstage

To start the app, run:

```sh
yarn install
yarn dev
```

## Keep Backstage Up-to-Date

The comprehensive guide to keeping Backstage up-to-date can be found
[here](https://backstage.io/docs/getting-started/keeping-backstage-updated/) but
here are the basic steps:

1. Create a new branch for the update.
1. From the app root (i.e the backstage directory in the repo) run
   `yarn backstage-cli versions:bump`
1. Test your backstage locally to make sure everything is working as expected
   with `yarn dev`
1. Commit your changes and push them to your branch.
1. Create a pull request and get it reviewed.
1. Verify that the deployment is successful by viewing :
   https://backstage-dev.broadinstitute.org/

## Deployment

"backstage root" is the backstage folder in the root of the repository. In this
repo, the backstage root folder is `backstage/backstage`

Build Docker Image for Backstage (From backstage root)

```Bash
yarn build:backend --config ../../app-config.yaml
yarn tsc
docker image build . -f packages/backend/Dockerfile --tag backstage
```

## Secrets

To create secrets for backstage in kubernetes you can use the .envrc files in
the dev/prod folders in deployments. The .envrc files are used to set the
environment variables, and a local file, from 1Password.

github-app-backstage-bits-credential auth-github-client-id
auth-github-client-secret auth-google-client-id auth-google-client-secret

```Bash
kubectl -n backstage create secret generic github-app-backstage-bits-credentials --from-file=github-app-backstage-bits-credentials.yaml
kubectl -n backstage create secret generic auth-github-client-id --from-literal=AUTH_GITHUB_CLIENT_ID=$AUTH_GITHUB_CLIENT_ID
kubectl -n backstage create secret generic auth-github-client-secret --from-literal=AUTH_GITHUB_CLIENT_SECRET=$AUTH_GITHUB_CLIENT_SECRET
kubectl -n backstage create secret generic auth-google-client-id --from-literal=AUTH_GOOGLE_CLIENT_ID=$AUTH_GOOGLE_CLIENT_ID
kubectl -n backstage create secret generic auth-google-client-secret --from-literal=AUTH_GOOGLE_CLIENT_SECRET=$AUTH_GOOGLE_CLIENT_SECRET
kubectl -n backstage create secret generic pagerduty-client-id --from-literal=PD_CLIENT_ID=$PD_CLIENT_ID
kubectl -n backstage create secret generic pagerduty-client-secret --from-literal=PD_CLIENT_SECRET=$PD_CLIENT_SECRET
```

The above will eventually be replaced by secrets in Google Secret Manager, so
that we don't need to manually populate the secrets in the kubernetes cluster.
Terraform will be used to create the secrets in Google Secret Manager, but does
not populate them.

Secrets can be added to secret manager either through the GUI, or the CLI.

```Bash
gcloud secrets versions add github-app-backstage-bits-credentials --data-file="github-app-backstage-bits-credentials.yaml"
gcloud secrets versions add auth-github-client-id --data-file=<(echo -n $AUTH_GITHUB_CLIENT_ID)
gcloud secrets versions add auth-github-client-secret --data-file=<(echo -n $AUTH_GITHUB_CLIENT_SECRET)
gcloud secrets versions add auth-google-client-id --data-file=<(echo -n $AUTH_GOOGLE_CLIENT_ID)
gcloud secrets versions add auth-google-client-secret --data-file=<(echo -n $AUTH_GOOGLE_CLIENT_SECRET)
```

### Terraform

Terraform is used to create a number of GCP resources for backstage. The
terraform files are in the `deployment/<env>/terraform` folder. When creating
the CloudSQL Database for the first time, there can be a race condition, where
the database is not created before Terraform tries to connect to it in order to
update the permissions on the databases for the backstage IAM user that the
application uses. This can be resolved by running the terraform apply command
twice. The first time will create the database, and the second time will update
the permissions on the database.

It's also worth noting, that because of limitations in the Terraform Postgres
provider, the database user can't get the CREATEDB permission, so the databases
must be created by Terraform, rather then from the backstage application
(backstage wants to create it's own DB's). This is not ideal, and will be
resolved in the future. For now, if you add a Backstage plugin that requires a
database, you will need to add the database to the terraform file, and run
terraform apply in a PR.
