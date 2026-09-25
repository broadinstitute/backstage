# 9. Remove Kubernetes MCP Plugin Source from Config

Date: 2026-09-25

## Status

Accepted

## Context

The Kubernetes MCP tool (`get-kubernetes-resources-for-entity`, exposed via
`backend.actions.pluginSources: ['kubernetes']`) returned a 500 error on every
call in production:

```
Error: Google token not found under auth.google in request body
    at GoogleStrategy.getCredential (.../plugin-kubernetes-backend/src/auth/GoogleStrategy.ts:36:13)
```

Our GKE `clusterLocatorMethods` entries don't set `authProvider`, so
`@backstage/plugin-kubernetes-backend` defaults them to `authProvider: google`.
That strategy expects a per-request Google ID token for the signed-in user,
which the browser's Kubernetes tab supplies automatically (via
`googleAuthApiRef`) on every call.

The MCP action has no way to supply that token. Looking at
`createGetKubernetesResourcesForEntityAction` in
`@backstage/plugin-kubernetes-backend`, the action's input schema only accepts
`name`, `kind`, and `namespace` — there is no field for a token — and it always
calls `getKubernetesObjectsByEntity` with `auth: {}`, by design:

```
// auth carries provider-specific tokens (e.g. OIDC) sent by browser
// clients. Server-side actions don't have these; passing an empty
// object tells the AuthenticationStrategy to use the server-side
// configured credentials (service account, etc.).
auth: {}
```

The `credentials` an MCP caller presents is their Backstage identity token, not
the underlying Google OAuth token issued at sign-in, and Backstage doesn't
persist or expose that Google token to server-side callers. So there is
currently no supported way, from config or from the MCP client side, to make the
`google` auth provider work for this action.

The only auth provider compatible with server-side/MCP calls is
`googleServiceAccount`, which authenticates via the pod's Workload Identity /
Application Default Credentials instead of a per-user token. Switching to it
would fix the MCP tool, but it applies per cluster locator, not per caller — it
would also change how the browser Kubernetes tab authenticates, moving every
user (not just MCP callers) from their own scoped Google IAM permissions onto
one shared service account's permissions for the `bits-gke-clusters` and
`bits-gke-clusters-dev` GKE projects. That's a real access-control change to
production clusters, so it deserves its own review of the Workload Identity
service account's current GKE RBAC/IAM grants and a deliberate decision, rather
than being made as a side effect of fixing an MCP error.

## Decision

Remove `'kubernetes'` from `backend.actions.pluginSources` in
`app-config.production.yaml` so the Kubernetes MCP tool is not registered at
all, until we've decided how to handle the authentication gap above.

## Consequences

- MCP users no longer see or can attempt to call a Kubernetes tool, so they
  won't hit the 500 error described above. Every other MCP tool source (catalog,
  scaffolder, auth, notifications, search) is unaffected.
- We lose Kubernetes resource lookup via MCP until this is revisited.
- Follow-up decision still needed: whether to move the GKE cluster locators to
  `authProvider: googleServiceAccount` (accepting a shared-service-account
  access model for all callers, human and MCP alike, and requiring us to first
  confirm the Workload Identity service account is scoped to least privilege),
  or to leave the Kubernetes MCP tool disabled long-term if that tradeoff isn't
  acceptable. Re-add `'kubernetes'` to `pluginSources` once a decision is made
  and implemented.
