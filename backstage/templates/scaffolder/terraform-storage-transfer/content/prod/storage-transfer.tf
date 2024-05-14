resource "google_service_account" "default" {
  account_id = "storage-transfer-service"
}

resource "google_service_account_key" "default" {
  service_account_id = "${resource.google_service_account.default.id}"
}

resource "google_project_iam_member" "default" {
  project = var.core_project
  role    = "roles/storagetransfer.transferAgent"
  member  = resource.google_service_account.default.member
}

resource "google_storage_transfer_agent_pool" "default" {
  name         = "default-pool"
  display_name = "Agent pool for upload job"

  depends_on   = [google_project_iam_member.default]
}

resource "google_storage_bucket" "default" {
  name     = "${{ values.gcsBucket }}"
  location = var.core_region
}

resource "google_storage_transfer_job" "default" {
  description = "Upload job"

  transfer_spec {
    source_agent_pool_name = resource.google_storage_transfer_agent_pool.default.id
    posix_data_source {
      root_directory = "${{ values.sourceDirectory }}"
    }
    gcs_data_sink {
      bucket_name = google_storage_bucket.default.name
      path        = "${{ values.name }}/sink"
    }
  }
  schedule {
    schedule_start_date {
      year  = 1
      month = 1
      day   = 1
    }
    start_time_of_day {
      hours   = 0
      minutes = 0
      seconds = 0
      nanos   = 0
    }
    repeat_interval = "86400s"
  }
}
