# 7. Allow Soundcheck to use sensitive fact values in check result message templates

Date: 2026-05-07

## Status

Accepted

## Context

Soundcheck is Backstage's quality scorecard plugin that allows teams to define
and track software quality metrics through checks. These checks collect facts
about entities (components, services, etc.) from various sources such as GitHub,
HTTP endpoints, and other systems.

Integrations in Soundcheck can mark facts as `sensitive` (e.g., GitHub
integration marks DependabotAlerts, SecretScanningAlerts, and CodeScanningAlerts
as sensitive). By default, sensitive facts are heavily redacted in the
front-end:

- The resolved value is always shown as `REDACTED`
- The fact's `data` property returns `{}`
- Check pass/fail messages cannot use the fact in templates

This redaction prevents unintended access to sensitive information but limits
the ability to create detailed check result messages that incorporate sensitive
data.

Teams have requested the ability to use sensitive fact values in their check
result message templates for legitimate security monitoring needs, such as:

- Security checks that need to surface vulnerability alert data in result
  messages
- Compliance checks that require sensitive context in audit messages
- Checks that need to include redacted or partially-visible sensitive
  information for context

The trade-off is that enabling this feature means check result messages can
contain sensitive data and must be carefully managed through access controls and
notifications.

## Decision

We have enabled the `dangerouslyAllowSensitiveFactMessageTemplating`
configuration option in Soundcheck's results configuration, allowing sensitive
fact values to be used in check result message templates. This configuration
option must be explicitly set to `true` to enable this capability:

```yaml
soundcheck:
  results:
    dangerouslyAllowSensitiveFactMessageTemplating: true
```

This decision is distinct from `dangerouslyAllowSensitiveFactReads`, which
separately controls whether sensitive facts can be viewed in their entirety
(unredacted) in the front-end UI. The message templating feature allows
sensitive data to flow through check result messages while maintaining the
default front-end redaction for direct fact viewing unless that setting is also
explicitly enabled.

## Consequences

**Positive Impacts:**

- Teams can now create more informative check result messages that surface
  sensitive facts like security alerts (e.g., GitHub's DependabotAlerts,
  SecretScanningAlerts, CodeScanningAlerts)
- Security and compliance checks can include sensitive context in messages sent
  to Slack and other notification channels
- Better visibility into security-relevant check outcomes enables faster
  incident response

**Risks and Mitigation Strategies:**

- **Message Persistence**: Check result messages containing sensitive data are
  persisted until checks are updated. Messages may remain visible in the UI or
  notification history longer than desired.
  - _Mitigation_: Implement a policy for regularly reviewing and updating checks
    to regenerate messages; consider automation to refresh check results
    periodically

- **Notification Channel Security**: Slack messages and other notifications
  containing sensitive data require secure configuration and appropriate access
  controls.
  - _Mitigation_: Ensure Slack bot tokens are properly scoped and rotated;
    configure Slack workspace permissions to limit who can view channels with
    sensitive check messages; consider using private channels or threads for
    sensitive notifications

- **Front-End Access Control**: Without careful RBAC configuration, sensitive
  data in check messages could be exposed to unauthorized users viewing the
  Soundcheck UI.
  - _Mitigation_: Use Backstage RBAC policies to restrict access to Soundcheck
    check results; implement complementary use of
    `dangerouslyAllowSensitiveFactReads` only for authorized users via the RBAC
    rule `soundcheck.fact.sensitive.read`

- **Audit and Compliance**: Access to sensitive data in check messages should be
  auditable for compliance purposes.
  - _Mitigation_: Ensure Backstage audit logging is enabled and configured to
    capture access to Soundcheck resources; regularly review audit logs for
    unauthorized access patterns

- **Information Disclosure via Logs**: Sensitive data in check messages may
  appear in application logs if logging is misconfigured.
  - _Mitigation_: Review logging configuration to ensure sensitive data is not
    captured; implement log sanitization or filtering where appropriate

**Responsible Use:** This feature is intended for security-conscious teams with
well-defined access controls and clear data handling policies. Teams using this
feature must:

- Understand that check result messages can contain sensitive data (similar to
  GitHub security alerts)
- Implement appropriate access controls via RBAC policies
- Document which checks use sensitive data and why
- Monitor for unauthorized access or data exposure
- Follow organizational security policies regarding sensitive data handling
- Regularly audit and rotate notification channel credentials (e.g., Slack bot
  tokens)
