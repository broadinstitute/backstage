resource "google_service_account" "default" {
  account_id = "storage-transfer-service"
}

resource "google_service_account_key" "default" {
  service_account_id = "${resource.google_service_account.default.id}"
}

resource "google_project_iam_member" "default" {
  member  = resource.google_service_account.default.member
  project = var.core_project
  role    = "roles/storagetransfer.transferAgent"
}

resource "google_storage_transfer_agent_pool" "default" {
  display_name = "Agent pool for upload job"
  name         = "default-pool"

  depends_on   = [google_project_iam_member.default]
}

resource "google_storage_bucket" "default" {
  location = var.core_region
  name     = "${{ values.gcsBucket }}"
}

resource "google_storage_transfer_job" "default" {
  description = "Upload job"

  transfer_spec {
    source_agent_pool_name = resource.google_storage_transfer_agent_pool.default.id

    gcs_data_sink {
      bucket_name = google_storage_bucket.default.name
      path        = "${{ values.name }}/sink"
    }
    posix_data_source {
      root_directory = "${{ values.sourceDirectory }}"
    }
  }
  schedule {
    repeat_interval = "86400s"

    schedule_start_date {
      day   = 1
      month = 1
      year  = 1
    }
    start_time_of_day {
      hours   = 0
      minutes = 0
      nanos   = 0
      seconds = 0
    }
  }
}
