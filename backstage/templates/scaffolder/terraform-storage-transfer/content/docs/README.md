# ${{ values.name }}

${{ values.description }}

The rendered documentation is hosted
[here.](https://backstage.broadinstitute.org/docs/default/Component/${{values.name}})

## Markdown

Start write your documentation by adding more markdown (`.md`) files to this
directory or replace the content in this file. For more info see
[the TechDocs Techdocs](https://backstage.io/docs/features/techdocs/) and
[TechDocs at Broad.](https://backstage.broadinstitute.org/catalog/default/component/backstage/docs/techdocs/)
For more information on how to write beautiful markdown, see the
[common mark spec](https://spec.commonmark.org) or try things out in
[the dingus.](https://spec.commonmark.org/dingus/)

## Table of Contents

The Table of Contents on the right is generated automatically based on the
hierarchy of headings. Only use one H1 (`#` in Markdown) per file.

## Site navigation

For new pages to appear in the left hand navigation you need edit the
`mkdocs.yml` file in root of your repo. The navigation can also link out to
other sites.

Alternatively, if there is no `nav` section in `mkdocs.yml`, a navigation
section will be created for you. However, you will not be able to use alternate
titles for pages, or include links to other sites.

Note that MkDocs uses `mkdocs.yml`, not `mkdocs.yaml`, although both appear to
work. See also <https://www.mkdocs.org/user-guide/configuration/>.

## Support

Techdocs is a third-party tool. While BITS encourages maintaining documentation
about your project, and suggests Techdocs as a means for doing so, we are unable
to provide technical support regarding its use. If something in this document is
incorrect or out of date, please file a ticket. For more direct support, please
reach out in
[#docs-like-code](https://discord.com/channels/687207715902193673/714754240933003266)
on Discord.
