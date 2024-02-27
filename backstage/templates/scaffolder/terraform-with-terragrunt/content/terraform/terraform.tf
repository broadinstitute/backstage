terraform {
  required_version = "${{ values.terraformVersion }}"

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
