terraform {
  required_version = "${{ values.terraformVersion }}"
  backend "gcs" {
    bucket = "${{ values.gcsBucket }}"
    prefix = "${{ values.name }}/prod"
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
  }
}
