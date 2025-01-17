# 3. Add insights plugin

Date: 2025-01-17

## Status

Accepted

## Context

Backstage has been running in production for a while now and we need to start gathering insights into how the platform is being used. This will help us to identify trends, understand user behavior, and measure user and plugin adoption.

The goal of the insights is to help us make data-driven decisions about the platform and to identify areas for improvement.

## Decision

In order to provide insights into the usage of the Backstage platform, we will trial run the [Spotify Insights](https://backstage.spotify.com/docs/plugins/insights/) plugin. Our trail period will be for 3 months.

## Consequences

- This will allow us to gather data on how the platform is being used and to identify areas for improvement. It will also help us to measure user and plugin adoption and to understand user behavior.
- The Insights plugin is part of a paid bundle of Spotify Enterprise Plugins, so we will need to purchase a license in order to use it beyond the trial period.
- New secrets will need to be added and maintained adding to the complexity of the system.
