import React from 'react';
import { Link } from 'react-router-dom';
import { TypeProduct } from 'src/types/product-types';
import { ProductImageContainer, BuyNowBtn, LikeBtn } from './styledComponents';
import { Box, Stack, Typography } from '@mui/material';
import { Icon } from '@iconify/react';

export interface IProductProps {
    product: TypeProduct;
    onlyShowImage?: boolean;
}

const Product: React.FC<IProductProps> = ({ product, onlyShowImage = false }): JSX.Element => {
    return (
        <Box>
            <Link to={`/buy-now/${product.id}`}>
                <ProductImageContainer onlyShowImage={onlyShowImage}>
                    <img src={product.image} alt="" />
                    {!onlyShowImage && (
                        <LikeBtn>
                            <Icon icon="ph:heart" fontSize={20} color="black" />
                        </LikeBtn>
                    )}
                </ProductImageContainer>
            </Link>
            {!onlyShowImage && (
                <Stack spacing={1}>
                    <Typography fontWeight={700} fontSize={{ xs: 16, lg: 32 }}>
                        {product.name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} display={{ xs: 'none', lg: 'flex' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Icon icon="ph:palette" />
                            <Typography fontWeight={500} fontSize={12}>{`by Nickname`}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Icon icon="ph:heart" />
                            <Typography fontWeight={500} fontSize={12}>{`${product.likes} likes`}</Typography>
                        </Stack>
                    </Stack>
                    <BuyNowBtn startIcon={<Icon icon="ph:lightning" />}>Buy Now</BuyNowBtn>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <img src="/assets/icons/elatos-ela.svg" alt="" />
                        <Typography fontWeight={500} fontSize={{ xs: 14, lg: 20 }}>{`${product.price.toFixed(
                            2,
                        )} ELA`}</Typography>
                        <Typography
                            fontWeight={400}
                            fontSize={12}
                            display={{ xs: 'none', lg: 'block' }}
                        >{`~$480.00`}</Typography>
                    </Stack>
                </Stack>
            )}
        </Box>
    );
};

export default Product;
