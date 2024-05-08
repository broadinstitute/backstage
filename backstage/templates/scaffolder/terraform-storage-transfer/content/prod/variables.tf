variable "api_services" {
  description = "List of API services to enable"
  type        = list(string)
  default = [
    "iam.googleapis.com",
    "storagetransfer.googleapis.com",
    "storage.googleapis.com",
  ]
}

variable "core_project" {
  description = "GCP project managed by the default/primary provider"
  type        = string
  default     = "${{ values.gcpProject }}"
}
