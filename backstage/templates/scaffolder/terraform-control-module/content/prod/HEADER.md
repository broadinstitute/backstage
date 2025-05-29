# terraform repo for ${{ values.name }}

Terraform Repo for ${{ values.name }}

[Terraform Docs](https://terraform-docs.io/) created by running:

```Shell
podman run --rm -u $(id -u) \
    --volume "$(pwd):/terraform-docs" \
    quay.io/terraform-docs/terraform-docs:latest \
    --output-file README.md \
    --output-mode inject \
    /terraform-docs
```

Remember update the dependency lock file for different architectures:

```Shell
terraform providers lock \
    -platform=darwin_amd64 \
    -platform=darwin_arm64 \
    -platform=linux_amd64 \
    -platform=linux_arm64 \
    -platform=windows_amd64
```
