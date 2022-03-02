import React, { useState } from 'react';
import { Stack, Box, Grid, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {
    onClose: () => void;
}

const ManageProfile: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    return (
        <Stack spacing={4} width={{ md: 470 }} paddingY={{ xs: 4, sm: 0 }}>
            <Stack>
                <DialogTitleTypo sx={{ textAlign: 'center' }}>Manage Profile</DialogTitleTypo>
            </Stack>
            <SecondaryButton fullWidth onClick={onClose}>
                Close
            </SecondaryButton>
        </Stack>
    );
};

export default ManageProfile;
