## Terraform Docs

[Terraform Docs](https://terraform-docs.io/) created by running the following
from the root of the repository:

```shell
podman run --rm -u $(id -u) \
    --volume "$(pwd):/terraform-docs" \
    -w /terraform-docs \
    quay.io/terraform-docs/terraform-docs:latest \
    --output-file /terraform-docs/deployment/prod/terraform/README.md \
    --output-mode inject /terraform-docs/deployment/prod/terraform
```

Remember update the dependency lock file for different architectures:

```shell
terraform providers lock \
    -platform=linux_amd64 \
    -platform=linux_arm64 \
    -platform=darwin_amd64 \
    -platform=darwin_arm64 \
    -platform=windows_amd64
```
