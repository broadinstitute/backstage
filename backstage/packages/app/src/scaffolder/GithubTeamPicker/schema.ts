import { z } from 'zod';
import { makeFieldSchemaFromZod } from '@backstage/plugin-scaffolder';

export const GithubTeamPickerFieldSchema = makeFieldSchemaFromZod(
  z.string(),
  z.object({
    title: z.string().default('Github Team').describe('Github Team'),
    desciption: z
      .string()
      .default('Select a Github Team')
      .describe('Select a Github Team'),
  }),
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
