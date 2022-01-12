import { Typography, Box, Button, Stack } from '@mui/material';
import React from 'react';
import { PrimaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {
    onClickConnect: () => void;
}

const ConnectDID: React.FC<ComponentProps> = ({ onClickConnect }): JSX.Element => {
    return (
        <Stack alignItems="center" width={300} spacing={3.5}>
            <Typography fontSize={32} fontWeight={700}>
                Let's Get Started
            </Typography>
            <Typography fontSize={16} fontWeight={400} textAlign="center">
                You'll need an Elastos Decentralised Identity (DID) to use this application.
            </Typography>
            <Stack
                width={186}
                alignItems="center"
                spacing={1}
                paddingY={2}
                borderRadius={4}
                sx={{ background: '#F1F1F1' }}
            >
                <img src="/assets/icons/elastos-essential.svg" alt="" />
                <Typography fontSize={14} fontWeight={600}>
                    Elastos Essential DID
                </Typography>
            </Stack>
            <PrimaryButton fullWidth>Connect DID</PrimaryButton>
        </Stack>
    );
};

export default ConnectDID;
