locals {
  application_name = "${{ values.name }}"
  billing_account  = "${{ values.gcpBillingAccount }}"
  bucket           = "${{ values.gcsBucket }}"
  bucket_project   = "${{ values.gcsBucketProject }}"
  cost_object      = "${{ values.broadCostObject }}"
  environment      = "dev"
  folder_id        = "${{ values.gcpFolderId }}"
  project          = "${{ values.gcpProjectDev }}"
  project_name     = "${{ values.gcpProjectDevName }}"
  region           = "${{ values.gcpRegion }}"
  zone             = "${{ values.gcpZone }}"
}
