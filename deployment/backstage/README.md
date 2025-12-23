# backstage

## Description

Install and Configure Backstage on GKE Clusters

## Usage

### Fetch the package

`kpt pkg get REPO_URI[.git]/PKG_PATH[@VERSION] backstage` Details:
https://kpt.dev/reference/cli/pkg/get/

### View package content

`kpt pkg tree backstage` Details: https://kpt.dev/reference/cli/pkg/tree/

### Apply the package

```Shell
kpt live init backstage
kpt live apply backstage --reconcile-timeout=2m --output=table
```

Details: https://kpt.dev/reference/cli/live/
