import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {
    onClose: () => void;
}

const DeleteProduct: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    return (
        <Stack spacing={4} width={320}>
            <Stack alignItems="center" spacing={2}>
                <DialogTitleTypo>Are you Sure?</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400}>
                    Do you really want to delete this product?
                </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
                <PrimaryButton btn_color="secondary" fullWidth onClick={onClose}>
                    Close
                </PrimaryButton>
                <PrimaryButton btn_color="pink" fullWidth>
                    Confirm
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default DeleteProduct;
