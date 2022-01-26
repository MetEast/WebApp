import React, { useState } from 'react';
import { TypeProduct } from 'src/types/product-types';
import { GalleryItemContainer, ProductImageContainer, ImageBox, LikeBtn } from './styles';
import { Box, Stack, Typography, Grid } from '@mui/material';
import ProductBadgeContainer from '../ProductBadgeContainer';
import { Icon } from '@iconify/react';
import { enumSingleNFTType } from 'src/types/product-types';
import ELAPrice from 'src/components/ELAPrice';
import ProductSnippets from 'src/components/ProductSnippets';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import authAtom from 'src/recoil/auth';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';

export interface ExploreGalleryItemProps {
    product: TypeProduct;
    onlyShowImage?: boolean;
    index: number;
    updateLikes: (index: number, type: string) => void;
}

const ExploreGalleryItem: React.FC<ExploreGalleryItemProps> = ({
    product,
    onlyShowImage,
    index,
    updateLikes,
}): JSX.Element => {
    const navigate = useNavigate();
    const auth = useRecoilValue(authAtom);
    const [didCookies, setDidCookie, removeDidCookie] = useCookies(['did']);
    const [tokenCookies, setTokenCookie, removeTokenCookie] = useCookies(['token']);
    const [likeState, setLikeState] = useState(product.isLike);
    const { enqueueSnackbar } = useSnackbar();

    const getUrl = () => {
        if (product.type === enumSingleNFTType.BuyNow) return `/products/fixed-price/${product.tokenId}`;
        else if (product.type === enumSingleNFTType.OnAuction) return `/products/auction/${product.tokenId}`;
        else return `/`;
    };

    const changeLikeState = (event: React.MouseEvent) => {
        event.stopPropagation(); //
        if (auth.isLoggedIn) {
            let reqUrl = `${process.env.REACT_APP_BACKEND_URL}/`;
            reqUrl += likeState ? 'decTokenLikes' : 'incTokenLikes';
            const reqBody = { token: tokenCookies.token, tokenId: product.tokenId, did: didCookies.did };
            // change state first
            updateLikes(index, likeState ? 'dec' : 'inc');
            setLikeState(!likeState);
            //
            fetch(reqUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqBody),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.code === 200) {
                        enqueueSnackbar('Succeed!', {
                            variant: 'success',
                            anchorOrigin: { horizontal: 'right', vertical: 'top' },
                        });
                    } else {
                        console.log(data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            navigate('/login');
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
                <ImageBox>
                    <Box position="relative">
                        <img src={product.image} alt="" />
                        {!onlyShowImage && (
                            <LikeBtn onClick={changeLikeState}>
                                {likeState ? (
                                    <Icon icon="ph:heart-fill" fontSize={'2vw'} color="red" />
                                ) : (
                                    <Icon icon="ph:heart" fontSize={'2vw'} color="black" />
                                )}
                            </LikeBtn>
                        )}
                    </Box>
                </ImageBox>
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
