resource "google_project_service" "api_services" {
  for_each = toset(var.api_services)

  disable_dependent_services = false
  disable_on_destroy         = false
  project                    = var.core_project
  service                    = each.key
}
