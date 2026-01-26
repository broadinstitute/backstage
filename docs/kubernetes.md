# Kubernetes Deployment

This diagram represents the Kubernetes deployment architecture for Backstage on
GKE, including all core components, policies, and integrations.

```mermaid
graph LR
    subgraph "GKE Cluster (backstage Namespace)"
        subgraph "Backstage Deployment"
            A[Backstage Pod]
            B["cloud-sql-proxy (Init Container)"]
            C[Service Account: backstage]
            D["Secrets (mounted from Secret Manager)"]
            E[Volume: backstage-secrets]
            F[Container: backstage]
        end
        subgraph "Service & Networking"
            H[Service: backstage]
            HCPOL[HealthCheckPolicy: backstage]
        end
        subgraph "Resilience & Scaling"
            I[HPA: backstage<br/>Min: 2, Max: 5<br/>CPU: 60%, Memory: 75%]
            PDB[PodDisruptionBudget<br/>Min Available: 1]
        end
        subgraph "Observability"
            J[PodMonitoring: backstage<br/>Port: 9464]
        end
        subgraph "Secrets Store CSI Driver"
            K[SecretProviderClass: backstage]
        end
    end
    subgraph "Gateway API (mcp Namespace)"
        L[HTTPRoute: backstage]
        GW[Gateway: external-gw-01]
    end
    subgraph "GCP Services"
        O[Cloud SQL Instance<br/>bits-backstage-prod:us-east4:backstage-prod]
        P[Secret Manager]
        S[Cloud Monitoring]
    end
    subgraph "External"
        T["User (backstage.broadinstitute.org)"]
    end

    style A fill:#a8d0db,stroke:#333,stroke-width:2px,color:#000
    style B fill:#a8d0db,stroke:#333,stroke-width:2px,color:#000
    style H fill:#90ee90,stroke:#333,stroke-width:2px,color:#000
    style HCPOL fill:#90ee90,stroke:#333,stroke-width:2px,color:#000
    style I fill:#ffcccb,stroke:#333,stroke-width:2px,color:#000
    style PDB fill:#ffcccb,stroke:#333,stroke-width:2px,color:#000
    style J fill:#f0e68c,stroke:#333,stroke-width:2px,color:#000
    style K fill:#f0e68c,stroke:#333,stroke-width:2px,color:#000
    style L fill:#ffa500,stroke:#333,stroke-width:2px,color:#000
    style GW fill:#ffa500,stroke:#333,stroke-width:2px,color:#000
    style C fill:#fffacd,stroke:#333,stroke-width:2px,color:#000
    style D fill:#fffacd,stroke:#333,stroke-width:2px,color:#000
    style E fill:#fffacd,stroke:#333,stroke-width:2px,color:#000
    style O fill:#add8e6,stroke:#333,stroke-width:2px,color:#000
    style P fill:#add8e6,stroke:#333,stroke-width:2px,color:#000
    style S fill:#add8e6,stroke:#333,stroke-width:2px,color:#000
    style T fill:#eee,stroke:#333,stroke-width:2px,color:#000

    F -- uses --> D
    A -- contains --> F
    A -- uses --> C
    A -- mounts --> E
    E -- uses --> K
    K -- fetches from --> P
    H -- targets --> A
    HCPOL -- monitors --> H
    I -- scales --> A
    PDB -- protects --> A
    J -- monitors port 9464 --> A
    L -- routes --> H
    GW -- hosts --> L
    T -- accesses --> L
    B -- connects to --> O
    S -- collects from --> J

    classDef default fill:#fff,stroke:#333,stroke-width:1px;
```

## Deployment Components

### Core Components

- **Deployment**: Runs 2 replicas with autoscaling up to 5 pods
- **Service**: Exposes Backstage on port 80 (targets port 7007)
- **Pod**: Runs backstage container with cloud-sql-proxy init container

### Resilience Policies

- **HorizontalPodAutoscaler**: Scales based on CPU (60%) and memory (75%)
  utilization
- **PodDisruptionBudget**: Ensures minimum 1 replica available during
  disruptions
- **HealthCheckPolicy**: Monitors service health via HTTP readiness probe

### Networking

- **HTTPRoute**: Gateway API resource routing traffic to backstage service
- **External Gateway**: `external-gw-01` in the `mcp` namespace handles ingress

### Security & Secrets

- **ServiceAccount**: `backstage@bits-backstage-prod.iam.gserviceaccount.com`
  for Workload Identity
- **SecretProviderClass**: Mounts secrets from GCP Secret Manager via CSI driver
- **Secrets**: GitHub, Google, PagerDuty credentials and Slack/Soundcheck tokens

### Observability

- **PodMonitoring**: Prometheus-style metrics collection on port 9464
- **Cloud Monitoring**: Integration with GCP monitoring

### Data

- **Cloud SQL**: PostgreSQL instance at
  `bits-backstage-prod:us-east4:backstage-prod`
- **cloud-sql-proxy**: Secure connection via IAM authentication
