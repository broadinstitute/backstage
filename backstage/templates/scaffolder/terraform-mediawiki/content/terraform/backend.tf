terraform {
  backend "gcs" {
    bucket = "${{ values.gcsTerraformBucket }}"
    prefix = "${{ values.name }}"
  }
}
