# Global terragrunt configuration

locals {
  settings_vars = read_terragrunt_config("settings.hcl")

  application_name = local.settings_vars.locals.application_name
  bucket           = local.settings_vars.locals.bucket
  bucket_project   = local.settings_vars.locals.bucket_project
  environment      = local.settings_vars.locals.environment
  project          = local.settings_vars.locals.project
  region           = local.settings_vars.locals.region
}

# Backend state configuration
remote_state {
  backend      = "gcs"
  disable_init = tobool(get_env("DISABLE_INIT", "false"))
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite"
  }
  config = {
    bucket   = local.bucket
    location = "us"
    prefix   = "${local.application_name}/${local.environment}"
    project  = local.bucket_project
  }
}

# stage/terragrunt.hcl
generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
provider "google" {
  project     = var.project
  region      = var.region
}
provider "google-beta" {
  project     = var.project
  region      = var.region
}
EOF
}

inputs = merge(local.settings_vars.locals)
