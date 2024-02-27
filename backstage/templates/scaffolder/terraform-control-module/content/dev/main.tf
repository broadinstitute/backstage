data "google_client_config" "current" {}

data "google_project" "current" {
  project_id = var.core_project
}

provider "google" {
  project = var.core_project
  region  = "${{ values.gcpRegion }}"
}
