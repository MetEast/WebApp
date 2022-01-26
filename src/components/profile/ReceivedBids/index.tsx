import React from 'react';
import { Stack, Grid, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { TypeSelectItem } from 'src/types/select-types';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';
import Select from '../Select';

export interface ComponentProps {}

const ReceivedBids: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={520}>
            <Stack direction="row" justifyContent="space-between">
                <DialogTitleTypo>Received bids</DialogTitleTypo>
            </Stack>
        </Stack>
    );
};

export default ReceivedBids;
