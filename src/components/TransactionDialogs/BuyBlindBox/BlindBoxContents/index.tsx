import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';

export interface ComponentProps {}

const BlindBoxContents: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={3} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Blind Box Contents</DialogTitleTypo>
            </Stack>
            <Stack alignItems="center">
                <PageNumberTypo>1 of 7</PageNumberTypo>
                <Box borderRadius={4} overflow="hidden">
                    <img src="/assets/images/blindbox/blindbox-nft-template2.png" alt="" />
                </Box>
                <Typography fontSize={18} fontWeight={700} marginTop={2}>
                    Project Title
                </Typography>
                <Typography fontSize={14} fontWeight={400}>
                    created by Nickname
                </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
                <SecondaryButton fullWidth>Previous</SecondaryButton>
                <PrimaryButton fullWidth>Next</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default BlindBoxContents;
