import React from 'react';
import { Button, Box } from '@mui/material';
import { H2Typography, H3Typography, H5Typography, H6Typography } from 'src/core/typographies';
import { ProductImageContainer } from '../Product/styledComponents';

export interface IBuyNowProps {}

const BuyNow: React.FC<IBuyNowProps> = (): JSX.Element => {
    return (
        <Box>
            <Box mb={1} display="flex" justifyContent="space-between">
                <Button variant="outlined">Back</Button>
                <Box display="flex">
                    <Box mr={1}>
                        <Button variant="outlined">Share</Button>
                    </Box>
                    <Button variant="outlined">Flag</Button>
                </Box>
            </Box>
            <H2Typography>Artwork Title</H2Typography>
            <H6Typography>Sold by ElastosArt</H6Typography>

            <ProductImageContainer mt={2}>
                <img
                    src={
                        'https://www.freecodecamp.org/news/content/images/size/w2000/2021/03/Advanced-NFT-Deployment---1-.png'
                    }
                    alt=""
                />
            </ProductImageContainer>

            <H5Typography>
                Project Description. Project Description. Project Description. Project Description. Project Description.
                Project Description. Project Description.
            </H5Typography>

            <Box mt={2}>
                <H6Typography>Price</H6Typography>
                <Box display="flex">
                    <H3Typography>ELA 199.00</H3Typography>
                    <H6Typography>~$860.00</H6Typography>
                </Box>
            </Box>

            <Box pt={1} pb={1}>
                <Button variant="contained">Buy Now</Button>
            </Box>
            <H6Typography>Accepted currencies:</H6Typography>
        </Box>
    );
};

export default BuyNow;
