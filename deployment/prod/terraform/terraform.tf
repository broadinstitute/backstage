terraform {
  required_version = "1.7.0"
  backend "gcs" {
    bucket = "broad-atlantis-terraform-prod"
    prefix = "backstage/prod"
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.12.0"
    }
  }
}