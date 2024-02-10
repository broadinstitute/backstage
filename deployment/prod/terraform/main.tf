data "google_client_config" "current" {}

data "google_project" "current" {
  project_id = var.core_project
}

locals {
  google_secret_manager_secrets = {
    for secret, labels in var.google_secret_manager_secrets :
    secret => merge(labels, { created-by = "terraform", terraform-module = "terraform-bits-${local.application_name}-${var.env}" })
  }
}

provider "google" {
  project = var.core_project
  region  = "us-east4"
}

resource "google_project_service" "api_services" {
  for_each                   = toset(var.api_services)
  project                    = var.core_project
  service                    = each.key
  disable_dependent_services = false
  disable_on_destroy         = false
}

resource "google_secret_manager_secret" "backstage-bits-credentials" {
  for_each  = local.google_secret_manager_secrets
  project   = var.core_project
  secret_id = each.key
  labels    = each.value

  replication {
    auto {}
  }
}

resource "google_storage_bucket" "tech-docs" {
  name                        = "${var.core_project}-tech-docs"
  project                     = var.core_project
  location                    = "US"
  storage_class               = "STANDARD"
  force_destroy               = false
  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age                = 365
      num_newer_versions = 1
    }
    action {
      type = "Delete"
    }
  }

  lifecycle {
    prevent_destroy = true
  }
}