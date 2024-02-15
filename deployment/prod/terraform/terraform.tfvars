# https://www.terraform.io/docs/configuration/variables.html#variable-definitions-tfvars-files
# Terraform automatically loads variable definition from this file.
# Use this file to override variable defaults set in variables.tf
# ex. foo = "bar"

core_project = "bits-backstage-prod"
env          = "prod"
gke_project  = "bits-gke-clusters"

cloudsql_tier = "db-custom-8-32768" # 8 CPU and 32GB RAM"
google_secret_manager_secrets = {
  github-app-backstage-bits-credentials = {
    service = "github"
    type    = "yaml-file"
  },
  auth-github-client-id = {
    service = "github"
    type    = "string"
  },
  auth-github-client-secret = {
    service = "github"
    type    = "string"
  },
  auth-google-client-id = {
    service = "google"
    type    = "string"
  },
  auth-google-client-secret = {
    service = "google"
    type    = "string"
  },
  pagerduty-client-id = {
    service = "pagerduty"
    type    = "string"
  },
  pagerduty-client-secret = {
    service = "pagerduty"
    type    = "string"
  },
}