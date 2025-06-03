# Usage

## Requirements

### Install Terraform

This project uses [Terraform][1] to deploy and manage the cloud infrastructure
for [Google Cloud Run][4]. To execute the automation in this repository,
[download and install](https://developer.hashicorp.com/terraform/install)
[Terraform][1] following the instructions appropriate to your workstation
operating system.

BITS also recommends [tfenv][2] for easier management of multiple concurrent
versions of [Terraform][1]. This can be especially useful if you have multiple
[Terraform][1] projects that each have their own specific version requirements.
[tfenv][2] is not required to run anything in this repository.

### Set up a GCP project

Before the automation in this repo can be executed, the GCP project
`${{ values.gcpProject }}` must exist and you must be able to write to it from
your workstation. To create a new project go to the
[project creation page](https://console.cloud.google.com/projectcreate) on the
Google cloud console and fill out the form. You will need a billing account.
Please be aware that virtually all operations in GCP cost money, and cloud bills
can add up quickly.

### Authenticate to GCP

[Terraform][1] is able to automatically pull credentials from a well-configured
local [gcloud][3] CLI to authenticate to GCP. This is the authentication method
recommended by BITS due to its simplicity and security. You can download and
install the [gcloud][3] CLI according to the instructions from Google as
appropriate for your workstation operating system. After installing, run the
following commands and follow the prompts to authenticate:

```Shell
gcloud init
gcloud auth application-default login
```

## Containerize your application

[Google Cloud Run][4] requires the application it deploys to be an
[OCI container image.](https://opencontainers.org/about/overview/) For
instructions on using off-the-shelf images or building your own, refer to the
[BITS introduction to container technology.](https://backstage.broadinstitute.org/docs/default/component/disco-docs/using-containers/)

### Deploy your container image

If you want [Google Cloud Run][4] to deploy a custom image, it will need to
either be in a public repository like Docker Hub, or in a [Google Artifact
Registry][5] repository that your [Google Cloud Run][4] deployment can access.
To deploy an artifact to [Google Artifact Registry][5], navigate to the
directory of your project with the `Containerfile` and run the following
commands:

```Shell
gcloud services --project '${{ values.gcpProject }}' enable cloudbuild.googleapis.com
gcloud builds --project '${{ values.gcpProject }}' submit --tag 'gcr.io/${{ values.gcpProject }}/<image_name>:<tag>' .
```

The second command may take a few minutes, but it will build and deploy the
image to the specified location. You can put that image in [Terraform][1] in
`cloud-run.tf`.

## Execute Terraform

Hashicorp provides
[extensive tutorials](https://developer.hashicorp.com/terraform/tutorials/gcp-get-started/infrastructure-as-code)
and [documentation](https://developer.hashicorp.com/terraform/docs) for those
interested. The automation in this repository, however, requires knowledge of
only three commands. Run from the project root, they are:

```Shell
terraform init
terraform plan -out=planfile
terraform apply planfile
```

After deploying with `terraform apply`, the URL at which your application is
available will be displayed on the console:

```HCL
url = "https://my-app-amhxpwocza-ue.a.run.app"
```

If you need the URL to be under the `broadinstitute.org` domain, reach out to
BITS in the `#team-devnull` channel on Slack.

Absent confounding factors, the above three commands run in order will handle
most infrastructure deployment for [Google Cloud Run][4].

### Confounding factors

This list is a work in progress. Please let BITS know if you hit any issues with
the [Terraform][1] deployment that may be generalizable to other teams.

#### Pre-existing resources

[Terraform][1] expects and requires exclusive control of all cloud resources it
references, and stores their state. If a resource already exists, or it has been
manually modified in some way, you may need to import it into [Terraform][1].
For example, if you have an existing bucket you want to use instead of creating
a new bucket, you may run:

```Shell
terraform import google_storage_bucket.mediawiki_data <bucket-id>
```

#### Managing access

This template manages access control to the [Google Cloud Run][4] application
non-authoritatively. This means that it will not remove access that was granted
via the web console, nor will removing principals from the [Terraform][1]
configuration revoke access. If this becomes inconvenient, you can use the
[authoritative resource](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/iap_web_cloud_run_service_iam).

[1]: https://www.terraform.io/ "Terraform"
[2]: https://github.com/tfutils/tfenv "tfenv"
[3]: https://cloud.google.com/sdk/docs/install "gcloud"
[4]: https://cloud.google.com/run "Google Cloud Run"
[5]: https://cloud.google.com/artifact-registry "Google Artifact Registry"
