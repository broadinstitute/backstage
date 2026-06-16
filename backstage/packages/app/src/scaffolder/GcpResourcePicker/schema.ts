import { z } from 'zod/v3';
import { makeFieldSchema } from '@backstage/plugin-scaffolder-react';

/**
 * Schema for the GcpResourcePicker field extension. Generating it via
 * `makeFieldSchema` produces both the JSON schema (consumed by the Custom
 * Field Explorer / template editor preview) and the matching TypeScript
 * types, so the two never drift apart.
 *
 * @see https://backstage.io/docs/features/software-templates/writing-custom-field-extensions/#previewing-custom-field-extensions
 */
const output = (zImpl: typeof z) => zImpl.string();

const uiOptions = (zImpl: typeof z) =>
  zImpl.object({
    resourceType: zImpl
      .enum(['project', 'folder'])
      .optional()
      .describe('Which kind of GCP resource to pick. Defaults to "project".'),
    outputFormat: zImpl
      .enum(['id', 'resourceName'])
      .optional()
      .describe(
        'Shape of the value written to the template. "id" (default) emits the short id (e.g. my-project-123 / 123456789); "resourceName" emits the canonical resource name (e.g. projects/415104041262 / folders/123456789).',
      ),
    parent: zImpl
      .string()
      .optional()
      .describe(
        'Optional parent to scope a folder search to, e.g. "folders/123" or "organizations/456". Ignored for project searches.',
      ),
    scopes: zImpl
      .array(zImpl.string())
      .optional()
      .describe(
        'Override the requested Google OAuth scopes used to acquire the user access token.',
      ),
    pageSize: zImpl
      .number()
      .optional()
      .describe('Override the number of results requested per search.'),
  });

export const GcpResourcePickerFieldSchema = makeFieldSchema({
  output,
  uiOptions,
});

/**
 * UI options for the GcpResourcePicker.
 * @public
 */
export type GcpResourcePickerUiOptions =
  typeof GcpResourcePickerFieldSchema.uiOptionsType;

/**
 * Props for the GcpResourcePicker.
 * @public
 */
export type GcpResourcePickerProps = typeof GcpResourcePickerFieldSchema.type;

/**
 * JSON schema for the GcpResourcePicker. Passed to
 * `createScaffolderFieldExtension` so the field appears in the Custom Field
 * Explorer.
 * @public
 */
export const GcpResourcePickerSchema = GcpResourcePickerFieldSchema.schema;
