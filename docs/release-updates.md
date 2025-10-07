# Recent Release Updates

This document tracks significant updates and new features added to our Backstage
instance from recent Spotify plugin releases.

## September 2025 (v.1.43.0) Updates

### Soundcheck Enhancements

#### Tech Insights Page

A new **Tech Insights page** has been added that provides analytics to track
software quality metrics across your organization. This feature helps teams:

- Monitor software quality trends over time
- Identify areas for improvement across teams and projects
- Track progress against organizational standards

**Requirements**: The [@backstage/ui](https://ui.backstage.io/install) package
must be installed and available in your Backstage instance for this feature to
render correctly.

#### Track Management Improvements

**Manual Track Recertification** - Teams can now manually recertify tracks
through the UI, providing more flexibility in track management and certification
processes.

**Enhanced Campaign Insights** - The Campaign Insights page now includes:

- Total track and campaign counts to distinguish totals from applicable counts
- Status filter for the entities table, making it easier to focus on specific
  entity states

#### Jira Integration Updates

The Jira integration has been enhanced with:

**Personal Access Token Authentication** - Support for personal access token
(bearer token) authentication provides more secure and flexible authentication
options.

**New Issues Count Fact** - The new `issues-count` Jira fact returns the number
of issues matching a JQL query, enabling more sophisticated checks based on
issue metrics.

#### Configuration Changes

**Important**: The following configuration options have been deprecated and will
be removed in future releases:

- `soundcheck.remote_file_updates` → Use `soundcheck.remoteFileUpdates` instead
- `soundcheck.programs` → Use `soundcheck.tracks` instead

**API Changes**: Jira's legacy Search API has been replaced with the enhanced
search API for Jira Cloud instances, improving performance and reliability.

### Insights Plugin Updates

**Simplified Search Integration** - The `searchPage` external route now defaults
to `search.root`, reducing configuration complexity when setting up the
Backstage frontend.

### Skill Exchange Admin Features

**Admin Moderation System** - A new admin moderation system has been introduced:

**Configuration**: Add admin users via the
`skillExchange.admins.postCleanupAdmins` configuration option (list of user
entity references).

**Admin Capabilities**: Configured admins can:

- Delete or archive hacks, hack events, mentorships, and mentorship events
- Access admin controls directly in the UI (visible only to admins)
- Manage content while preserving post owners' ability to delete their own
  content

## Impact and Action Items

### For Teams Using Soundcheck

1. **Explore Tech Insights**: Visit the new Tech Insights page to gain
   visibility into your team's software quality metrics
2. **Review Configuration**: Update any deprecated configuration options in your
   setup
3. **Jira Integration**: If using Jira integration, consider upgrading to
   personal access token authentication for improved security

### For Skill Exchange Administrators

1. **Configure Admin Moderation**: Set up the
   `skillExchange.admins.postCleanupAdmins` configuration if you need admin
   moderation capabilities
2. **Review Admin Policies**: Establish policies for content moderation and
   ensure appropriate users are granted admin permissions

### For All Users

1. **Updated Features**: Familiarize yourself with the enhanced UI features and
   improved filtering options
2. **Documentation**: Review plugin-specific documentation for detailed
   configuration and usage instructions

## Resources

- [Soundcheck Documentation](https://backstage.spotify.com/docs/plugins/soundcheck/)
- [Tech Insights Documentation](https://backstage.spotify.com/docs/plugins/soundcheck/core-concepts/tech-insights)
- [Skill Exchange Documentation](https://backstage.spotify.com/docs/plugins/skill-exchange/)
- [Insights Plugin Documentation](https://backstage.spotify.com/docs/plugins/insights/)

---

_Last Updated: October 2025_ _Source:
[Spotify Plugins for Backstage Release Notes - September 2025](https://backstage.spotify.com/release-notes/#2025-09-18)_
