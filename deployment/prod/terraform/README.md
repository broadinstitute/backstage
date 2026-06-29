# terraform repo for backstage

Terraform Repo for backstage

<!-- BEGIN_TF_DOCS -->

## Terraform Docs

[Terraform Docs](https://terraform-docs.io/) created by running the following
from the root of the repository:

```shell
podman run --rm -u $(id -u) \
    --volume "$(pwd):/terraform-docs" \
    -w /terraform-docs \
    quay.io/terraform-docs/terraform-docs:latest \
    --output-file /terraform-docs/deployment/prod/terraform/README.md \
    --output-mode inject /terraform-docs/deployment/prod/terraform
```

Remember update the dependency lock file for different architectures:

```shell
terraform providers lock \
    -platform=linux_amd64 \
    -platform=linux_arm64 \
    -platform=darwin_amd64 \
    -platform=darwin_arm64 \
    -platform=windows_amd64
```

## Requirements

| Name                                                                           | Version |
| ------------------------------------------------------------------------------ | ------- |
| <a name="requirement_terraform"></a> [terraform](#requirement_terraform)       | 1.14.8  |
| <a name="requirement_google"></a> [google](#requirement_google)                | 7.25.0  |
| <a name="requirement_google-beta"></a> [google-beta](#requirement_google-beta) | 7.25.0  |
| <a name="requirement_postgresql"></a> [postgresql](#requirement_postgresql)    | 1.25.0  |
| <a name="requirement_random"></a> [random](#requirement_random)                | 3.8.1   |

## Providers

| Name                                                                                             | Version |
| ------------------------------------------------------------------------------------------------ | ------- |
| <a name="provider_google"></a> [google](#provider_google)                                        | 7.25.0  |
| <a name="provider_postgresql.database"></a> [postgresql.database](#provider_postgresql.database) | 1.25.0  |

## Modules

| Name                                                                                         | Source                                                | Version |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------- |
| <a name="module_db_service_accounts"></a> [db_service_accounts](#module_db_service_accounts) | terraform-google-modules/service-accounts/google      | 4.7.0   |
| <a name="module_postgres"></a> [postgres](#module_postgres)                                  | GoogleCloudPlatform/sql-db/google//modules/postgresql | 28.1.0  |

## Resources

| Name                                                                                                                                                                  | Type        |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [google_project_iam_member.sa_access](https://registry.terraform.io/providers/hashicorp/google/7.25.0/docs/resources/project_iam_member)                              | resource    |
| [google_project_iam_member.team_access](https://registry.terraform.io/providers/hashicorp/google/7.25.0/docs/resources/project_iam_member)                            | resource    |
| [google_project_service.api_services](https://registry.terraform.io/providers/hashicorp/google/7.25.0/docs/resources/project_service)                                 | resource    |
| [google_secret_manager_secret.backstage-bits-credentials](https://registry.terraform.io/providers/hashicorp/google/7.25.0/docs/resources/secret_manager_secret)       | resource    |
| [google_secret_manager_secret_iam_member.ksa-access](https://registry.terraform.io/providers/hashicorp/google/7.25.0/docs/resources/secret_manager_secret_iam_member) | resource    |
| [google_secret_manager_secret_version.mcp_token](https://registry.terraform.io/providers/hashicorp/google/7.25.0/docs/resources/secret_manager_secret_version)        | resource    |
| [google_service_account_iam_member.db_workload_identity](https://registry.terraform.io/providers/hashicorp/google/7.25.0/docs/resources/service_account_iam_member)   | resource    |
| [google_storage_bucket.tech-docs](https://registry.terraform.io/providers/hashicorp/google/7.25.0/docs/resources/storage_bucket)                                      | resource    |
| [google_storage_bucket_iam_member.service-account](https://registry.terraform.io/providers/hashicorp/google/7.25.0/docs/resources/storage_bucket_iam_member)          | resource    |
| [postgresql_grant.database_connect](https://registry.terraform.io/providers/cyrilgdn/postgresql/1.25.0/docs/resources/grant)                                          | resource    |
| [postgresql_grant.schema_usage_create](https://registry.terraform.io/providers/cyrilgdn/postgresql/1.25.0/docs/resources/grant)                                       | resource    |
| [postgresql_grant.table_permissions](https://registry.terraform.io/providers/cyrilgdn/postgresql/1.25.0/docs/resources/grant)                                         | resource    |
| [google_client_config.current](https://registry.terraform.io/providers/hashicorp/google/7.25.0/docs/data-sources/client_config)                                       | data source |
| [google_project.core](https://registry.terraform.io/providers/hashicorp/google/7.25.0/docs/data-sources/project)                                                      | data source |
| [google_project.gke](https://registry.terraform.io/providers/hashicorp/google/7.25.0/docs/data-sources/project)                                                       | data source |

## Inputs

| Name                                                                                                                     | Description                                                                                                              | Type                                                                                               | Default                                                                                                                                                                                                                                                                                                             | Required |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: |
| <a name="input_core_project"></a> [core_project](#input_core_project)                                                    | GCP project to use for the default/primary provider                                                                      | `string`                                                                                           | n/a                                                                                                                                                                                                                                                                                                                 |   yes    |
| <a name="input_env"></a> [env](#input_env)                                                                               | Label for the environment or tier you are working in. Typically dev, staging, or prod                                    | `string`                                                                                           | n/a                                                                                                                                                                                                                                                                                                                 |   yes    |
| <a name="input_gke_project"></a> [gke_project](#input_gke_project)                                                       | GCP project Where GKE clusters are running                                                                               | `string`                                                                                           | n/a                                                                                                                                                                                                                                                                                                                 |   yes    |
| <a name="input_google_secret_manager_secrets"></a> [google_secret_manager_secrets](#input_google_secret_manager_secrets) | Map of secrets to create in Google Secret Manager in the format of { secret_name = { service = string, type = string } } | <pre>map(object({<br/> service = string<br/> type = string<br/> }))</pre>                          | n/a                                                                                                                                                                                                                                                                                                                 |   yes    |
| <a name="input_namespace"></a> [namespace](#input_namespace)                                                             | Kubernetes Namespace to deploy resources into                                                                            | `string`                                                                                           | n/a                                                                                                                                                                                                                                                                                                                 |   yes    |
| <a name="input_additional_databases"></a> [additional_databases](#input_additional_databases)                            | A list of databases to be created in your cluster                                                                        | <pre>list(object({<br/> name = string<br/> charset = string<br/> collation = string<br/> }))</pre> | `[]`                                                                                                                                                                                                                                                                                                                |    no    |
| <a name="input_api_services"></a> [api_services](#input_api_services)                                                    | List of API services to enable                                                                                           | `list(string)`                                                                                     | <pre>[<br/> "compute.googleapis.com",<br/> "monitoring.googleapis.com",<br/> "cloudidentity.googleapis.com",<br/> "iam.googleapis.com",<br/> "iap.googleapis.com",<br/> "iamcredentials.googleapis.com",<br/> "sts.googleapis.com",<br/> "secretmanager.googleapis.com",<br/> "sqladmin.googleapis.com"<br/>]</pre> |    no    |
| <a name="input_cloudsql_tier"></a> [cloudsql_tier](#input_cloudsql_tier)                                                 | CloudSQL tier to use                                                                                                     | `string`                                                                                           | `"db-g1-small"`                                                                                                                                                                                                                                                                                                     |    no    |
| <a name="input_database_flags"></a> [database_flags](#input_database_flags)                                              | List of database flags to set on the CloudSQL instance                                                                   | <pre>list(object({<br/> name = string<br/> value = string<br/> }))</pre>                           | `[]`                                                                                                                                                                                                                                                                                                                |    no    |

## Outputs

No outputs.

<!-- END_TF_DOCS -->
