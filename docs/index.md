# Backstage

Backstage is an open platform for building developer portals. Powered by a centralized service catalog, Backstage restores order to your microservices and infrastructure.

"backstage root" is the backstage folder in the root of the repository. In this repo, the backstage root folder is `backstage/backstage`

Build Docker Image for Backstage (From backstage root)

```Bash
yarn build:backend --config ../../app-config.yaml
yarn tsc
docker image build . -f packages/backend/Dockerfile --tag backstage
```

## Secrets

To create secrets for backstage in kubernetes you can use the .envrc files in the dev/prod folders in deployments. The .envrc files are used to set the environment variables, and a local file,  from 1Password.

github-app-backstage-bits-credential
auth-github-client-id
auth-github-client-secret
auth-google-client-id
auth-google-client-secret

```Bash
kubectl -n backstage create secret generic github-app-backstage-bits-credentials --from-file=github-app-backstage-bits-credentials.yaml
kubectl -n backstage create secret generic auth-github-client-id --from-literal=AUTH_GITHUB_CLIENT_ID=$AUTH_GITHUB_CLIENT_ID
kubectl -n backstage create secret generic auth-github-client-secret --from-literal=AUTH_GITHUB_CLIENT_SECRET=$AUTH_GITHUB_CLIENT_SECRET
kubectl -n backstage create secret generic auth-google-client-id --from-literal=AUTH_GOOGLE_CLIENT_ID=$AUTH_GOOGLE_CLIENT_ID
kubectl -n backstage create secret generic auth-google-client-secret --from-literal=AUTH_GOOGLE_CLIENT_SECRET=$AUTH_GOOGLE_CLIENT_SECRET
```

The above will eventually be replaced by secrets  in Google Secret Manager, so that we don't need to manually populate the secrets in the kubernetes cluster. Terraform will be used to create the secrets in Google Secret Manager, but does not populate them.

Secrets can be added to secret manager either through the GUI, or the CLI.

```Bash
gcloud secrets versions add github-app-backstage-bits-credentials --data-file="github-app-backstage-bits-credentials.yaml"
gcloud secrets versions add auth-github-client-id --data-file=<(echo -n $AUTH_GITHUB_CLIENT_ID)
gcloud secrets versions add auth-github-client-secret --data-file=<(echo -n $AUTH_GITHUB_CLIENT_SECRET)
gcloud secrets versions add auth-google-client-id --data-file=<(echo -n $AUTH_GOOGLE_CLIENT_ID)
gcloud secrets versions add auth-google-client-secret --data-file=<(echo -n $AUTH_GOOGLE_CLIENT_SECRET)
```

### Terraform

Terraform is used to create a number of GCP resources for backstage. The terraform files are in the `deployment/<env>/terraform` folder.  When creating the CloudSQL Database for the first time, there can be a race condition, where the database is not created before Terraform tries to connect to it in order to update the permissions on the databases for the backstage IAM user that the application uses. This can be resolved by running the terraform apply command twice. The first time will create the database, and the second time will update the permissions on the database.

It's also worth noting, that because of limitations in the Terraform Postgres provider, the database user can't get the CREATEDB permission, so the databases must be created by Terraform, rather then from the backstage application (backstage wants to create it's own DB's). This is not ideal, and will be resolved in the future.
For now, if you add a Backstage plugin that requires a database, you will need to add the database to the terraform file, and run terraform apply in a PR.
