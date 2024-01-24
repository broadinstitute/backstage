provider "google" {
  project = var.core_project
  region  = "us-east4"
}

data "google_client_config" "current" {}

data "google_project" "current" {
  project_id = var.core_project
}

resource "google_project_service" "api_services" {
  for_each                   = toset(var.api_services)
  project                    = var.core_project
  service                    = each.key
  disable_dependent_services = false
  disable_on_destroy         = false
}
