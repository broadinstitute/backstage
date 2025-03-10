# Input variables to accept values from the calling module
# https://www.terraform.io/docs/modules/#standard-module-structure

variable "additional_databases" {
  description = "A list of databases to be created in your cluster"
  type = list(object({
    name      = string
    charset   = string
    collation = string
  }))
  default = []
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

variable "database_flags" {
  description = "List of database flags to set on the CloudSQL instance"
  type = list(object({
    name  = string
    value = string
  }))
  default = []
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

variable "namespace" {
  description = "Kubernetes Namespace to deploy resources into"
  type        = string
}
