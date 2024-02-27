# TechDocs

In Backstage, TechDocs is a plugin that provides a documentation platform for your projects. It allows you to create, manage, and publish documentation for your codebase. TechDocs integrates with your project's source code repository and automatically generates documentation based on your code and configuration.

With TechDocs, you can write documentation in Markdown format, which is a lightweight markup language that is easy to read and write. Markdown allows you to add formatting, headings, lists, code snippets, and more to your documentation.

The TechDocs plugin in Backstage provides a user-friendly interface for managing your documentation. It allows you to organize your documentation into categories and pages, making it easy to navigate and find the information you need. You can also search for specific content within your documentation.

TechDocs also supports versioning, allowing you to maintain multiple versions of your documentation. This is particularly useful when you have different versions of your codebase and need to document changes and updates for each version.

In addition to the documentation platform, TechDocs also provides integration with other Backstage plugins. For example, you can link your documentation to specific components or services in your project, making it easy to access relevant documentation while working on specific parts of your codebase.

Overall, TechDocs in Backstage is a powerful tool for creating and managing documentation for your JavaScript projects. It helps you keep your documentation up-to-date, organized, and easily accessible to your team members and users.

## Writing TechDocs

To write documentation in TechDocs, you can use Markdown format. Markdown is a lightweight markup language that is easy to read and write. It allows you to add formatting, headings, lists, code snippets, and more to your documentation.

You will need to annotate your `catalog-info.yaml` file with the `techdocs` annotations to enable TechDocs for your project by adding this to the annotations section of your `catalog-info.yaml` file:

```yaml
backstage.io/techdocs-ref: dir:.
```

You will need to create a mkdocs.yml file in the root of your project to configure your documentation. This file allows you to specify the structure of your documentation, including the pages, categories, and other settings.

Here is an example of a mkdocs.yml file:

```yaml
site_name: 'BITS Backstage Documentation'

nav:
  - Home: index.md
  - catalog: catalog.md
  - kubernetes: kubernetes.md
  - techdocs: techdocs.md
  - plugins: plugins.md
  - ADRs: adr/README.md

plugins:
  - techdocs-core
```

### Test Your Docs locally

To test your documentation locally, you can use the `techdocs-cli` tool. This tool allows you to build and serve your documentation locally, so you can preview it before publishing it to your project's TechDocs site. You can also run this container `docker run -w /content -v $(pwd):/content -p 8000:8000 -it spotify/techdocs serve -a 0.0.0.0:8000` to serve your documentation locally.
