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
    SKILLS_EXCHANGE_SLACK_BOT_TOKEN=$(op --account broadinstitute.1password.com read "op://BITS - Backstage/Skills Exchange Slack App/bot-token")
    SKILLS_EXCHANGE_SLACK_APP_TOKEN=$(op --account broadinstitute.1password.com read "op://BITS - Backstage/Skills Exchange Slack App/app-token")
    SKILLS_EXCHANGE_SLACK_SIGNING_SECRET=$(op --account broadinstitute.1password.com read "op://BITS - Backstage/Skills Exchange Slack App/signing-secret")
    SOUNDCHECK_SLACK_BOT_TOKEN=$(op --account broadinstitute.1password.com read "op://BITS - Backstage/Sound Check Slack App/bot-token")
    SOUNDCHECK_SLACK_APP_TOKEN=$(op --account broadinstitute.1password.com read "op://BITS - Backstage/Sound Check Slack App/app-token")
    SOUNDCHECK_SLACK_SIGNING_SECRET=$(op --account broadinstitute.1password.com read "op://BITS - Backstage/Sound Check Slack App/signing-secret")
    export SPOTIFY_BACKSTAGE_LICENSE_KEY
    export SPOTIFY_BACKSTAGE_INSIGHTS_TOKEN
    export SKILLS_EXCHANGE_SLACK_BOT_TOKEN
    export SKILLS_EXCHANGE_SLACK_APP_TOKEN
    export SKILLS_EXCHANGE_SLACK_SIGNING_SECRET
    export SOUNDCHECK_SLACK_BOT_TOKEN
    export SOUNDCHECK_SLACK_APP_TOKEN
    export SOUNDCHECK_SLACK_SIGNING_SECRET

fi
if [ ! -f './github-app-backstage-bits-dev-credentials.yaml' ]; then
    op --account broadinstitute.1password.com read --out-file ./github-app-backstage-bits-dev-credentials.yaml "op://BITS - Backstage/github-app-backstage-bits-dev-credentials/github-app-backstage-bits-dev-credentials.yaml"
fi
