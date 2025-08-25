output "service_account_key" {
  sensitive = true
  value     = google_service_account_key.default.private_key
}
