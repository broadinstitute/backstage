variable "api_services" {
  default = [
    "compute.googleapis.com",
  ]
  description = "The default list of APIs to activate in the project"
  type        = list(any)
}

variable "billing_account" {
  description = "The billing account to use for the project"
  type        = string
}

variable "cost_object" {
  description = "The cost object for labeling the project"
  type        = string
}

variable "folder_id" {
  description = "The GCP folder ID where the project should reside"
  type        = string
}

variable "project" {
  description = "The deployment project"
  type        = string
}

variable "project_name" {
  description = "The descriptive name for the project"
  type        = string
}

# tflint-ignore: terraform_unused_declarations
variable "region" {
  description = "The deployment region"
  type        = string
}
