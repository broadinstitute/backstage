# Operational Docs

## App Configuration

The Backstage Project docs on configuration can be found on the
[Static Configuration](https://backstage.io/docs/conf/) page. In our
implementations, we use the `app-config.yaml` and `app-config.production.yaml`
when running in production, and `app-config.local.yaml` to override the default
configuration when running locally. There is an example
`app-config.local.example.yaml` included in this repo. You can copy it to
`app-config.local.yaml` and edit it as needed for development and testing.

## Local Development

In order to run backstage locally, you need to set up a few things after cloning
the repo.

Node and yarn will need to be installed. For the correct version of node, you
can use `nvm` to manage your node versions. This will pick up the correct
version from the .nvmrc file in the repo.

### Local Secrets

To run Backstage locally, you need to set up a number of secrets locally. These
secrets are stored in 1Password, and can be found in the `Backstage` vault. The
secrets can be manually sourced, or you can use the `1password-cli` to source
them. To use the `1password-cli`, you need to install it and authenticate with
your 1Password account. You can find instructions on how to do this in the
[1Password CLI documentation](https://support.1password.com/command-line-getting-started/).

This repo uses [mise](https://mise.jdx.dev/) to manage the local development
environment. You can install `mise` by running `brew install mise` on MacOS.
Once you have `mise` installed, the `mise.toml` file in the `backstage/`
directory will be used to set the environment variables.

If you don't have `mise` but do have the 1Password CLI, you can also manually
source the secrets by running the following commands from the app root (i.e the
`backstage/` directory in the repo):

```Shell
source op.bash
```

!!! NOTE All the above works **_GREAT_** if you have access to the 1Password
Vault. However, if you don't have access to the 1Password Vault, you must
manually create the `github-app-backstage-bits-dev-credentials.yaml` file and
populate the expected environment variables.

You can also use the `github:credentials` task to create the
`github-app-backstage-bits-dev-credentials.yaml`:

```Shell
mise run github:credentials
```

This task will also run before running the `backstage:dev` task to make sure the
file is in place before attempting to start the Backstage instance.

The `github-app-credentials.yaml` is created when you create a new GitHub OAuth
App. You can find instructions on how to create a GitHub OAuth App in the
[Backstage Authentication documentation](https://backstage.io/docs/getting-started/config/authentication).

Similarly the Google auth credentials are created when creating a new Google
OAuth App. You can find instructions on how to create a Google OAuth App in the
[Backstage Google Provider documentation](https://backstage.io/docs/auth/google/provider#create-oauth-credentials).

### Specifying a branch name

To reduce config duplication, the scaffolder templates pull reuseable snippets
directly from Github based on branch name. For this to work, the
`app-config.yaml` (or `app-config.local.yaml` during development) has repeated
reference to an environment variable `BRANCH_NAME`.

If this variable is not set, you may see the catalog plugin fail, immediately
resulting in Google Auth not working. If you have a working `mise` configuration
in your local environment, this environment variable will be set for you
automatically. The variable is also set if you are using the `source op.bash`
method.

### Setting up a local postgres instance

Backstage relies on having access to a local database. The example local config
is set up to access a postgres database. If you are using `mise`, you can start
the database using a [mise task](https://mise.jdx.dev/tasks/):

```Shell
mise run backstage:pg
```

This task will also run before running the `backstage:dev` task to make sure the
database container is running before attempting to start the Backstage instance.

If you are not using `mise`, you can set one up easily using `podman`:

```Shell
podman run \
    --rm \
    --publish 5432:5432 \
    --name backstage-dev-pg \
    --detach \
    --env POSTGRES_USER=postgresUser \
    --env POSTGRES_PASSWORD=mysecretpassword \
    postgres
```

### Installing Backstage dependencies locally

If you are using `mise`, you can install all the Backstage dependencies with a
[mise task](https://mise.jdx.dev/tasks/):

```Shell
mise run backstage:install
```

This task will also run before running the `backstage:dev` task to make sure the
dependencies are installed before attempting to start the Backstage instance.

To use the manual method, you can run:

```Shell
yarn install
```

### Running Backstage

If you are using `mise`, you start the local backstage instance using a
[mise task](https://mise.jdx.dev/tasks/).

```Shell
mise run backstage:dev
```

This task will run the instance. However, it has dependencies, so it will also
run the following tasks:

- backstage:install
- github:credentials
- backstage:pg

This is to make sure the necessary prerequisites are in place before starting
Backstage.

To start the app using the manual method, run:

```Shell
yarn dev
```

Both methods should open a browser on your system. If that doesn't happen
automatically, you can browse to the local instance at
[http://localhost:3000/](http://localhost:3000/).

## Keep Backstage Up-to-Date

You should use the comprehensive guide to
[Keeping Backstage Updated](https://backstage.io/docs/getting-started/keeping-backstage-updated/),
but here are the basic steps:

1. Create a new branch for the update.
1. From the app root (i.e the backstage directory in the repo) run
   `yarn backstage-cli versions:bump`.
1. Test your backstage locally to make sure everything is working as expected
   with `mise run backstage:dev` or `yarn dev` if not using `mise`.
1. Commit your changes and push them to your branch.
1. Optionally upgrade other plugins with
   `yarn backstage-cli versions:bump --pattern '@{roadiehq,pagerduty}/*'`
1. Create a pull request and get it reviewed.
1. Verify that the deployment is successful by viewing:
   [Backstage Dev](https://backstage-dev.broadinstitute.org/)

## Deployment

"backstage root" is the backstage folder in the root of the repository. In this
repo, the backstage root folder is `backstage/backstage`

Build Docker Image for Backstage (From backstage root)

```Shell
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

```Shell
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

```Shell
gcloud secrets versions add github-app-backstage-bits-credentials --data-file="github-app-backstage-bits-credentials.yaml"
gcloud secrets versions add auth-github-client-id --data-file=<(echo -n $AUTH_GITHUB_CLIENT_ID)
gcloud secrets versions add auth-github-client-secret --data-file=<(echo -n $AUTH_GITHUB_CLIENT_SECRET)
gcloud secrets versions add auth-google-client-id --data-file=<(echo -n $AUTH_GOOGLE_CLIENT_ID)
gcloud secrets versions add auth-google-client-secret --data-file=<(echo -n $AUTH_GOOGLE_CLIENT_SECRET)
```

## Terraform

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

### Update Providers

When updating a provider, run the following command to update the lock file.
This will ensure that the provider is available for all platforms.

```Shell
terraform providers lock \
  -platform=linux_arm64 \
  -platform=linux_amd64 \
  -platform=darwin_amd64 \
  -platform=darwin_arm64 \
  -platform=windows_amd64
```

### Update Terraform Docs

When updating docs, run the following command in the directory you want to
update (dev/prod). This will ensure that the docs are available for all
platforms.

```Shell
podman run --rm --volume "$(pwd):/terraform-docs" -u $(id -u) quay.io/terraform-docs/terraform-docs:latest --output-file README.md --output-mode inject /terraform-docs
```

### Using the development environment

This project has two near-identical directories named `dev` and `prod` that
refer to the development and production environments, respectively. BITS
encourages the use of testing environments wherever possible to reduce downtime
and prevent emergency outages on critical infrastructure.

To apply changes from the `dev` directory to `prod`, you can use the following
git workflow:

1. Make changes that _only_ affect the `dev` directory. Commit them normally.
1. Run this git command from the project root:

   ```Shell
   git apply --directory  deployment/prod/terraform <(git format-patch -1 --relative=deployment/dev/terraform --stdout)
   ```

   This takes all changes from the most recent commit and applies them to the
   prod directory. The changes will not be staged or committed yet, so you can
   review them to make sure everything is right.

1. Run this git command:

   ```Shell
   git add -A; git commit -m "$(git log -1 --pretty="format:Apply %h to prod%n%n%B")"
   ```

   This stages all changes in the repository and commits them with a formatted
   message:

   ```Text
   Apply <git hash> to prod

   <Full text of referenced commit message>
   ```

Managing changes like this prevents human error when applying changes between
environments. It also allows for easy, atomic rollback of specific environments
using `git-revert (1)` if that's ever necessary.

## Update Backstage Insights API Token

The Backstage Cost Insights plugin requires an API token to function. This token
expires every 90 days and needs to be updated periodically. You can generate a
new token by following the instructions on the
[Backstage Plugin website.](https://backstage.spotify.com/docs/plugins/insights)

Existing tokens can be viewed and managed on the
[Backstage Support page.](https://backstage.spotify.com/account/tokens/)

Use the support page to generate a new token for the Cost Insights plugin.

The token will then need to be updated in the 1Password vault used for Backstage
secrets. You can find the vault at
`"op://BITS - Backstage/backstage-insights-token/credential"`. After updating
the token in 1Password, you will need to update the secret in the Kubernetes
cluster. This can be done by updating the secret in the `bits-backstage-prod`
and `bits-backstage-dev` GCP Projects respectively.

Once the secrets are updated in Google Secret Manager, you will need to redeploy
the Backstage application for the changes to take effect.

You can redeploy the Backstage application by with no changes by running the
following command:

```shell
kubectl rollout restart deployment/backstage -n backstage
```
