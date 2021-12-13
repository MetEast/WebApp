import { Box, Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { H2Typography, H3Typography, H6Typography } from 'src/core/typographies';
import { GiftImageContainer } from './styledComponents';

export interface ITransactionSuccessProps {}

const TransactionSuccess: React.FC<ITransactionSuccessProps> = (): JSX.Element => {
    const navigate = useNavigate();

    const handleClickClose = () => {
        navigate('/');
    };

    return (
        <Box>
            <Box mt={3} textAlign="center">
                <H6Typography sx={{ fontWeight: 700 }}>Success!</H6Typography>
            </Box>
            <Box mt={3} textAlign="center">
                <H2Typography mt={1}>Purchase Successful!</H2Typography>
            </Box>
            <Box mt={2.5} textAlign="center">
                <H3Typography>Your can find your shiny new artwork in your profile</H3Typography>
            </Box>
            <GiftImageContainer mt={2.5}>
                <img src="/assets/images/gift.svg" alt="" />
            </GiftImageContainer>
            <Box mt={5} textAlign="center">
                <Button variant="contained" fullWidth onClick={handleClickClose}>
                    Close
                </Button>
            </Box>
        </Box>
    );
};

export default TransactionSuccess;
