import React from 'react';
import { Link } from 'react-router-dom';
import { TypeProduct } from 'src/types/product-types';
import { ProductImageContainer, LikeBtn } from './styles';
import { Box, Stack, Typography } from '@mui/material';
import ProductBadgeContainer from '../ProductBadgeContainer';
import { Icon } from '@iconify/react';
import { enumMyNFTType } from 'src/types/product-types';
import ELAPrice from 'src/components/ELAPrice';
import ProductSnippets from 'src/components/ProductSnippets';

export interface ComponentProps {
    product: TypeProduct;
    onlyShowImage?: boolean;
}

const MyNFTGalleryItem: React.FC<ComponentProps> = ({ product, onlyShowImage = false }): JSX.Element => {
    const getUrl = () => {
        if (product.type === enumMyNFTType.BuyNow) return `/mynft/buynow/${product.id}`;
        else if (product.type === enumMyNFTType.OnAuction) return `/mynft/auction/${product.id}`;
        else if (product.type === enumMyNFTType.Created) return `/mynft/created/${product.id}`;
        else if (product.type === enumMyNFTType.Sold) return `/mynft/sold/${product.id}`;
        else return `#`;
    };

    return (
        <Box>
            <Link to={getUrl()}>
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
                    <ProductSnippets nickname="Nickname" likes={88} />
                    <ProductBadgeContainer nfttype={product.type} content={product.saleTime} />
                    <ELAPrice ela_price={199} usd_price={480} />
                </Stack>
            )}
        </Box>
    );
};

export default MyNFTGalleryItem;
