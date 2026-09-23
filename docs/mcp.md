# Backstage MCP Actions

This document describes the MCP Actions setup in this repository, what changed,
and how to connect VS Code to the Backstage MCP server.

Official reference:
[Backstage MCP Actions docs](https://backstage.io/docs/ai/mcp-actions)

## What Is Enabled In This Repo

The MCP Actions backend plugin is enabled in the Backstage backend and exposed
at the default endpoint:

- `http://localhost:7007/api/mcp-actions/v1`

Relevant configuration and code:

- Backend plugin registration: `backstage/packages/backend/src/index.ts`
- Backend dependency: `backstage/packages/backend/package.json`
- Action source exposure: `backstage/app-config.local.yaml` under
  `backend.actions.pluginSources`
- Client auth: `backstage/app-config.local.yaml` under the top-level
  `auth.clientIdMetadataDocuments` (Client ID Metadata Documents / CIMD) and,
  optionally, `backend.auth.externalAccess` for static tokens
- VS Code MCP client config: `.vscode/mcp.json`

## Backstage Configuration

This repo currently enables Client ID Metadata Documents (CIMD) for MCP client
auth. Static external access tokens are supported as a fallback but are
commented out by default.

Example configuration:

```yaml
backend:
  actions:
    pluginSources:
      - catalog
  auth:
    # Static tokens are an alternative to CIMD; must remain an array.
    externalAccess: []
    # - type: static
    #   options:
    #     token: ${MCP_TOKEN}
    #     subject: mcp-clients
    #   accessRestrictions:
    #     - plugin: mcp-actions
    #     - plugin: catalog

auth:
  # Note: clientIdMetadataDocuments lives under the top-level `auth:` key,
  # NOT under `backend.auth.externalAccess` — a common misconfiguration
  # that fails backend startup with a config schema type error.
  clientIdMetadataDocuments:
    enabled: true
```

Notes:

- `pluginSources` controls which plugin actions are exposed as MCP tools.
- `backend.auth.externalAccess` must always be an array (or omitted); it
  cannot hold `clientIdMetadataDocuments` or other objects.
- If static tokens are enabled instead, `accessRestrictions` scopes what the
  token can call, and the Authorization header must be `Bearer <token>`.

## VS Code Setup

This repo includes `.vscode/mcp.json` configured for MCP Actions.

```json
{
  "servers": {
    "backstage-actions": {
      "type": "http",
      "url": "http://localhost:7007/api/mcp-actions/v1"
    }
  }
}
```

If static token auth is enabled instead of CIMD, add a `headers` entry with
`"Authorization": "Bearer ${input:mcp-token}"` and a corresponding `inputs`
prompt, and provide the static token configured in
`backend.auth.externalAccess`.

## Local Validation Steps

1. Start Backstage locally.
2. Confirm backend is reachable:

```bash
curl -i http://localhost:7007/healthcheck
```

3. Confirm MCP endpoint requires auth:

```bash
curl -i http://localhost:7007/api/mcp-actions/v1
```

4. Confirm token-authenticated access:

```bash
curl -i \
  -H "Authorization: Bearer $MCP_TOKEN" \
  http://localhost:7007/api/mcp-actions/v1
```

## Production Operations

Use this checklist when running MCP Actions in shared or production
environments.

### Endpoint and Network

- Use the production Backstage base URL with `/api/mcp-actions/v1`.
- Confirm ingress and gateway policy allow your MCP client path and method set.
- Restrict inbound access to approved client networks where possible.

### Authentication and Token Handling

- Store MCP static tokens in secret management, not in source-controlled files.
- Use separate tokens per environment and per client class when feasible.
- Scope each token with minimal `accessRestrictions` required for the use case.
- Rotate tokens on a fixed schedule and immediately after any credential
  exposure event.

### Validation and Smoke Tests

Run these checks after deployment, token rotation, or auth policy changes:

1. `GET /healthcheck` returns healthy backend status.
2. Unauthenticated request to `/api/mcp-actions/v1` is rejected.
3. Authenticated request with a valid token succeeds.
4. Authenticated request with an invalid token is rejected.

### Monitoring and Alerting

- Track request success/failure rates for MCP endpoint traffic.
- Track auth failures to detect expired tokens or abuse.
- If OpenTelemetry is enabled, monitor MCP metrics described in Backstage docs:
  `mcp.server.operation.duration` and `mcp.server.session.duration`.

### Troubleshooting Playbook

- `401/403` responses: verify bearer token value, token source, and restriction
  scope.
- `404` on MCP path: verify plugin registration and route exposure.
- Timeouts: check gateway routing, backend health, and network policy.
- Missing tools in client: verify `backend.actions.pluginSources` exposes the
  expected plugin actions.

## Security Recommendations

- Do not commit real static tokens in config files.
- Prefer `${MCP_TOKEN}` sourced from local environment or secret manager.
- Keep `accessRestrictions` minimal (least privilege) if static tokens are used.
- Rotate static tokens regularly if enabled.
- CIMD (`auth.clientIdMetadataDocuments`) is the preferred, currently-enabled
  approach; restrict `allowedClientIdPatterns` to trusted client URLs in
  production.

## Optional Next Step: Split MCP Servers

If you want narrower tool surfaces per client, configure multiple MCP servers in
`mcpActions.servers` (for example `catalog` and `scaffolder`), which creates
endpoints like:

- `/api/mcp-actions/v1/catalog`
- `/api/mcp-actions/v1/scaffolder`

This can reduce accidental overexposure of unrelated actions.
