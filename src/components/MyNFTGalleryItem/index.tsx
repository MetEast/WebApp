import React, { useState } from 'react';
import { TypeProduct } from 'src/types/product-types';
import { GalleryItemContainer, ProductImageContainer, ImageBox, LikeBtn } from './styles';
import { Stack, Box, Grid, Typography } from '@mui/material';
import ProductBadgeContainer from '../ProductBadgeContainer';
import { Icon } from '@iconify/react';
import { enumMyNFTType } from 'src/types/product-types';
import ELAPrice from 'src/components/ELAPrice';
import ProductSnippets from 'src/components/ProductSnippets';
import { useNavigate } from 'react-router-dom';
import { useSignInContext } from 'src/context/SignInContext';
import { useCookies } from 'react-cookie';

export interface ComponentProps {
    product: TypeProduct;
    index: number;
    updateLikes: (index: number, type: string) => void;
}

const MyNFTGalleryItem: React.FC<ComponentProps> = ({ product, index, updateLikes }): JSX.Element => {
    const navigate = useNavigate();
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [didCookies] = useCookies(['METEAST_DID']);
    const [tokenCookies] = useCookies(['METEAST_TOKEN']);
    const [likeState, setLikeState] = useState(product.isLike);

    const changeLikeState = (event: React.MouseEvent) => {
        event.preventDefault(); //
        event.stopPropagation(); //
        if (signInDlgState.isLoggedIn) {
            let reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/`;
            reqUrl += likeState ? 'decTokenLikes' : 'incTokenLikes';
            const reqBody = {
                token: tokenCookies.METEAST_TOKEN,
                tokenId: product.tokenId,
                did: didCookies.METEAST_DID,
            };
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
                        console.log('succeed');
                    } else {
                        console.log(data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            setSignInDlgState({...signInDlgState, signInDlgOpened: true })
        }
    };

    const getUrl = () => {
        if (product.type === enumMyNFTType.BuyNow) return `/mynft/buynow/${product.tokenId}`;
        else if (product.type === enumMyNFTType.OnAuction) return `/mynft/auction/${product.tokenId}`;
        else if (product.type === enumMyNFTType.Created) return `/mynft/created/${product.tokenId}`;
        else if (product.type === enumMyNFTType.Sold) return `/mynft/sold/${product.tokenId}`;
        else return `/mynft/buynow/${product.tokenId}`;
    };

    return (
        <GalleryItemContainer>
            <ProductImageContainer
                onClick={() => {
                    navigate(getUrl());
                }}
            >
                <ImageBox>
                    <img src={product.image} alt="" />
                    <LikeBtn onClick={changeLikeState}>
                        {likeState ? (
                            <Icon icon="ph:heart-fill" fontSize={20} color="red" />
                        ) : (
                            <Icon icon="ph:heart" fontSize={20} color="black" />
                        )}
                    </LikeBtn>
                </ImageBox>
            </ProductImageContainer>
            <Stack marginTop={1} height="100%">
                <Box>
                    <Typography noWrap fontWeight={700} fontSize={{ xs: 16, lg: 32 }}>
                        {product.name}
                    </Typography>
                    <Box display={{ xs: 'none', md: 'block' }}>
                        <ProductSnippets nickname={product.author} likes={product.likes} />
                    </Box>
                </Box>
                <Stack
                    direction={{ xs: 'column-reverse', md: 'column' }}
                    height="100%"
                    justifyContent={{ xs: 'flex-end', md: 'space-between' }}
                    marginTop={{ xs: 0.25, md: 1 }}
                    spacing={{ xs: 0.25, md: 1 }}
                >
                    <ProductBadgeContainer nfttype={product.type} content={product.endTime} />
                    <ELAPrice price_ela={product.price_ela} price_usd={product.price_usd} />
                </Stack>
            </Stack>
        </GalleryItemContainer>
    );
};

export default MyNFTGalleryItem;
