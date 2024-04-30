# Operational Docs

## Local Development

In order to run backstage locally, you need to set up a few things.

Local GitHub OAuth App.

Create a new GitHub OAuth App under your GitHub account following these instructions:
https://backstage.io/docs/getting-started/configuration/#setting-up-authentication

## Keep Backstage Up-to-Date

The comprehensive guide to keeping Backstage up-to-date can be found [here](https://backstage.io/docs/getting-started/keeping-backstage-updated/) but here are the basic steps:

1. Create a new branch for the update.
1. From the app root (i.e the backstage directory in the repo) run `yarn backstage-cli versions:bump`
1. Test your backstage locally to make sure everything is working as expected with `yarn dev`
1. Commit your changes and push them to your branch.
1. Create a pull request and get it reviewed.
1. Verify that the deployment is successful by viewing : https://backstage-dev.broadinstitute.org/
