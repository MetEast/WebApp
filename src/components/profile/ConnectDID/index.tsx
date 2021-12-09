import { Typography, Box, Button } from '@mui/material';
import React from 'react';
import { H2Typography } from 'src/core/typographies';

export interface IConnectDIDProps {
    onClickConnect: () => void;
}

const ConnectDID: React.FC<IConnectDIDProps> = ({ onClickConnect }): JSX.Element => {
    return (
        <Box
            sx={{
                paddingTop: '100px',
                textAlign: 'center',
            }}
        >
            <H2Typography mb={2.5}>Let's Get Started</H2Typography>
            <Typography fontWeight={500} fontSize="1rem" lineHeight="1.125rem">
                You'll need an Elastos Identity to use this application.
            </Typography>
            <Box mt={4} mb={1}>
                <Box mb={2}>
                    <Button variant="contained" onClick={onClickConnect}>
                        Connect Elastos Essentials
                    </Button>
                </Box>
                <Button variant="outlined" onClick={onClickConnect}>
                    Generate Temporary Identity
                </Button>
            </Box>
            <Typography fontWeight={500} fontSize={'0.75rem'} lineHeight={'1.25rem'}>
                Remember to add did backup option if Temp Identity is used
            </Typography>
        </Box>
    );
};

export default ConnectDID;
