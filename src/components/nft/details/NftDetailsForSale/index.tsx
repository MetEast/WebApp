import React from 'react';
import { Box, Button } from '@mui/material';
import { H5Typography, H2Typography, H4Typography } from 'src/core/typographies';
import { DetailsItemContainer, DetailsItemLeftTypography, NftDetailsSmallButton } from '../styledComponents';

export interface INftDetailsForSaleProps {}

export enum enmSaleType {
    BuyNow = 'Buy Now',
    Auction = 'Auction',
}

const NftDetailsForSale: React.FC<INftDetailsForSaleProps> = (): JSX.Element => {
    const saleType = enmSaleType.Auction;

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
                <NftDetailsSmallButton variant="outlined" sx={{ marginRight: '8px' }}>
                    View Transactions History
                </NftDetailsSmallButton>
                <NftDetailsSmallButton variant="outlined">Price History</NftDetailsSmallButton>
            </Box>
            <Box mt={8}>
                <Box display="flex" justifyContent="space-between">
                    <H4Typography display={'flex'} alignItems="center">
                        For Sale Now
                    </H4Typography>
                    <NftDetailsSmallButton variant="outlined">Remove From Market</NftDetailsSmallButton>
                </Box>
                <DetailsItemContainer>
                    <DetailsItemLeftTypography>Sale Type</DetailsItemLeftTypography>
                    <H5Typography>{saleType}</H5Typography>
                </DetailsItemContainer>
                <DetailsItemContainer>
                    <DetailsItemLeftTypography display="flex" alignItems="center">
                        {saleType === enmSaleType.Auction ? 'Sale Price' : 'Minimum Price'}
                    </DetailsItemLeftTypography>
                    <Box display="flex">
                        <H5Typography display="flex" alignItems="center" mr={0.5}>
                            88.00 ELA
                        </H5Typography>
                        <NftDetailsSmallButton variant="outlined">Edit</NftDetailsSmallButton>
                    </Box>
                </DetailsItemContainer>
            </Box>
            {saleType === enmSaleType.Auction && (
                <Box mt={2.5}>
                    <Button variant="contained" fullWidth>View Bids</Button>
                </Box>
            )}
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

export default NftDetailsForSale;
