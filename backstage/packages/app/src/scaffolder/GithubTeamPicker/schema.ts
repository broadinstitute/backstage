import { z } from 'zod';
import { makeFieldSchemaFromZod } from '@backstage/plugin-scaffolder';
import { makeFieldSchema } from '@backstage/plugin-scaffolder-react';

const output = (zImpl: typeof z) => zImpl.string().min(1);
const uiOptions = (zImpl: typeof z) => zImpl.object({
  placeholder: zImpl.string().optional(),
});
export const GithubTeamPickerFieldSchema = makeFieldSchema({
  output,
  uiOptions,
}
);

/**
 * UI options for the Github Team Picker.
 * @public
 */

export type GithubTeamPickerUiOptions =
  typeof GithubTeamPickerFieldSchema.uiOptionsType;

/**
 * Props for the GithubTeamPicker.
 * @public
 */

export type GithubTeamPickerProps = typeof GithubTeamPickerFieldSchema.type;

/**
 * Schema for the GithubTeamPicker.
 * @public
 */

export const GithubTeamPickerSchema = GithubTeamPickerFieldSchema.schema;
