import React from 'react';
import { Box, Button } from '@mui/material';
import { H6Typography, H3Typography, H5Typography, H2Typography } from 'src/core/typographies';
import { Wallet24Filled } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';

export interface IConfirmCreateNftProps {}

const ConfirmCreateNft: React.FC<IConfirmCreateNftProps> = (): JSX.Element => {
    const navigate = useNavigate();

    const handleClickBack = () => {
        navigate('/nft/create');
    };

    const handleClickConfirm = () => {
        navigate('/nft/create/error');
    };

    return (
        <Box textAlign="center">
            <H6Typography mt={3} sx={{ fontWeight: 600 }}>
                Publish Project
            </H6Typography>
            <H2Typography mt={3}>Please Confirm Payment</H2Typography>
            <Box mt={2.5}>
                <H5Typography>Price</H5Typography>
                <H3Typography>ELA 199.00</H3Typography>

                <Box display="flex" mt={2}>
                    <Box display="flex" alignItems="center" pr={1.5}>
                        <Wallet24Filled />
                    </Box>
                    <Box>
                        <H6Typography>Wallet address</H6Typography>
                        <H6Typography>0x8d10c61B047e8c4a0C465201DD46a7dd6df319Ff</H6Typography>
                    </Box>
                </Box>
                <Box mt={2}>
                    <H5Typography>Trasaction Fees 0.22 ELA</H5Typography>
                </Box>
                <Box display="flex" justifyContent="space-around" mt={3.5}>
                    <Button variant="outlined" onClick={handleClickBack}>
                        Back
                    </Button>
                    <Button variant="contained" onClick={handleClickConfirm}>
                        Confirm
                    </Button>
                </Box>
                <H6Typography mt={3} sx={{ fontWeight: 700 }}>
                    ⚠️ In case of payment problems, please contact the official customer service
                </H6Typography>
            </Box>
        </Box>
    );
};

export default ConfirmCreateNft;
