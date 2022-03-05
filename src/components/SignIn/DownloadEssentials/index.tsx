import React from 'react';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { Typography, Stack, Button } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';

export interface ComponentProps {}

const DownloadEssentials: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack alignItems="center" width={360}>
            <DialogTitleTypo>Download Essentials</DialogTitleTypo>
            <Typography fontSize={16} fontWeight={400} textAlign="center" marginTop={1}>
                Web3.0 super wallet with Decentralized Identifier (DID)
            </Typography>
        </Stack>
    );
};

export default DownloadEssentials;
