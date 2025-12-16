# https://www.terraform.io/docs/configuration/variables.html#variable-definitions-tfvars-files
# Terraform automatically loads variable definition from this file.
# Use this file to override variable defaults set in variables.tf
# ex. foo = "bar"

core_project  = "bits-backstage-dev"
env           = "dev"
gke_project   = "bits-gke-clusters"
namespace     = "backstage-dev"
cloudsql_tier = "db-custom-2-4096"

google_secret_manager_secrets = {
  github-app-backstage-bits-credentials = {
    service = "github"
    type    = "yaml-file"
  },
  auth-github-client-id = {
    service = "github"
    type    = "string"
  },
  auth-github-client-secret = {
    service = "github"
    type    = "string"
  },
  auth-google-client-id = {
    service = "google"
    type    = "string"
  },
  auth-google-client-secret = {
    service = "google"
    type    = "string"
  },
  pagerduty-client-id = {
    service = "pagerduty"
    type    = "string"
  },
  pagerduty-client-secret = {
    service = "pagerduty"
    type    = "string"
  },
  backstage-insights-token = {
    service = "backstage-insights-plugin"
    type    = "string"
  },
  backstage-license-key = {
    service = "backstage"
    type    = "string"
  },
  backstage-skills-slack-bot-token = {
    service = "backstage"
    type    = "string"
  },
  backstage-skills-slack-app-token = {
    service = "backstage"
    type    = "string"
  },
  backstage-skills-slack-signing-secret = {
    service = "backstage"
    type    = "string"
  },
  backstage-soundcheck-slack-bot-token = {
    service = "backstage"
    type    = "string"
  },
  backstage-soundcheck-slack-app-token = {
    service = "backstage"
    type    = "string"
  },
  backstage-soundcheck-slack-signing-secret = {
    service = "backstage"
    type    = "string"
  },
  backstage-soundcheck-http-collector-token = {
    service = "backstage"
    type    = "string"
  },
}

additional_databases = [
  { name      = "backstage_plugin_app",
    charset   = "",
    collation = "",
  },
  { name      = "backstage_plugin_auth",
    charset   = "",
    collation = "",
  },
  { name      = "backstage_plugin_catalog",
    charset   = "",
    collation = "",
  },
  { name      = "backstage_plugin_scaffolder",
    charset   = "",
    collation = "",
  },
  { name      = "backstage_plugin_search",
    charset   = "",
    collation = "",
  },
  { name      = "backstage_plugin_proxy",
    charset   = "",
    collation = "",
  },
  { name      = "backstage_plugin_techdocs",
    charset   = "",
    collation = "",
  },
  { name      = "backstage_plugin_permission",
    charset   = "",
    collation = "",
  },
  {
    name      = "backstage_plugin_kubernetes",
    charset   = "",
    collation = "",
  },
  {
    name      = "backstage_plugin_pagerduty",
    charset   = "",
    collation = "",
  },
  {
    name      = "backstage_plugin_backstage-insights"
    charset   = ""
    collation = ""
  },
  {
    name      = "backstage_plugin_skill-exchange"
    charset   = ""
    collation = ""
  },
  {
    name      = "backstage_plugin_tech-radar"
    charset   = ""
    collation = ""
  },
  {
    name      = "backstage_plugin_soundcheck"
    charset   = ""
    collation = ""

  },
  {
    name      = "backstage_plugin_rbac"
    charset   = ""
    collation = ""
  },
  {
    name      = "backstage_plugin_copilot"
    charset   = ""
    collation = ""
  },
]

database_flags = [
  {
    name  = "cloudsql.iam_authentication"
    value = "on"
  },
  {
    name  = "max_connections"
    value = "200"
  },
]
