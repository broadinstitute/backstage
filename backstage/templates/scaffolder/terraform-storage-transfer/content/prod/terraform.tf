terraform {
  required_version = "${{ values.terraformVersion }}"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "${{ values.googleProviderVersion }}"
    }
  }
}
