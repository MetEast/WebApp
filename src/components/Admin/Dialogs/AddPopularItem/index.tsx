import React from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {}

const AddPopularItem: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Add Popular Item</DialogTitleTypo>
            </Stack>
        </Stack>
    );
};

export default AddPopularItem;
