terraform {
  required_version = "1.7.0"
  backend "gcs" {
    bucket = "broad-atlantis-terraform-prod"
    prefix = "backstage/prod"
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.39.1"
    }
   google-beta = {
      source  = "hashicorp/google-beta"
      version = "5.39.1"
    }
    postgresql = {
      source  = "cyrilgdn/postgresql"
      version = "1.21.0"
    }
  }
}
