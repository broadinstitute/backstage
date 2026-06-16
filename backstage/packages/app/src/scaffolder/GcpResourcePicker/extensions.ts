import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';
import { GcpResourcePicker } from './GcpResourcePicker';
import { GcpResourcePickerSchema } from './schema';

/**
 * Register the field extension with the Scaffolder plugin.
 * Referenced from a template via `ui:field: GcpResourcePicker`.
 *
 * Passing `schema` lets the field appear in the Custom Field Explorer and
 * powers validation/preview in the template editor.
 */
export const GcpResourcePickerExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'GcpResourcePicker',
    component: GcpResourcePicker,
    schema: GcpResourcePickerSchema,
  }),
);
