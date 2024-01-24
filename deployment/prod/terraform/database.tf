# Create a service account for App to use to connect to the CloudSQL instance
module "db_service_accounts" {
  source      = "terraform-google-modules/service-accounts/google"
  version     = "4.2.2"
  project_id  = var.core_project
  names       = ["${local.application_name}"]
  description = "service account for CloudSQL access"
  project_roles = [
    "${var.core_project}=>roles/cloudsql.instanceUser",
    "${var.core_project}=>roles/cloudsql.client",
    "${var.core_project}=>roles/monitoring.viewer",
    "${var.core_project}=>roles/monitoring.metricWriter",
    "${var.core_project}=>roles/iam.serviceAccountTokenCreator",
  ]
}

resource "google_service_account_iam_member" "db_workload_identity" {
  service_account_id = module.db_service_accounts.service_accounts_map["${local.application_name}"]["name"]
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:${var.gke_project}.svc.id.goog[${local.application_name}/${local.application_name}]" 
}

# Create a CloudSQL instance for App to use
module "postgres" {
  source                      = "GoogleCloudPlatform/sql-db/google//modules/postgresql"
  version                     = "18.2.0"
  database_version            = "POSTGRES_15"
  name                        = "${local.application_name}-${var.env}"
  project_id                  = var.core_project
  user_name                   = local.application_name
  db_name                     = local.application_name
  deletion_protection         = false # todo: Used to block Terraform from deleting a SQL Instance. - Set to false for now
  deletion_protection_enabled = false # todo: Enables protection of an instance from accidental deletion across all surfaces (API, gcloud, Cloud Console and Terraform). - Set to false for now
  enable_default_db           = true
  region                      = data.google_client_config.current.region
  edition                     = "ENTERPRISE"
  tier                        = var.cloudsql_tier # "db-n1-standard-8" # todo: Think about this for prod ( Maps to Production Preset )

  ip_configuration = {
    require_ssl = true
  }

  database_flags = [
    {
      name  = "cloudsql.iam_authentication"
      value = "on"
    },
  ]

  iam_users = [
    {
      id    = "${local.application_name}",
      email = module.db_service_accounts.service_accounts_map["${local.application_name}"]["email"]
    },
  ]
}
