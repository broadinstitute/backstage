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

locals {
  google_secret_manager_secrets = {
    github-app-backstage-bits-credentials = {
      created-by       = "terraform"
      terraform-module = "terraform-bits-${local.application_name}-${var.env}"
      service          = "github"
      type             = "yaml-file"
    },
    auth-github-client-id = {
      created-by       = "terraform"
      terraform-module = "terraform-bits-${local.application_name}-${var.env}"
      service          = "github"
      type             = "string"
    },
    auth-github-client-secret = {
      created-by       = "terraform"
      terraform-module = "terraform-bits-${local.application_name}-${var.env}"
      service          = "github"
      type             = "string"
    },
    auth-google-client-id = {
      created-by       = "terraform"
      terraform-module = "terraform-bits-${local.application_name}-${var.env}"
      service          = "google"
      type             = "string"
    },
    auth-google-client-secret = {
      created-by       = "terraform"
      terraform-module = "terraform-bits-${local.application_name}-${var.env}"
      service          = "google"
      type             = "string"
    },
  }
}
# Terraform creates this secret but does not manage it
resource "google_secret_manager_secret" "backstage-bits-credentials" {
  for_each  = local.google_secret_manager_secrets
  project   = var.core_project
  secret_id = each.key
  labels    = each.value

  replication {
    auto {}
  }
}

#AUTH_GOOGLE_CLIENT_ID
#AUTH_GOOGLE_CLIENT_SECRET
#AUTH_GITHUB_CLIENT_ID
#AUTH_GITHUB_CLIENT_SECRET
