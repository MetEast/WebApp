import React from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {
    onClose: () => void;
}

const ErrorMessage: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Error message</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400} textAlign="center">
                    Error message, describe what went wrong and what's the next step the user can take
                </Typography>
            </Stack>
            <Stack>
                <img src="/assets/images/transactionsdlg/error-message.svg" height={240} alt="" />
            </Stack>
            <PrimaryButton fullWidth onClick={onClose}>
                Close
            </PrimaryButton>
        </Stack>
    );
};

export default ErrorMessage;
