# Input variables to accept values from the calling module
# https://www.terraform.io/docs/modules/#standard-module-structure

variable "core_project" {
  description = "GCP project managed by the default/primary provider"
  type        = string

}

variable "env" {
  description = "Label for the environment or tier you are working in. Typically dev, staging, or prod"
  type        = string
}
