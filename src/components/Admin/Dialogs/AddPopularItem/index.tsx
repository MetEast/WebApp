import React from 'react';
import { Stack } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import SearchTextField from '../components/SearchTextField';
import CustomTextField from 'src/components/TextField';

export interface ComponentProps {}

const AddPopularItem: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Add Popular Item</DialogTitleTypo>
            </Stack>
            <Stack spacing={3}>
                <SearchTextField title="Normal NFTs" placeholder="Search NFT" />
                <SearchTextField title="Mystery Boxes" placeholder="Search Mystery Box" />
                <CustomTextField title="Sort" />
            </Stack>
            <Stack direction="row" spacing={2}>
                <SecondaryButton fullWidth>Back</SecondaryButton>
                <PrimaryButton fullWidth>Confirm</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default AddPopularItem;
