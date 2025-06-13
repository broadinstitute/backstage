provider "google" {
  project = var.core_project
  region  = var.core_region
}

provider "google-beta" {
  project = var.core_project
  region  = var.core_region
}
