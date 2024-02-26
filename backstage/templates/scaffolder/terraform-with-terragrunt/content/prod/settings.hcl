locals {
  application_name = "${{ values.name }}"
  billing_account  = "${{ values.gcpBillingAccount }}"
  bucket           = "${{ values.gcsBucket }}"
  bucket_project   = "${{ values.gcsBucketProject }}"
  cost_object      = "${{ values.broadCostObject }}"
  environment      = "prod"
  folder_id        = "${{ values.gcpFolderId }}"
  project          = "${{ values.gcpProjectProd }}"
  project_name     = "${{ values.gcpProjectProdName }}"
  region           = "${{ values.gcpRegion }}"
  zone             = "${{ values.gcpZone }}"
}
