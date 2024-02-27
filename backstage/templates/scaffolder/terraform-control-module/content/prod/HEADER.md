# terraform repo for ${{ values.name }}
Terraform Repo for ${{ values.name }}

[Terraform Docs](https://terraform-docs.io/) created by running:

```Shell
docker run --rm --volume "$(pwd):/terraform-docs" -u $(id -u) quay.io/terraform-docs/terraform-docs:latest --output-file README.md --output-mode inject /terraform-docs
```

Remember update the dependency lock file for different architectures:

```Shell
terraform providers lock -platform=linux_amd64 -platform=darwin_amd64 -platform=darwin_arm64 -platform=windows_amd64
```
