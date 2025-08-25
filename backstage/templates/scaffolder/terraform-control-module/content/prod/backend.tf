terraform {
  backend "gcs" {
    bucket = "${{ values.gcsBucket }}"
    prefix = "${{ values.name }}/prod"
  }
}
