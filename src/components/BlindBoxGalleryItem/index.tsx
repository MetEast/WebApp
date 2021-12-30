import React from 'react';
import { Link } from 'react-router-dom';
import { TypeProduct } from 'src/types/product-types';
import { ProductImageContainer, LikeBtn } from './styles';
import { Box, Stack, Typography } from '@mui/material';
import SaleStatusBadge from '../SaleStatusBadge';

export interface BlindBoxGalleryItemProps {
    product: TypeProduct;
    onlyShowImage?: boolean;
}

const BlindBoxGalleryItem: React.FC<BlindBoxGalleryItemProps> = ({ product, onlyShowImage = false }): JSX.Element => {
    return (
        <Box>
            <Link to={`/blind-box/product/${product.id}`}>
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
                            <img src="/assets/icons/soldsale.svg" width={16} height={16} alt="" />
                            <Typography fontWeight={500} fontSize={12}>{`24 sold`}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <img src="/assets/icons/like.svg" width={14} height={14} alt="" />
                            <Typography fontWeight={500} fontSize={12}>{`${product.likes} likes`}</Typography>
                        </Stack>
                    </Stack>
                    <SaleStatusBadge product={product} />
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

export default BlindBoxGalleryItem;
