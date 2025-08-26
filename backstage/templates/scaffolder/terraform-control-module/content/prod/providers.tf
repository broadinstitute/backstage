provider "google" {
  project = var.core_project
  region  = "${{ values.gcpRegion }}"
}
