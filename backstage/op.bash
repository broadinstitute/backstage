#!/bin/env bash

if [ ! -v "${AUTH_GOOGLE_CLIENT_ID}" ]; then
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
    # Spotify Plugins
    SPOTIFY_BACKSTAGE_LICENSE_KEY=$(op --account broadinstitute.1password.com read "op://BITS - Backstage/License Key for Spotify Plugins/credential")
    SPOTIFY_BACKSTAGE_INSIGHTS_TOKEN=$(op --account broadinstitute.1password.com read "op://BITS - Backstage/backstage-insights-token/credential")
    export SPOTIFY_BACKSTAGE_LICENSE_KEY
    export SPOTIFY_BACKSTAGE_INSIGHTS_TOKEN

fi
if [ ! -f './github-app-backstage-bits-dev-credentials.yaml' ]; then
    op --account broadinstitute.1password.com read --out-file ./github-app-backstage-bits-dev-credentials.yaml "op://BITS - Backstage/github-app-backstage-bits-dev-credentials/github-app-backstage-bits-dev-credentials.yaml"
fi
