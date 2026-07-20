import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';
import { GcpBillingAccountPicker } from './GcpBillingAccountPicker';
import { GcpBillingAccountPickerSchema } from './schema';

/**
 * Register the field extension with the Scaffolder plugin.
 * Referenced from a template via `ui:field: GcpBillingAccountPicker`.
 *
 * Passing `schema` lets the field appear in the Custom Field Explorer and
 * powers validation/preview in the template editor.
 */
export const GcpBillingAccountPickerExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'GcpBillingAccountPicker',
    component: GcpBillingAccountPicker,
    schema: GcpBillingAccountPickerSchema,
  }),
);
