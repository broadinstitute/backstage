# If you need the added flexibilitiy of using a Google load balancer, you can
# uncommment the following resources. This will create a serverless NEG that
# points to the Cloud Run service, and a load balancer that uses that NEG as a
# backend. Note that this is not necessary if you are using the Cloud Run
# domain mapping, as that will automatically create a load balancer for you.

# resource "google_compute_region_network_endpoint_group" "mediawiki" {
#   name                  = "mediawiki-lb-neg"
#   network_endpoint_type = "SERVERLESS"
#   region                  = var.core_region

#   cloud_run {
#     service = google_cloud_run_v2_service.mediawiki.name
#   }
# }

# module "lb-mediawiki-http" {
#   source            = "GoogleCloudPlatform/lb-http/google//modules/serverless_negs"
#   version           = "12.1.4"

#   https_redirect                  = true
#   managed_ssl_certificate_domains = var.web_domains
#   name                            = "mediawiki-http-lb"
#   project                         = var.core_project
#   ssl                             = true

#   backends = {
#     default = {
#       enable_cdn = false
#       protocol   = "HTTP"

#       groups = [
#         {
#           group = google_compute_region_network_endpoint_group.mediawiki.id
#         }
#       ]
#       iap_config = {
#         enable = false
#       }
#       log_config = {
#         enable      = true
#         sample_rate = 1.0
#       }
#     }
#   }
# }
