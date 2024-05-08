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
  }
}
