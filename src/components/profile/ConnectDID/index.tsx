import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { Typography, Stack } from '@mui/material';

export interface ComponentProps {
    onConnect: () => void;
}

const ConnectDID: React.FC<ComponentProps> = ({ onConnect }): JSX.Element => {
    const navigate = useNavigate();
    document.addEventListener('keydown', (event) => {
        // Press ESC to go back
        if (event.keyCode === 27) {
            event.preventDefault();
            navigate('/');
        }
    });

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
                    Elastos Essentials DID
                </Typography>
            </Stack>
            <PrimaryButton fullWidth onClick={onConnect}>
                Connect DID
            </PrimaryButton>
        </Stack>
    );
};

export default ConnectDID;
