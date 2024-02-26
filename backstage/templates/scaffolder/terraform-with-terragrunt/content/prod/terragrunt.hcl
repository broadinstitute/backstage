# Terragrunt meta configuration

include {
  path = find_in_parent_folders()
}

terraform {
  source = "file://${get_terragrunt_dir()}/../terraform//"
}
