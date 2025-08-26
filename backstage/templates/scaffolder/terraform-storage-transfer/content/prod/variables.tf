variable "api_services" {
  default = [
    "iam.googleapis.com",
    "storage.googleapis.com",
    "storagetransfer.googleapis.com",
  ]
  description = "List of API services to enable"
  type        = list(string)
}

variable "core_project" {
  default     = "${{ values.gcpProject }}"
  description = "GCP project managed by the default/primary provider"
  type        = string
}
