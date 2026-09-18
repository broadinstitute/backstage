# 8. Deploy to Spot Instances

Date: 2026-09-18

## Status

Accepted

## Context

GKE Spot VMs cost significantly less than standard on-demand nodes, but the
underlying compute can be reclaimed by GCP at any time, with only a short (up to
30 second) termination notice delivered to the node. Backstage is a stateless
web app with no in-memory session state that must be preserved across a restart,
and its Deployment already runs behind a Service with multiple replicas, so it
can tolerate a pod being rescheduled without impacting availability. Given this,
running Backstage on Spot capacity is a low-risk way to reduce compute cost.

## Decision

We schedule the Backstage Deployment onto Spot nodes using a preferred (not
required) node affinity rule matching the `cloud.google.com/gke-spot: "true"`
label. A preference rather than a hard requirement was chosen so that the
Deployment can still schedule onto standard nodes if Spot capacity is
unavailable, avoiding a hard scheduling failure in exchange for potentially
running on more expensive capacity.

We also reduced `terminationGracePeriodSeconds` to 15 seconds. Because Spot
reclamation gives a short, fixed notice window, a shorter grace period increases
the chance the pod finishes terminating before the node is forcibly removed,
rather than being killed mid-shutdown.

## Consequences

- Lower compute cost for the Backstage Deployment, since it can run on Spot
  pricing whenever Spot nodes are available.
- Pods may be preempted and rescheduled more frequently than on standard nodes,
  so brief pod restarts become a normal occurrence rather than an anomaly; this
  is acceptable given Backstage's stateless, multi-replica design.
- The shorter termination grace period leaves less time for graceful shutdown
  (e.g. draining in-flight requests) before a pod is killed, trading a small
  amount of shutdown safety for a better chance of exiting cleanly before Spot
  preemption forcibly terminates the node.
- If Spot capacity is exhausted, the Deployment falls back to standard nodes
  automatically rather than failing to schedule.
