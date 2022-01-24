import React from 'react';
import { Stack } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';

export interface ComponentProps {}

const EditPopularItem: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Edit Popular Item</DialogTitleTypo>
            </Stack>
            <Stack spacing={3}>
                <CustomTextField title="Project ID" placeholder="Enter Project ID" />
                <CustomTextField title="Sort" />
            </Stack>
            <Stack direction="row" spacing={2}>
                <SecondaryButton fullWidth>Back</SecondaryButton>
                <PrimaryButton fullWidth>Confirm</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default EditPopularItem;
