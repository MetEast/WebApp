import React from 'react';
import { Button, Box } from '@mui/material';
import { H2Typography, H3Typography, H5Typography, H6Typography } from 'src/core/typographies';
import { ProductImageContainer } from '../Product/styledComponents';
import { SaleEndsBadge } from './styledComponents';
import {
    BuildingShop20Filled,
    Glasses20Filled,
    Heart20Filled,
    Link20Filled,
    ShoppingBagDismiss20Filled,
} from '@fluentui/react-icons';
import { useNavigate, useParams } from 'react-router-dom';

export interface IBlindBoxBuyNowProps {}

const BlindBoxBuyNow: React.FC<IBlindBoxBuyNowProps> = (): JSX.Element => {
    const params = useParams();

    const projectId = params.id!;

    const navigate = useNavigate();

    const handleClickBuyNow = () => {
        navigate(`/buy-now/${projectId}/summary`);
    };

    return (
        <Box>
            <Box mb={1} display="flex" justifyContent="space-between">
                <Button variant="outlined">Back</Button>
                <Button variant="outlined" sx={{ paddingTop: '9px', paddingBottom: '9px', lineHeight: 1 }}>
                    <Link20Filled />
                    Share
                </Button>
            </Box>
            <H2Typography>Artwork Title</H2Typography>
            <SaleEndsBadge>
                <H5Typography color="inherit">Sale Ends: 2022/02/28 10:00</H5Typography>
            </SaleEndsBadge>

            <ProductImageContainer mt={2}>
                <img src={'https://scalablesolutions.io/wp-content/uploads/2021/03/NFTs.png'} alt="" />
            </ProductImageContainer>

            <Box display="flex" justifyContent="space-between">
                <Box>
                    <H5Typography sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                        <Glasses20Filled style={{ paddingTop: '0.25rem' }} />
                        &nbsp;4800 Views
                    </H5Typography>
                </Box>
                <Box>
                    <H5Typography sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                        <ShoppingBagDismiss20Filled style={{ paddingTop: '0.25rem' }} />
                        &nbsp;24 Sold
                    </H5Typography>
                </Box>
                <Box>
                    <H5Typography sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                        <Heart20Filled style={{ paddingTop: '0.25rem' }} />
                        &nbsp;88 Likes
                    </H5Typography>
                </Box>
            </Box>

            <Box mt={2}>
                <H6Typography>Price</H6Typography>
                <Box display="flex" justifyContent="space-between">
                    <Box display="flex">
                        <H3Typography>ELA 199.00</H3Typography>
                    </Box>
                    <Box>
                        <H5Typography sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                            <BuildingShop20Filled />
                            &nbsp;200 In Stock
                        </H5Typography>
                    </Box>
                </Box>
            </Box>

            <Box pt={1} pb={1}>
                <Button variant="contained" onClick={handleClickBuyNow} fullWidth>
                    Buy Now
                </Button>
            </Box>
        </Box>
    );
};

export default BlindBoxBuyNow;
