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
