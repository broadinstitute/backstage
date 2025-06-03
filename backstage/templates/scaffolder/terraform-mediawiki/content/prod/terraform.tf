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
    random = {
      source  = "hashicorp/random"
      version = "3.7.2"
    }
    time = {
      source  = "hashicorp/time"
      version = "0.13.1"
    }
  }
}
