# The main block that manages the cloud run services. The application will not
# be redeployed when running `terraform apply` unless something in this resource
# has changed.
resource "google_cloud_run_v2_service" "mediawiki" {
  # BEWARE: If iap_enabled is false while invoker_iam_disabled is true, the
  # service will be completely open to the internet.
  iap_enabled          = false  # Intentionally set to false to allow public access
  invoker_iam_disabled = false  # Intentionally set to false to allow public access
  launch_stage         = "GA"
  location             = var.core_region
  name                 = "mediawiki"
  project              = var.core_project
  provider             = google-beta

  template {
    service_account = google_service_account.mediawiki.email

    containers {
      command = ["bash"]
      args = [
        "-c",
        "rm -f /var/www/html/LocalSettings.php && ln -s ${{ values.applicationVolumePath }}/LocalSettings.php /var/www/html/LocalSettings.php && rm -rf /var/www/html/images && ln -s ${{ values.applicationVolumePath }}/images /var/www/html/images && apache2-foreground",
      ]

      image = "docker.io/library/mediawiki:${{ values.applicationImageTag }}"
      ports {
        container_port = "${{ values.applicationPort }}"
      }
      volume_mounts {
        mount_path = "${{ values.applicationVolumePath }}"
        name       = "site-bucket"
      }
      volume_mounts {
        mount_path = "/cloudsql"
        name       = "cloudsql"
      }
    }
    scaling {
      max_instance_count = ${{ values.applicationMaxInstances }}
    }
    volumes {
      name = "site-bucket"

      gcs {
        bucket    = google_storage_bucket.mediawiki_data.name
        read_only = false
      }
    }
    volumes {
      name = "cloudsql"

      cloud_sql_instance {
        instances = [google_sql_database_instance.mediawiki.connection_name]
      }
    }
  }

  depends_on = [
    time_sleep.wait_for_iam
  ]
}

# By default, we will use Cloud Run domain mapping to map the service to
# domains specified in the `web_domains` variable. This will automatically
# create a load balancer for you, so you do not need to create one manually.
# If you need the added flexibility of using a Google load balancer, you can
# comment out this domain mapping resource and uncomment the resources in the
# network.tf file.
resource "google_cloud_run_domain_mapping" "mediawiki" {
  for_each = toset(var.web_domains)

  location = var.core_region
  name     = each.value

  metadata {
    namespace = var.core_project
  }

  spec {
    route_name = google_cloud_run_v2_service.mediawiki.name
  }
}

# Deploying the cloud run service too quickly after service account creation
# fails cryptically. A redeploy fixes it but that's tedious -- sleeping a couple
# minutes results in a clear run the first time. Since terraform stores state,
# this sleep should not apply on any run except the very first unless you
# intentionally taint it.
resource "time_sleep" "wait_for_iam" {
  create_duration = "180s"

  depends_on = [
    google_service_account.mediawiki
  ]
}

# This resource allows anyone with a Broad account to access the service via
# a web browser. If this is too wide a net, a slightly different syntax may be
# appropriate. See "Managing access" in the usage documentation for more
# details.
# resource "google_iap_web_cloud_run_service_iam_member" "mediawiki" {
#  provider               = google-beta
#  project                = var.core_project
#  location               = var.core_region
#  cloud_run_service_name = "mediawiki"
#  member                 = "domain:broadinstitute.org"
#  role                   = "roles/iap.httpsResourceAccessor"

#  depends_on = [
#    google_cloud_run_v2_service.mediawiki
#  ]
# }
