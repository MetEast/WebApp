import React from 'react';
import { Box, Button } from '@mui/material';
import { H5Typography, H2Typography, H4Typography } from 'src/core/typographies';
import { DetailsItemContainer, DetailsItemLeftTypography } from '../styledComponents';

export interface INftDetailsAcquiredProps {}

const NftDetailsAcquired: React.FC<INftDetailsAcquiredProps> = (): JSX.Element => {
    return (
        <Box>
            <Box mb={3} display="flex" justifyContent="space-between">
                <Button variant="outlined">Back</Button>
                <Button variant="contained">View File</Button>
            </Box>
            <Box>
                <H2Typography>Project Name</H2Typography>
                <H5Typography>Created by Creator Nickname</H5Typography>
            </Box>
            <Box mt={3}>
                <Button variant="contained" fullWidth>
                    Sell
                </Button>

                <Box mt={3}>
                    <Button variant="outlined">View Transactions History</Button>
                </Box>
            </Box>
            <Box mt={3}>
                <H4Typography>Purchase Details</H4Typography>

                <DetailsItemContainer>
                    <DetailsItemLeftTypography>DATE</DetailsItemLeftTypography>
                    <H5Typography>2022/02/28 10:00</H5Typography>
                </DetailsItemContainer>
                <DetailsItemContainer>
                    <DetailsItemLeftTypography>PRICE</DetailsItemLeftTypography>
                    <H5Typography>800 ELA</H5Typography>
                </DetailsItemContainer>
                <DetailsItemContainer>
                    <DetailsItemLeftTypography>SELLER</DetailsItemLeftTypography>
                    <H5Typography>Seller Nickname / Blind Box</H5Typography>
                </DetailsItemContainer>
            </Box>
        </Box>
    );
};

export default NftDetailsAcquired;
