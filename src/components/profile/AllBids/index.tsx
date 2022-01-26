import React from 'react';
import { Stack, Grid, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';

export interface ComponentProps {}

const AllBids: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={520}>
            <Stack direction="row" justifyContent="space-between">
                <DialogTitleTypo>All Bids</DialogTitleTypo>
            </Stack>
        </Stack>
    );
};

export default AllBids;
