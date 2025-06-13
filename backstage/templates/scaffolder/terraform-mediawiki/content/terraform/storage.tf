resource "google_storage_bucket" "mediawiki_data" {
  force_destroy               = false
  location                    = var.core_region
  name                        = "mediawiki-${{ values.name }}-data"
  public_access_prevention    = "enforced"
  uniform_bucket_level_access = true

  autoclass {
    enabled = true
  }

  versioning {
    enabled = true
  }
}

# The permissions here only allow full access to buckets in this project.
resource "google_project_iam_member" "mediawiki" {
  member  = google_service_account.mediawiki.member
  project = var.core_project
  role    = "roles/storage.objectUser"

  depends_on = [
    google_service_account.mediawiki
  ]
}
