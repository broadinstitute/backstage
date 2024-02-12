resource "google_project_iam_member" "team_access" {
  project = var.core_project
  role    = "roles/editor"
  member  = "group:devnull@broadinstitute.org"
}

resource "google_project_iam_member" "sa_access" {
  project = var.core_project
  role    = "roles/owner"
  member  = "group:devnull-sa@broadinstitute.org"
}
