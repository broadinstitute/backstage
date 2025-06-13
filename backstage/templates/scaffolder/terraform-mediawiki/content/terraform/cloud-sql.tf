resource "random_id" "db_name_suffix" {
  byte_length = 4
}

resource "random_id" "db_user_password" {
  byte_length = 12
}

resource "google_sql_database_instance" "mediawiki" {
  database_version = "MYSQL_8_0"
  name             = "${{ values.name }}-mediawiki-${random_id.db_name_suffix.hex}"
  region           = var.core_region

  settings {
    tier = "${{ values.gcsCloudSQLSize }}"

    backup_configuration {
      enabled = true
      backup_retention_settings {
        retention_unit   = "COUNT"
        retained_backups = 7
      }
    }

    ip_configuration {
      ssl_mode = "ENCRYPTED_ONLY"
    }
  }
}

resource "google_sql_database" "mediawiki" {
  name     = "mediawiki"
  instance = google_sql_database_instance.mediawiki.name
}

resource "google_sql_user" "mediawiki" {
  instance    = google_sql_database_instance.mediawiki.name
  name        = "mediawiki"
  password_wo = random_id.db_user_password.hex
}

resource "google_project_iam_member" "mediawiki_cloudsql" {
  member  = google_service_account.mediawiki.member
  project = var.core_project
  role    = "roles/cloudsql.client"

  depends_on = [
    google_service_account.mediawiki
  ]
}
