terraform {
  required_version = "${{ values.terraformVersion }}"
  backend "gcs" {
    bucket = "${{ values.gcsBucket }}"
    prefix = "${{ values.name }}/state"
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "${{ values.googleProviderVersion }}"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "${{ values.googleProviderVersion }}"
    }
    time = {
      source = "hashicorp/time"
      version = "0.13.1"
    }
  }
}
