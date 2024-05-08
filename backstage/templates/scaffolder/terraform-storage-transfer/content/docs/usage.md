# Usage

## Requirements

### Install Terraform

This project uses [Terraform](https://www.terraform.io/) to deploy
and manage the cloud infrastructure for Google Cloud Storage Transfer Service.
To execute the automation in this repository,
[download and install](https://developer.hashicorp.com/terraform/install)
Terraform following the instructions appropriate to your workstation operating
system.

BITS also recommends [`tfenv`](https://github.com/tfutils/tfenv) for easier
management of multiple concurrent versions of Terraform. This can be especially
useful if you have multiple Terraform projects that each have their own
specific version requirements. `tfenv` is not required to run anything in this
repository.

### Set up a GCP project

Before the automation in this repo can be executed, the GCP project
`${{ values.gcpProject }}` must exist and you must be able to write to it from
your workstation. To create a new project go to the
[project creation page](https://console.cloud.google.com/projectcreate) on the
Google cloud console and fill out the form. You will need a billing account.
Please be aware that virtually all operations in GCP cost money, and cloud
bills can add up quickly.

### Authenticate to GCP

Terraform is able to automatically pull credentials from a well-configured
local `gcloud` CLI to authenticate to GCP. This is the authentication method
recommended by BITS due to its simplicity and security. You can
[download and install the `gcloud` CLI](https://cloud.google.com/sdk/docs/install)
according to the instructions from Google as appropriate for your workstation
operating system. After installing, run the following commands and follow the
prompts to authenticate:

```sh
gcloud init
gcloud auth application-default login
```

## Execute Terraform

Hashicorp provides
[extensive tutorials](https://developer.hashicorp.com/terraform/tutorials/gcp-get-started/infrastructure-as-code)
and [documentation](https://developer.hashicorp.com/terraform/docs) for those
interested. The automation in this repository, however, requires knowledge of
only three commands. Run from the project root, they are:

```sh
terraform -chdir=prod init
terraform -chdir=prod plan
terraform -chdir=prod apply
```

Absent confounding factors, the above three commands run in order will
completely handle all cloud infrastructure deployment for Google Cloud Storage
Transfer Service.

### Confounding factors

This list is a work in progress. Please let BITS know if you hit
any issues with the Terraform deployment that may be generalizable to other
teams.

#### Pre-existing resources

Terraform expects and requires exclusive control of all cloud resources it
references, and stores their state. If a resource already exists, or it has
been manually modified in some way, you may need to import it into Terraform.
For example, if you have an existing bucket you want to use instead of creating
a new bucket, you may run:

```
terraform -chdir=prod import google_storage_bucket.default <bucket-id>
```

## Set up the agent

In order for Google Cloud Storage Transfer Service to upload from outside GCP,
it relies on the installation and execution of an agent on the remote system.

### System requirements

In order to install and run the agent, the user on the host system must have:

* podman installed
* memlock ulimit set to "unlimited", or a value greater than 64Gb
* A reasonable allotment of subuids and subgids. This template was tested with
  2 ** 16.
* Access to space on the local filesystem for storing containers.
* Access to the desired content for upload (doesn't need to be local).

### Credentials

The Terraform automation will set up a service account, assign correct
permissions to it, and generate a key. This key will need to be deployed to the
host server. To access this key, run the following command:

```
terraform -chdir=prod output service_account_key | base64 -d - > secret.json
```

*Caution:* Anyone with access to this key will be able to upload arbitrary
types and amounts of data into your bucket. Once the secret is deployed to the
server, please delete it from your local machine to prevent accidental
mishandling.

### Run the agent

The agent is a container and can be downloaded and run with podman. The command
to do so is:

```
podman run \
    --ulimit memlock=64000000 \
    --detatch \
    --rm \
    --volume /local/transfer/logs:/logs \
    --volume ${{ values.sourceDirectory }}:${{ values.sourceDirectory }} \
    --volume /local/transfer/key.json:/transfer_root/key.json \
    gcr.io/cloud-ingest/tsop-agent:latest \
        --creds-file=/transfer_root/key.json \
        --hostname="$(hostname)" \
        --agent-pool=default-pool \
        --project-id="${{ values.gcpProject }}" \
        --log-dir=/logs
```

podman will run this in the background, but it will not persist across reboots.
If rerunning this command on a quarterly basis is onerous, BITS suggests
automating the above command with
[`cron`.](https://www.man7.org/linux/man-pages/man5/crontab.5.html)

## Optimization

This template sets up a minimal working transfer service, but there are many
ways to enhance performance. See
[Google's recommendations](https://cloud.google.com/storage-transfer/docs/on-prem-agent-best-practices)
for a variety of ways to improve this setup if you don't find it meets your
specifications.
