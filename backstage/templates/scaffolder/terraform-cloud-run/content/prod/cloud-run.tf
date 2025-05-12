# The main block that manages the cloud run services. The application will not
# be redeployed when running `terraform apply` unless something in this resource
# has changed.
resource "google_cloud_run_v2_service" "default" {
  provider             = google-beta
  project              = var.core_project
  location             = var.core_region
  name                 = "${{ values.applicationName }}"
  launch_stage         = "BETA"
  # BEWARE: If iap_enabled is false while invoker_iam_disabled is true, the
  # service will be completely open to the internet.
  iap_enabled          = true
  invoker_iam_disabled = true
  template {
    service_account = google_service_account.default.email
    containers {
      image = "${{ values.applicationImage }}"
      ports {
        container_port = "${{ values.applicationPort }}"
      }
      volume_mounts {
        name       = "bucket-mount"
        mount_path = "${{ values.applicationVolumePath }}"
      }
    }
    volumes {
      name = "bucket-mount"
      gcs {
        bucket    = "${{ values.applicationBucket }}"
        read_only = true
      }
    }
  }
  depends_on = [
    time_sleep.wait_for_iam
  ]
}

# Deploying the cloud run service too quicly after service account creation
# fails cryptically. A redeploy fixes it but that's tedious -- sleeping a couple
# minutes results in a clear run the first time. Since terraform stores state,
# this sleep should not apply on any run except the very first unless you
# intentionally taint it.
resource "time_sleep" "wait_for_iam" {
  depends_on = [google_service_account.default]
  create_duration = "180s"
}

resource "google_service_account" "default" {
  project    = var.core_project
  account_id = "sa-${{ values.applicationName }}"
}

# The permissions here only allow read access to buckets in this project. If
# write access is necessary, this resource will need to be modified. See
# "Sharing data between environments" in the usage documentation for more
# details.
resource "google_project_iam_member" "default" {
  project = "${{ values.applicationBucketProject }}"
  role    = "roles/storage.objectViewer"
  member  = resource.google_service_account.default.member
}

# This resource allows anyone with a Broad account to access the service via
# a web browser. If this is too wide a net, a slightly different syntax may be
# appropriate. See "Managing access" in the usage documentation for more
# details.
resource "google_iap_web_cloud_run_service_iam_member" "default" {
  provider               = google-beta
  project                = var.core_project
  location               = var.core_region
  cloud_run_service_name = "${{ values.applicationName }}"
  member                 = "domain:broadinstitute.org"
  role                   = "roles/iap.httpsResourceAccessor"
  depends_on = [
    google_cloud_run_v2_service.default
  ]
}
