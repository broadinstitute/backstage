variable "api_services" {
  description = "List of API services to enable"
  type        = list(string)
  default = [
    "iam.googleapis.com",
    "iap.googleapis.com",
    "run.googleapis.com",
    "storage.googleapis.com",
  ]
}

variable "core_project" {
  description = "GCP project to which to deploy all infrastructure"
  type        = string
}

variable "core_region" {
  description = "GCP region to which to deploy all infrastructure"
  type        = string
}

variable "env" {
  description = "Label for the environment or tier you are working in. Typically dev, staging, or prod"
  type        = string
}

variable "web_domains" {
  default     = []
  description = "List of web domains to which to deploy the service"
  type        = list(string)
}
