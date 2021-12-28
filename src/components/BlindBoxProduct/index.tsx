import React from 'react';
import { Link } from 'react-router-dom';
import { TypeProduct } from 'src/types/product-types';
import { ProductImageContainer, BuyNowBtn, LikeBtn } from './styles';
import { Box, Stack, Typography } from '@mui/material';

export interface IBlindBoxProductProps {
    product: TypeProduct;
    onlyShowImage?: boolean;
}

const BlindBoxProduct: React.FC<IBlindBoxProductProps> = ({ product, onlyShowImage = false }): JSX.Element => {
    return (
        <Box>
            <Link to={`/buy-now/${product.id}`}>
                <ProductImageContainer onlyShowImage={onlyShowImage}>
                    <img src={product.image} alt="" />
                    {!onlyShowImage && (
                        <LikeBtn>
                            <img src="/assets/icons/like.svg" alt="" />
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
                            <img src="/assets/icons/creator.svg" width={14} height={14} alt="" />
                            <Typography fontWeight={500} fontSize={12}>{`by Nickname`}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <img src="/assets/icons/like.svg" width={14} height={14} alt="" />
                            <Typography fontWeight={500} fontSize={12}>{`${product.likes} likes`}</Typography>
                        </Stack>
                    </Stack>
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
                    <BuyNowBtn startIcon={<img src="/assets/icons/buy-now.svg" alt=""></img>}>Buy Now</BuyNowBtn>
                </Stack>
            )}
        </Box>
    );
};

export default BlindBoxProduct;
