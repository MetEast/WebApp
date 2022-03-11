import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { PinkButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';

export interface ComponentProps {
    onClose: () => void;
}

const EditUserStatus: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    return (
        <Stack spacing={4} width={520}>
            <Stack alignItems="center">
                <DialogTitleTypo>Edit User Status</DialogTitleTypo>
            </Stack>
            <Stack direction="row" spacing={2}>
                <SecondaryButton fullWidth onClick={onClose}>
                    close
                </SecondaryButton>
                <PinkButton fullWidth>Confirm</PinkButton>
            </Stack>
        </Stack>
    );
};

export default EditUserStatus;
