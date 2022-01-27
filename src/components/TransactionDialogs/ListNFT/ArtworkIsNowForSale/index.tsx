import React from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';

export interface ComponentProps {
    txHash: string;
}

const ArtworkIsNowForSale: React.FC<ComponentProps> = ({txHash}): JSX.Element => {
    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Your artwork is now for sale!</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400} textAlign="center">
                    Users will now able to find it in the marketplace
                </Typography>
            </Stack>
            <Stack>
                <img src="/assets/images/transactionsdlg/artwork-now-forsale.svg" alt="" />
            </Stack>
            <Stack alignItems="center" spacing={2}>
                <ViewOnExplorerButton txHash={txHash} />
                <PrimaryButton fullWidth>Close</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default ArtworkIsNowForSale;
