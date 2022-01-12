import React from 'react';
import { Link } from 'react-router-dom';
import { TypeProduct } from 'src/types/product-types';
import { ProductImageContainer, LikeBtn } from './styles';
import { Box, Stack, Typography, Grid } from '@mui/material';
import ProductBadgeContainer from '../ProductBadgeContainer';
import { Icon } from '@iconify/react';
import { enumSingleNFTType } from 'src/types/product-types';
import ELAPrice from 'src/components/ELAPrice';
import ProductSnippets from 'src/components/ProductSnippets';

export interface ExploreGalleryItemProps {
    product: TypeProduct;
    onlyShowImage?: boolean;
}

const ExploreGalleryItem: React.FC<ExploreGalleryItemProps> = ({ product, onlyShowImage = false}): JSX.Element => {
    const getUrl = () => {
        if (product.type === enumSingleNFTType.BuyNow) return `/explore/single-nft/fixed-price/${product.id}`;
        else if (product.type === enumSingleNFTType.OnAuction) return `/explore/single-nft/auction/${product.id}`;
        else return `/`;
    };

    return (
        <Box>
            <Link to={getUrl()}>
                <ProductImageContainer onlyShowImage={onlyShowImage}>
                    <img src={product.image} alt="" />
                    {!onlyShowImage && (
                        <LikeBtn>
                            <Icon icon="ph:heart" fontSize={"2vw"} color="black" />
                        </LikeBtn>
                    )}
                </ProductImageContainer>
            </Link>
            {!onlyShowImage && (
                <Stack>

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
                        <ELAPrice ela_price={product.price_ela} usd_price={product.price_usd} />
                    </Grid>
                </Grid>
                </Stack>

            )}
        </Box>
    );
};

export default ExploreGalleryItem;
