output "cloudsql_connection_name" {
  value = google_sql_database_instance.mediawiki.connection_name
}
output "storage_bucket" {
  value = google_storage_bucket.mediawiki.name
}
output "url" {
  value = google_cloud_run_v2_service.mediawiki.uri
}
