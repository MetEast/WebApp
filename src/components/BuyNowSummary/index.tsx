import { Wallet24Filled } from '@fluentui/react-icons';
import { Box, Button, Grid } from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { H2Typography, H4Typography, H5Typography, H6Typography } from 'src/core/typographies';

export interface IBuyNowSummaryProps {}

const BuyNowSummary: React.FC<IBuyNowSummaryProps> = (): JSX.Element => {
    const params = useParams();
    const projectId = params.id!;

    const navigate = useNavigate();

    const handleClickBack = () => {
        navigate(`/buy-now/${projectId}`);
    };

    return (
        <Box>
            <Box>
                <Button variant="outlined" onClick={handleClickBack}>
                    Back
                </Button>
            </Box>
            <Box mt={3} textAlign="center">
                <H4Typography>Buy Artwork</H4Typography>
                <H2Typography mt={1}>Order Summary</H2Typography>
            </Box>
            <Box marginTop={'70px'}>
                <Grid container spacing={8}>
                    <Grid item xs={6}>
                        <H6Typography sx={{ fontWeight: 700, textAlign: 'right' }}>Item</H6Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <H5Typography>Project Name</H5Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={8} sx={{ paddingTop: '0.5rem' }}>
                    <Grid item xs={6}>
                        <H6Typography sx={{ fontWeight: 700, textAlign: 'right' }}>Price</H6Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <H5Typography sx={{ fontWeight: 700 }}>ELA 25.00</H5Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={8} sx={{ paddingTop: '0.5rem' }}>
                    <Grid item xs={6}>
                        <H6Typography sx={{ fontWeight: 700, textAlign: 'right' }}>Transaction Fees</H6Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <H6Typography>~ ELA 0.22</H6Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box marginTop={'70px'} textAlign="center">
                <H6Typography sx={{ fontWeight: 600 }}>Wallet Address</H6Typography>
                <Box display="flex" justifyContent="center" sx={{ wordBreak: 'break-word' }}>
                    <Box display="flex">
                        <Box mr={1}>
                            <Wallet24Filled />
                        </Box>

                        <H6Typography sx={{ fontWeight: 600 }}>0x8d10c61B047e8c4a0C465201DD46a7dd6df319Ff</H6Typography>
                    </Box>
                </Box>
            </Box>

            <Box textAlign="center" mt={6}>
                <Button variant="contained" fullWidth sx={{ maxWidth: '220px' }}>
                    Confirm
                </Button>
                <H6Typography mt={3} sx={{ fontWeight: 700 }}>
                    ⚠️ In case of payment problems, please contact the official customer service
                </H6Typography>
            </Box>
        </Box>
    );
};

export default BuyNowSummary;
