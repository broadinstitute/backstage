terraform {
  required_version = "1.10.5"
  backend "gcs" {
    bucket = "broad-atlantis-terraform-prod"
    prefix = "backstage/prod"
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.22.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "6.22.0"
    }
    postgresql = {
      source  = "cyrilgdn/postgresql"
      version = "1.25.0"
    }
  }
}
