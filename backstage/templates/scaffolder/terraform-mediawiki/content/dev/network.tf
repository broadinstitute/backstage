resource "google_compute_region_network_endpoint_group" "mediawiki" {
  name                  = "mediawiki-lb-neg"
  network_endpoint_type = "SERVERLESS"
  region                  = var.core_region

  cloud_run {
    service = google_cloud_run_v2_service.mediawiki.name
  }
}

module "lb-mediawiki-http" {
  source            = "GoogleCloudPlatform/lb-http/google//modules/serverless_negs"
  version           = "12.1.4"

  https_redirect                  = true
  managed_ssl_certificate_domains = ["${{ values.applicationDomain }}"]
  name                            = "mediawiki-http-lb"
  project                         = var.core_project
  ssl                             = true

  backends = {
    default = {
      enable_cdn = false
      protocol   = "HTTP"

      groups = [
        {
          group = google_compute_region_network_endpoint_group.mediawiki.id
        }
      ]
      iap_config = {
        enable = false
      }
      log_config = {
        enable      = true
        sample_rate = 1.0
      }
    }
  }
}
