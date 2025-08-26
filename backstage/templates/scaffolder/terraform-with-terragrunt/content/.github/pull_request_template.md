---

## Write Good Commit Messages

[The seven rules of a great Git commit message](https://cbea.ms/git-commit/)

- Separate subject from body with a blank line
- Limit the subject line to 50 characters
- Capitalize the subject line
- Do not end the subject line with a period
- Use the imperative mood in the subject line
- Wrap the body at 72 characters
- Use the body to explain what and why vs. how

## Update Providers

When updating a provider, run the following command to update the lock file.
This will ensure that the provider is available for all platforms.

```Shell
terraform providers lock \
    -platform=linux_arm64 \
    -platform=linux_amd64 \
    -platform=darwin_amd64 \
    -platform=darwin_arm64 \
    -platform=windows_amd64
```

## Update Docs

When updating docs, run the following command in the directory you want to
update (dev/prod). This will ensure that the docs are available for all
platforms.

```Shell
podman run --rm -u $(id -u) \
    --volume "$(pwd):/terraform-docs" \
    quay.io/terraform-docs/terraform-docs:latest \
    --output-file README.md \
    --output-mode inject \
    /terraform-docs
```
