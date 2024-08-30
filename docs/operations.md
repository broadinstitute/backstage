# Operational Docs

## App Configuration

The Backstage Project docs on configuration can be found [here](https://backstage.io/docs/conf/). In our implementations we use the `app-config.yaml` and `app-config.production.yaml` when running in production, and use app-config.local.yaml to over-ride the default configuration when running locally.

Example of `app-config.local.yaml`:

```yaml
# Backstage override configuration for your local development environment
app:
  baseUrl: http://localhost:3000

backend:
  reading:
    allow:
      - host: 'gist.githubusercontent.com'
      - host: 'netftp.broadinstitute.org'
  database:
    client: better-sqlite3
    connection: ':memory:'

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
  builder: 'local' # Alternatives - 'external'
  generator:
    runIn: 'docker' # Alternatives - 'local'
  publisher:
    type: 'local' # Alternatives - 'googleGcs' or 'awsS3'. Read documentation for using alternatives.

catalog:
  locations:
      # Local example template
    - type: file
      target: ../../templates/scaffolder/pr-with-catalog-entry/template.yaml
      rules:
        - allow: [Template]

    - type: file
      target: ../../templates/scaffolder/terraform-control-module/template.yaml
      rules:
        - allow: [Template]

    - type: file
      target: ../../templates/scaffolder/terraform-with-terragrunt/template.yaml
      rules:
        - allow: [Template]

    - type: file
      target: ../../templates/scaffolder/terraform-storage-transfer/template.yaml
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

In order to run backstage locally, you need to set up a few things after cloning the repo.

Node and yarn will need to be installed. For the correct version of node, you can use `nvm` to manage your node versions. This will pick up the correct version from the .nvmrc file in the repo.


#### Local Secrets

To run Backstage locally, you need to set up a number of secrets locally. These secrets are stored in 1Password, and can be found in the `Backstage` vault. The secrets can be manually sourced, or you can use the `1password-cli` to source them. To use the `1password-cli`, you need to install it and authenticate with your 1Password account. You can find instructions on how to do this [here](https://support.1password.com/command-line-getting-started/).

This repo uses [direnv](https://direnv.net/) to manage environment variables. You can install direnv by running `brew install direnv` on MacOS. Once you have direnv installed, you can use the `.envrc` files in the repo to source the secrets. You can also manually source the secrets by running the following commands from the app root (i.e the backstage directory in the repo): `source op.bash`

This is a sample `op.bash` file that you can use to source the secrets:

```Bash
    # Google
    AUTH_GOOGLE_CLIENT_ID=$(op --account broadinstitute.1password.com read "op://BITS - Backstage/OAuth 2.0 Client ID - Dev/client_id")
    export AUTH_GOOGLE_CLIENT_ID
    AUTH_GOOGLE_CLIENT_SECRET=$(op --account broadinstitute.1password.com read "op://BITS - Backstage/OAuth 2.0 Client ID - Dev/client_secret")
    export AUTH_GOOGLE_CLIENT_SECRET
    # GitHub
    AUTH_GITHUB_CLIENT_ID=$(op --account broadinstitute.1password.com read "op://BITS - Backstage/auth-github-client-id-dev/credential")
    export AUTH_GITHUB_CLIENT_ID
    AUTH_GITHUB_CLIENT_SECRET=$(op --account broadinstitute.1password.com read "op://BITS - Backstage/auth-github-client-secret-dev/credential")
    export AUTH_GITHUB_CLIENT_SECRET
    op --account broadinstitute.1password.com read --out-file ./github-app-backstage-bits-dev-credentials.yaml "op://BITS - Backstage/github-app-backstage-bits-dev-credentials/github-app-backstage-bits-dev-credentials.yaml"
```

> [!NOTE]
All the above works ***GREAT*** if you have access to the 1Password Vault, however, if you don't have access to the 1Password Vault, you must manually create the `github-app-backstage-bits-dev-credentials.yaml` file and populate the expected environment variables.

The `github-app-credentials.yaml` is created when you create a new GitHub OAuth App. You can find instructions on how to create a GitHub OAuth App [here](https://backstage.io/docs/getting-started/config/authentication).

Similarly the Google auth credentials are created when creating a new Google OAuth App. You can find instructions on how to create a Google OAuth App [here](https://backstage.io/docs/auth/google/provider#create-oauth-credentials).

#### Running Backstage

To start the app, run:

```sh
yarn install
yarn dev
```

## Keep Backstage Up-to-Date

The comprehensive guide to keeping Backstage up-to-date can be found [here](https://backstage.io/docs/getting-started/keeping-backstage-updated/) but here are the basic steps:

1. Create a new branch for the update.
1. From the app root (i.e the backstage directory in the repo) run `yarn backstage-cli versions:bump`
1. Test your backstage locally to make sure everything is working as expected with `yarn dev`
1. Commit your changes and push them to your branch.
1. Create a pull request and get it reviewed.
1. Verify that the deployment is successful by viewing : https://backstage-dev.broadinstitute.org/
