output "service_account_key" {
  value     = google_service_account_key.default.private_key
  sensitive = true
}
