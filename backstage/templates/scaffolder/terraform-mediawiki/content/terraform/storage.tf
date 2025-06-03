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

# The permissions here allow read/write access to the data bucket in this
# project. If access to other buckets in this project is also necessary, more
# google_storage_bucket_iam_member resources should be added.
resource "google_storage_bucket_iam_member" "mediawiki_data" {
  bucket  = google_storage_bucket.mediawiki_data.name
  member  = google_service_account.mediawiki.member
  role    = "roles/storage.objectUser"

  depends_on = [
    google_service_account.mediawiki,
    google_storage_bucket.mediawiki_data,
  ]
}
