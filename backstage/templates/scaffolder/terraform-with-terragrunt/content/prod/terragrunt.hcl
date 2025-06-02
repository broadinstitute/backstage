# Terragrunt meta configuration

include "root" {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "file://${get_terragrunt_dir()}/../terraform//"
}
