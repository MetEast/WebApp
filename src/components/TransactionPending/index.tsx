import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { H2Typography, H4Typography } from 'src/core/typographies';
import { sleep } from 'src/services/sleep';

export interface ITransactionPendingProps {}

const TransactionPending: React.FC<ITransactionPendingProps> = (): JSX.Element => {
    const navigate = useNavigate();

    useEffect(() => {
        sleep(2000).then(() => {
            navigate('/');
        });
    }, [navigate]);

    return (
        <Box>
            <Box mt={3} textAlign="center">
                <H2Typography mt={1}>Waiting For Confirmation...</H2Typography>
            </Box>
            <Box mt={2.5} textAlign="center">
                <H4Typography>Please confirm this transaction with your wallet to continue.</H4Typography>
            </Box>
        </Box>
    );
};

export default TransactionPending;
