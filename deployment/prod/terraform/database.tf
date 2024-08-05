locals { #todo the data heere should probably be a variable
  all_databases = concat([local.application_name], [for db in var.additional_databases : db.name])
}

# Create a service account for App to use to connect to the CloudSQL instance
module "db_service_accounts" {
  source      = "terraform-google-modules/service-accounts/google"
  version     = "4.2.3"
  project_id  = var.core_project
  names       = [local.application_name]
  description = "service account for ${local.application_name}"
  project_roles = [
    "${var.core_project}=>roles/secretmanager.secretAccessor",
    "${var.core_project}=>roles/cloudsql.instanceUser",
    "${var.core_project}=>roles/cloudsql.client",
    "${var.core_project}=>roles/monitoring.viewer",
    "${var.core_project}=>roles/monitoring.metricWriter",
    "${var.core_project}=>roles/iam.serviceAccountTokenCreator",
    "bits-gke-clusters=>roles/container.clusterViewer",
    "bits-gke-clusters=>roles/container.viewer",
    "bits-gke-clusters-dev=>roles/container.clusterViewer",
    "bits-gke-clusters-dev=>roles/container.viewer",
  ]
}

resource "google_service_account_iam_member" "db_workload_identity" {
  service_account_id = module.db_service_accounts.service_accounts_map[local.application_name]["name"]
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:${var.gke_project}.svc.id.goog[${local.application_name}/${local.application_name}]"
}

# Create a CloudSQL instance for App to use
module "postgres" {
  source                      = "GoogleCloudPlatform/sql-db/google//modules/postgresql"
  version                     = "21.0.0"
  database_version            = "POSTGRES_15"
  name                        = "${local.application_name}-${var.env}"
  project_id                  = var.core_project
  user_name                   = local.application_name
  db_name                     = local.application_name
  additional_databases        = var.additional_databases
  deletion_protection         = false # todo: Used to block Terraform from deleting a SQL Instance. - Set to false for now
  deletion_protection_enabled = false # todo: Enables protection of an instance from accidental deletion across all surfaces (API, gcloud, Cloud Console and Terraform). - Set to false for now
  enable_default_db           = true
  region                      = data.google_client_config.current.region
  edition                     = "ENTERPRISE"
  tier                        = var.cloudsql_tier # "db-n1-standard-8" # todo: Think about this for prod ( Maps to Production Preset )

  ip_configuration = {
    ssl_mode = true
  }

  database_flags = [
    {
      name  = "cloudsql.iam_authentication"
      value = "on"
    },
  ]

  iam_users = [
    {
      id    = local.application_name,
      email = module.db_service_accounts.service_accounts_map[local.application_name]["email"],
    },
  ]
}

provider "postgresql" {
  alias     = "database"
  scheme    = "gcppostgres"
  username  = local.application_name
  password  = module.postgres.generated_user_password
  host      = module.postgres.instance_connection_name
  superuser = false
}

resource "postgresql_grant" "database_connect" {
  for_each    = toset(local.all_databases)
  provider    = postgresql.database
  database    = each.value
  object_type = "database"
  role        = trimsuffix(module.postgres.iam_users[0].email, ".gserviceaccount.com")
  privileges  = ["CONNECT", "CREATE"]
  schema      = "public"
  lifecycle {
    ignore_changes = all
  }
  depends_on = [module.postgres]
}

resource "postgresql_grant" "schema_usage_create" {
  for_each    = toset(local.all_databases)
  provider    = postgresql.database
  database    = each.value
  object_type = "schema"
  role        = trimsuffix(module.postgres.iam_users[0].email, ".gserviceaccount.com")
  privileges  = ["USAGE", "CREATE"]
  schema      = "public"
  lifecycle {
    ignore_changes = all
  }
  depends_on = [module.postgres]
}

resource "postgresql_grant" "table_permissions" {
  for_each    = toset(local.all_databases)
  provider    = postgresql.database
  database    = each.value
  object_type = "table"
  role        = trimsuffix(module.postgres.iam_users[0].email, ".gserviceaccount.com")
  privileges  = ["SELECT", "INSERT", "UPDATE", "DELETE"]
  schema      = "public"
  lifecycle {
    ignore_changes = all
  }
  depends_on = [module.postgres]
}
