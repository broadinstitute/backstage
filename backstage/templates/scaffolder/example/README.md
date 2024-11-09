# Example Software Template that does not use placeholders

This example is intended to be used for testing the software template scaffolder. It is a simple template that does not use placeholders.

You can enable the example for local development by adding the following to your `app-config.local.yaml`:

```yaml
    - type: file
      target: ../../templates/scaffolder/example/template.yaml
      rules:
        - allow: [Template]
```
