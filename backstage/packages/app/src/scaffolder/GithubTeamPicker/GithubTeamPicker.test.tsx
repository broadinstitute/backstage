import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { CatalogApi } from '@backstage/catalog-client';
import { GithubTeamPicker } from './GithubTeamPicker';
import { TestApiProvider } from '@backstage/test-utils';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import {
    ErrorApi,
    IdentityApi,
    errorApiRef,
    identityApiRef,
} from '@backstage/core-plugin-api';
import userEvent from '@testing-library/user-event';
import { ScaffolderRJSFFieldProps as FieldProps } from '@backstage/plugin-scaffolder-react';

const mockIdentityApi: IdentityApi = {
    getProfileInfo: () =>
        Promise.resolve({
            displayName: 'Bob',
            email: 'bob@example.com',
            picture: 'https://example.com/picture.jpg',
        }),
    getBackstageIdentity: () =>
        Promise.resolve({
            id: 'Bob',
            idToken: 'token',
            type: 'user',
            userEntityRef: 'user:default/bob',
            ownershipEntityRefs: [
                'group:default/group1',
                'group:default/group2',
            ],
        }),
    getCredentials: () => Promise.resolve({ token: 'token' }),
    signOut: () => Promise.resolve(),
};

describe('<GithubTeamPicker />', () => {
    let entities: Entity[];
    const onChange = jest.fn();
    const schema = {};
    const required = false;

    const catalogApi: jest.Mocked<CatalogApi> = {
        getEntities: jest.fn(async () => ({ items: entities })),
    } as any;

    const mockErrorApi: jest.Mocked<ErrorApi> = {
        post: jest.fn(),
        error$: jest.fn(),
    };

    beforeEach(() => {
        entities = [
            {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Group',
                metadata: { name: 'group1' },
                spec: { members: ['Bob'] },
            },
            {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Group',
                metadata: { name: 'group2' },
                spec: { members: ['Bob'] },
            },
            {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Group',
                metadata: { name: 'group3' },
                spec: { members: ['Alice'] },
            },
        ];

        onChange.mockClear();
        catalogApi.getEntities.mockClear();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should only return teams the user is a member of', async () => {
        const teams = entities.filter(
            entity =>
                entity.spec &&
                Array.isArray(entity.spec.members) &&
                entity.spec.members.includes('Bob'),
        );

        catalogApi.getEntities.mockResolvedValue({ items: teams });
        const props = {
            onChange,
            schema,
            required,
        } as unknown as FieldProps<string>;

        const containerRef = React.createRef<HTMLDivElement>();

        render(
            <div ref={containerRef}>
                <TestApiProvider
                    apis={[
                        [identityApiRef, mockIdentityApi],
                        [catalogApiRef, catalogApi],
                        [errorApiRef, mockErrorApi],
                    ]}
                >
                    <GithubTeamPicker {...props} />
                </TestApiProvider>
            </div>,
        );

        await waitFor(() =>
            expect(catalogApi.getEntities).toHaveBeenCalledTimes(1),
        );

        expect(catalogApi.getEntities).toHaveBeenCalledWith({
            filter: {
                kind: 'Group',
                'relations.hasMember': ['user:default/bob'],
            },
        });

        await expect(
            catalogApi.getEntities.mock.results[0].value,
        ).resolves.toEqual({
            items: [
                {
                    apiVersion: 'backstage.io/v1alpha1',
                    kind: 'Group',
                    metadata: { name: 'group1' },
                    spec: { members: ['Bob'] },
                },
                {
                    apiVersion: 'backstage.io/v1alpha1',
                    kind: 'Group',
                    metadata: { name: 'group2' },
                    spec: { members: ['Bob'] },
                },
            ],
        });

        await expect(
            catalogApi.getEntities.mock.results[0].value,
        ).resolves.not.toEqual(
            expect.objectContaining({
                items: expect.arrayContaining([
                    expect.objectContaining({
                        metadata: { name: 'group3' },
                    }),
                ]),
            }),
        );
    });

    it('should display the github teams the user is a part of', async () => {
        const userTeams = entities.filter(
            entity =>
                entity.spec &&
                Array.isArray(entity.spec.members) &&
                entity.spec.members.includes('Bob'),
        );

        catalogApi.getEntities.mockResolvedValue({ items: userTeams });

        const props = {
            onChange,
            schema,
            required,
        } as unknown as FieldProps<string>;

        const { queryByText, getByRole } = render(
            <TestApiProvider
                apis={[
                    [identityApiRef, mockIdentityApi],
                    [catalogApiRef, catalogApi],
                    [errorApiRef, mockErrorApi],
                ]}
            >
                <GithubTeamPicker {...props} />
            </TestApiProvider>,
        );

        await waitFor(() =>
            expect(catalogApi.getEntities).toHaveBeenCalledTimes(1),
        );

        const inputField = getByRole('combobox');
        await userEvent.click(inputField);
        await userEvent.type(inputField, 'group');

        await waitFor(() => {
            const group1Elem = queryByText('group1');
            const group2Elem = queryByText('group2');
            expect(group1Elem).toBeInTheDocument();
            expect(group2Elem).toBeInTheDocument();
        });
    });
});
