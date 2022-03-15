import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useStyles } from './styles';
import { DialogTitleTypo } from '../../../TransactionDialogs/styles';
import { PrimaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {
    bannerId: number;
    handleBannerUpdates: () => void;
    onClose: () => void;
}

const DeleteBanner: React.FC<ComponentProps> = ({ bannerId, handleBannerUpdates, onClose }): JSX.Element => {
    const classes = useStyles();

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Are you Sure?</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400}>
                    Do you really want to delete this banner?
                </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
                <PrimaryButton btn_type="secondary" fullWidth onClick={onClose}>
                    Back
                </PrimaryButton>
                <PrimaryButton btn_type="pink" fullWidth>
                    Delete
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default DeleteBanner;
