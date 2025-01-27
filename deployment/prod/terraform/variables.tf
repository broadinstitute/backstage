# Input variables to accept values from the calling module
# https://www.terraform.io/docs/modules/#standard-module-structure

variable "additional_databases" {
  description = "A list of databases to be created in your cluster"
  type = list(object({
    name      = string
    charset   = string
    collation = string
  }))
  default = [
    { name      = "backstage_plugin_app",
      charset   = "",
      collation = "",
    },
    { name      = "backstage_plugin_auth",
      charset   = "",
      collation = "",
    },
    { name      = "backstage_plugin_catalog",
      charset   = "",
      collation = "",
    },
    { name      = "backstage_plugin_scaffolder",
      charset   = "",
      collation = "",
    },
    { name      = "backstage_plugin_search",
      charset   = "",
      collation = "",
    },
    { name      = "backstage_plugin_proxy",
      charset   = "",
      collation = "",
    },
    { name      = "backstage_plugin_techdocs",
      charset   = "",
      collation = "",
    },
    { name      = "backstage_plugin_permission",
      charset   = "",
      collation = "",
    },
    {
      name      = "backstage_plugin_kubernetes",
      charset   = "",
      collation = "",
    },
    {
      name      = "backstage_plugin_pagerduty",
      charset   = "",
      collation = "",
    },
    {
      name      = "backstage_plugin_backstage-insights"
      charset   = ""
      collation = ""
    },
    {
      name      = "backstage_plugin_skill-exchange"
      charset   = ""
      collation = ""
    },
    {
      name      = "backstage_plugin_tech-radar"
      charset   = ""
      collation = ""
    },
    {
      name      = "backstage_plugin_soundcheck"
      charset   = ""
      collation = ""
    },

  ]
}
variable "api_services" {
  description = "List of API services to enable"
  type        = list(string)
  default = [
    "compute.googleapis.com",
    "monitoring.googleapis.com",
    "cloudidentity.googleapis.com",
    "iam.googleapis.com",
    "iap.googleapis.com",
    "iamcredentials.googleapis.com",
    "sts.googleapis.com",
    "secretmanager.googleapis.com",
    "sqladmin.googleapis.com",
  ]
}

variable "cloudsql_tier" {
  description = "CloudSQL tier to use"
  type        = string
  default     = "db-g1-small"
}

variable "core_project" {
  description = "GCP project to use for the default/primary provider"
  type        = string

}

variable "env" {
  description = "Label for the environment or tier you are working in. Typically dev, staging, or prod"
  type        = string
}

variable "google_secret_manager_secrets" {
  description = "Map of secrets to create in Google Secret Manager in the format of { secret_name = {  service = string, type = string } }"
  type = map(object({
    service = string
    type    = string
  }))
}


variable "gke_project" {
  description = "GCP project Where GKE clusters are running"
  type        = string
}
