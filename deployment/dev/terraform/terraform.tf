terraform {
  required_version = "1.7.0"
  backend "gcs" {
    bucket = "broad-atlantis-terraform-prod"
    prefix = "backstage/dev"
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.14.0"
    }
    postgresql = {
      source  = "doctolib/postgresql"
      version = "2.22.0"
    }
  }
}
