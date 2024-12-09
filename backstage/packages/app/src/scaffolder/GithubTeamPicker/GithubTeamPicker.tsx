import { Entity } from '@backstage/catalog-model';
import {
  useApi,
  identityApiRef,
  errorApiRef,
} from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  humanizeEntityRef,
} from '@backstage/plugin-catalog-react';
import { TextField, FormControl } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';
import { GithubTeamPickerProps } from './schema';

export const GithubTeamPicker = (props: GithubTeamPickerProps) => {
  const {
    schema: { title, description },
    required,
    rawErrors,
    onChange,
  } = props;

  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);
  const errorApi = useApi(errorApiRef);
  const [teams, setTeams] = useState<
    {
      label: string;
      ref: string;
    }[]
  >([]);
  const [selectedTeam, setSelectedTeam] = useState<null | {
    label: string;
    ref: string;
  }>(null);

  useAsync(async () => {
    const { userEntityRef } = await identityApi.getBackstageIdentity();

    if (!userEntityRef) {
      errorApi.post(new Error('No user entity ref found'));
      return;
    }

    const { items } = await catalogApi.getEntities({
      filter: {
        kind: 'Group',
        ['relations.hasMember']: [userEntityRef],
      },
    });

    const githubTeams = items
      .filter((e): e is Entity => Boolean(e))
      .map(team => ({
        label: team.metadata.title ?? team.metadata.name,
        ref: humanizeEntityRef(team, {
          defaultKind: 'Group',
          defaultNamespace: 'default',
        }),
      }));

    setTeams(githubTeams);
  });

  const updateChange = (
    _: React.ChangeEvent<{}>,
    value: { label: string; ref: string } | null,
  ) => {
    setSelectedTeam(value);
    onChange(value?.ref ?? '');
  };

  return (
    <FormControl margin="normal" required error={rawErrors?.length > 0}>
      <Autocomplete
        id="GithubTeamPicker"
        options={teams || []}
        value={selectedTeam}
        onChange={updateChange}
        getOptionLabel={team => team.label}
        renderInput={params => (
          <TextField
            {...params}
            label={title}
            margin="dense"
            required={required}
            helperText={description}
            variant="outlined"
            FormHelperTextProps={{ margin: 'dense', style: { marginLeft: 0 } }}
          />
        )}
      />
    </FormControl>
  );
};

export const GithubTeamPickerExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'GithubTeamPicker',
    component: GithubTeamPicker,
  }),
);
