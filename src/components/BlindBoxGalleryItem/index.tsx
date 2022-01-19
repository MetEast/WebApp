import React from 'react';
import { Link } from 'react-router-dom';
import { TypeProduct } from 'src/types/product-types';
import { ProductImageContainer, LikeBtn } from './styles';
import { Box, Typography, Grid } from '@mui/material';
import ProductBadgeContainer from '../ProductBadgeContainer';
import { Icon } from '@iconify/react';
import ELAPrice from 'src/components/ELAPrice';
import ProductSnippets from 'src/components/ProductSnippets';

export interface BlindBoxGalleryItemProps {
    product: TypeProduct;
    onlyShowImage?: boolean;
}

const BlindBoxGalleryItem: React.FC<BlindBoxGalleryItemProps> = ({ product, onlyShowImage = false }): JSX.Element => {
    return (
        <Box>
            <Link to={`/blind-box/product/${product.tokenId}`}>
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
                <Grid container spacing={1}>
                    <Grid item order={1} width={'100%'} >
                        <Typography noWrap fontWeight={700} fontSize={{ xs: 16, lg: 32 }}>{product.name}</Typography>
                    </Grid>
                    <Grid item order={{xs: 4, sm: 4, md: 2 }} width={'100%'} display={{xs: 'none', sm: 'none', md: 'block' }}>
                        <ProductSnippets nickname={product.author} likes={product.likes} />
                    </Grid>
                    <Grid item order={3} width={'100%'} >
                        <ProductBadgeContainer nfttype={product.type} content={product.saleTime} />
                    </Grid>
                    <Grid item order={{xs: 2, sm: 2, md: 4 }} width={'100%'} >
                        <ELAPrice price_ela={product.price_ela} price_usd={product.price_usd} />
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default BlindBoxGalleryItem;
