# 6. Migrate Build Pipeline to Github Actions

Date: 2025-12-16

## Status

Accepted

## Context

Builds in cloud build are difficult to maintain and have limited integration with GitHub features such as pull requests. Giving the users more visibility into the build process and allowing for easier maintenance is a priority.
## Decision

Move the build pipeline from Google Cloud Build to GitHub Actions. This will allow for better integration with GitHub features, easier maintenance, and improved visibility into the build process.

## Consequences

The build pipeline will be easier to maintain and will have better integration with GitHub features. However, there may be some initial setup and configuration required to migrate the build pipeline to GitHub Actions.
