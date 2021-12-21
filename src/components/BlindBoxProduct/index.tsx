import { BuildingShop20Filled, Heart20Filled, Heart24Filled, ShoppingBagDismiss20Filled } from '@fluentui/react-icons';
import { Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { H3Typography, H5Typography } from 'src/core/typographies';
import { TypeProduct } from 'src/types/product-types';
import {
    ProductContainer,
    ProductImageContainer,
    ProductMainContainer,
    ProductPriceTypography,
    ComingSoonBadge,
    SoldOutBadge,
    HeartIconContainer,
} from './styledComponents';

export interface IBlindBoxProductProps {
    product: TypeProduct;
}

const BlindBoxProduct: React.FC<IBlindBoxProductProps> = ({ product }): JSX.Element => {
    return (
        <ProductContainer>
            <Link to={`/blind-buy-now/${product.id}`}>
                <ProductImageContainer>
                    <img src={product.image} alt="" />
                    <HeartIconContainer>
                        <Heart24Filled />
                    </HeartIconContainer>
                </ProductImageContainer>
            </Link>

            <ProductMainContainer mt={2}>
                <H3Typography mb={1}>{product.name}</H3Typography>
                <Box display="flex" justifyContent="space-between">
                    <Box>
                        <H5Typography sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                            <ShoppingBagDismiss20Filled style={{ paddingTop: '0.25rem' }} />
                            &nbsp;24 Sold
                        </H5Typography>
                    </Box>
                    <Box>
                        <H5Typography sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                            <BuildingShop20Filled style={{ paddingTop: '0.25rem' }} />
                            &nbsp;200 In Stock
                        </H5Typography>
                    </Box>
                    <Box>
                        <H5Typography sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                            <Heart20Filled style={{ paddingTop: '0.25rem' }} />
                            &nbsp;88 Likes
                        </H5Typography>
                    </Box>
                </Box>
                <ProductPriceTypography mt={5}>{`ELA ${product.price.toFixed(2)}`}</ProductPriceTypography>
            </ProductMainContainer>
            {product.comingSoon ? (
                <ComingSoonBadge>
                    <H5Typography color="inherit">Coming Soon: 2022/02/28 10:00</H5Typography>
                </ComingSoonBadge>
            ) : (
                <SoldOutBadge>
                    <H5Typography color="inherit">Sold Out</H5Typography>
                </SoldOutBadge>
            )}
        </ProductContainer>
    );
};

export default BlindBoxProduct;
