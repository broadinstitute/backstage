import { z } from 'zod/v3';
import { makeFieldSchema } from '@backstage/plugin-scaffolder-react';

/**
 * Schema for the GcpBillingAccountPicker field extension. Generating it via
 * `makeFieldSchema` produces both the JSON schema (consumed by the Custom
 * Field Explorer / template editor preview) and the matching TypeScript
 * types, so the two never drift apart.
 *
 * @see https://backstage.io/docs/features/software-templates/writing-custom-field-extensions/#previewing-custom-field-extensions
 */
const output = (zImpl: typeof z) => zImpl.string();

const uiOptions = (zImpl: typeof z) =>
  zImpl.object({
    outputFormat: zImpl
      .enum(['id', 'resourceName'])
      .optional()
      .describe(
        'Shape of the value written to the template. "id" (default) emits the short billing account id (e.g. 013939-8DE5F0-6BF33F); "resourceName" emits the canonical resource name (e.g. billingAccounts/013939-8DE5F0-6BF33F).',
      ),
    openOnly: zImpl
      .boolean()
      .optional()
      .describe(
        'When true, only list billing accounts that are still open (excludes closed/disabled accounts). Defaults to false.',
      ),
    parent: zImpl
      .string()
      .optional()
      .describe(
        'Optional parent billing account to scope the list to its sub-accounts, e.g. "billingAccounts/013939-8DE5F0-6BF33F". Omit to list top-level accounts the user has access to.',
      ),
    scopes: zImpl
      .array(zImpl.string())
      .optional()
      .describe(
        'Override the requested Google OAuth scopes used to acquire the user access token.',
      ),
  });

export const GcpBillingAccountPickerFieldSchema = makeFieldSchema({
  output,
  uiOptions,
});

/**
 * UI options for the GcpBillingAccountPicker.
 * @public
 */
export type GcpBillingAccountPickerUiOptions =
  typeof GcpBillingAccountPickerFieldSchema.uiOptionsType;

/**
 * Props for the GcpBillingAccountPicker.
 * @public
 */
export type GcpBillingAccountPickerProps =
  typeof GcpBillingAccountPickerFieldSchema.type;

/**
 * JSON schema for the GcpBillingAccountPicker. Passed to
 * `createScaffolderFieldExtension` so the field appears in the Custom Field
 * Explorer.
 * @public
 */
export const GcpBillingAccountPickerSchema =
  GcpBillingAccountPickerFieldSchema.schema;
