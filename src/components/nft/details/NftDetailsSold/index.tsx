import React from 'react';
import { Box, Button } from '@mui/material';
import { H5Typography, H2Typography, H4Typography } from 'src/core/typographies';
import { DetailsItemContainer, DetailsItemLeftTypography } from '../styledComponents';

export interface INftDetailsSoldProps {}

const NftDetailsSold: React.FC<INftDetailsSoldProps> = (): JSX.Element => {
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
                <Button variant="outlined" sx={{ fontSize: '14px', padding: '8px 12px', marginRight: '8px' }}>
                    View Transactions History
                </Button>
                <Button variant="outlined" sx={{ fontSize: '14px', padding: '8px 12px' }}>
                    Price History
                </Button>
            </Box>
            <Box mt={8}>
                <H4Typography>Sale Details</H4Typography>

                <DetailsItemContainer>
                    <DetailsItemLeftTypography>DATE</DetailsItemLeftTypography>
                    <H5Typography>2022/02/28 10:00</H5Typography>
                </DetailsItemContainer>
                <DetailsItemContainer>
                    <DetailsItemLeftTypography>PRICE</DetailsItemLeftTypography>
                    <H5Typography>800 ELA</H5Typography>
                </DetailsItemContainer>
                <DetailsItemContainer>
                    <DetailsItemLeftTypography>SALE TYPE</DetailsItemLeftTypography>
                    <H5Typography>Fixed Price</H5Typography>
                </DetailsItemContainer>
                <DetailsItemContainer>
                    <DetailsItemLeftTypography>SOLD TO</DetailsItemLeftTypography>
                    <H5Typography>Nickname</H5Typography>
                </DetailsItemContainer>
            </Box>
            <Box mt={4}>
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
                    <DetailsItemLeftTypography>SALE TYPE</DetailsItemLeftTypography>
                    <H5Typography>Fixed Price</H5Typography>
                </DetailsItemContainer>
                <DetailsItemContainer>
                    <DetailsItemLeftTypography>Seller</DetailsItemLeftTypography>
                    <H5Typography>Seller Nickname / Blind Box</H5Typography>
                </DetailsItemContainer>
            </Box>
        </Box>
    );
};

export default NftDetailsSold;
