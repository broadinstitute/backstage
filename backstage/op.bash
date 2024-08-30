#!/bin/env bash

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

