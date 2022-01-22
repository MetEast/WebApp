import React from 'react';
import { TypeProduct } from 'src/types/product-types';
import { GalleryItemContainer, ProductImageContainer, LikeBtn } from './styles';
import { Box, Stack, Typography, Grid } from '@mui/material';
import ProductBadgeContainer from '../ProductBadgeContainer';
import { Icon } from '@iconify/react';
import { enumSingleNFTType } from 'src/types/product-types';
import ELAPrice from 'src/components/ELAPrice';
import ProductSnippets from 'src/components/ProductSnippets';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import authAtom from 'src/recoil/auth';
import { useCookies } from "react-cookie";

export interface ExploreGalleryItemProps {
    product: TypeProduct;
    onlyShowImage?: boolean;
}

const ExploreGalleryItem: React.FC<ExploreGalleryItemProps> = ({ product, onlyShowImage = false }): JSX.Element => {
    const navigate = useNavigate();
    const auth = useRecoilValue(authAtom);
    const [cookies, setCookie, removeCookie] = useCookies(["did"]);

    const getUrl = () => {
        if (product.type === enumSingleNFTType.OnAuction) return `/products/fixed-price/${product.tokenId}`;
        else if (product.type === enumSingleNFTType.BuyNow) return `/products/auction/${product.tokenId}`;
        else return `/`;
    };

    const addToFavouriteList = () => {
        if(auth.isLoggedIn) {
            const did = cookies.did;
            const bodyData = {"tokenId": product.tokenId, "did": did};
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/incTokenLikes`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData)
              }).then(response => response.json()).then(data => {
                if (data.code === 200) {
                    alert(1);
                } else {
                  console.log(data);
                }
              }).catch((error) => {
                console.log(error);
                alert(`Failed`);
            });
        }
        else {

        }
    };

    return (
        <GalleryItemContainer>
            <ProductImageContainer
                onlyShowImage={onlyShowImage}
                onClick={() => {
                    navigate(getUrl());
                }}
            >
                <Box position="relative">
                    <img src={product.image} alt="" />
                    {!onlyShowImage && (
                        <LikeBtn onClick={addToFavouriteList}>
                            <Icon icon="ph:heart" fontSize={'2vw'} color="black" />
                        </LikeBtn>
                    )}
                </Box>
            </ProductImageContainer>
            {!onlyShowImage && (
                <Grid container spacing={1}>
                    <Grid item order={1} width={'100%'}>
                        <Typography noWrap fontWeight={700} fontSize={{ xs: 16, lg: 32 }}>
                            {product.name}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        order={{ xs: 4, sm: 4, md: 2 }}
                        width={'100%'}
                        display={{ xs: 'none', sm: 'none', md: 'block' }}
                    >
                        <ProductSnippets nickname={product.author} likes={product.likes} />
                    </Grid>
                    <Grid item order={3} width={'100%'}>
                        <ProductBadgeContainer nfttype={product.type} />
                    </Grid>
                    <Grid item order={{ xs: 2, sm: 2, md: 4 }} width={'100%'}>
                        <ELAPrice price_ela={product.price_ela} price_usd={product.price_usd} />
                    </Grid>
                </Grid>
            )}
        </GalleryItemContainer>
    );
};

export default ExploreGalleryItem;
