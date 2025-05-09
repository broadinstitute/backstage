provider "google" {
  project = var.core_project
  region  = var.core_region
}

provider "google-beta" {
  project = var.core_project
  region  = var.core_region
}

resource "google_project_service" "api_services" {
  for_each                   = toset(var.api_services)
  project                    = var.core_project
  service                    = each.key
  disable_dependent_services = false
  disable_on_destroy         = false
}
