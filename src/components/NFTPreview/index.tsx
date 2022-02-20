import React, { useState, useEffect } from 'react';
import { TypeProduct } from 'src/types/product-types';
import { GalleryItemContainer, ProductImageContainer, ImageBox, LikeBtn } from './styles';
import { Typography, Grid, Stack, Box } from '@mui/material';
import ProductBadgeContainer from '../ProductBadgeContainer';
import { Icon } from '@iconify/react';
import { enumSingleNFTType, enumBlindBoxNFTType } from 'src/types/product-types';
import ELAPrice from 'src/components/ELAPrice';
import ProductSnippets from 'src/components/ProductSnippets';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useSignInContext } from 'src/context/SignInContext';

export interface ComponentProps {
    product: TypeProduct;
    index: number;
    updateLikes: (index: number, type: string) => void;
}

const NFTPreview: React.FC<ComponentProps> = ({ product, index, updateLikes }): JSX.Element => {
    const navigate = useNavigate();
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [didCookies] = useCookies(['METEAST_DID']);
    const [tokenCookies] = useCookies(['METEAST_TOKEN']);
    const [likeState, setLikeState] = useState(product.isLike);
    
    useEffect(()=>{
        setLikeState(product.isLike)
    }, [product.isLike])

    let productType = 0; // default: enumSingleNFTType
    if (
        product.type === enumBlindBoxNFTType.ComingSoon ||
        product.type === enumBlindBoxNFTType.SaleEnds ||
        product.type === enumBlindBoxNFTType.SaleEnded
    )
        productType = 1; // enumBlindBoxNFTType

    const getUrl = () => {
        if (product.type === enumSingleNFTType.BuyNow) return `/products/fixed-price/${product.tokenId}`;
        else if (product.type === enumSingleNFTType.OnAuction) return `/products/auction/${product.tokenId}`;
        else if (
            product.type === enumBlindBoxNFTType.ComingSoon ||
            product.type === enumBlindBoxNFTType.SaleEnds ||
            product.type === enumBlindBoxNFTType.SaleEnded
        )
            return `/blind-box/product/${product.tokenId}`;
        else return `/`;
    };

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
                        console.log(product.tokenId, ' change like status succeed');
                    } else {
                        console.log(data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
        }
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
                            <Icon icon="ph:heart-fill" fontSize="2vw" color="red" />
                        ) : (
                            <Icon icon="ph:heart" fontSize="2vw" color="black" />
                        )}
                    </LikeBtn>
                </ImageBox>
            </ProductImageContainer>
            <Stack marginTop={1} height="100%">
                <Box>
                    <Typography noWrap fontWeight={700} fontSize={{ xs: 16, lg: 22 }}>
                        {product.name}
                    </Typography>
                    <Box display={{ xs: 'none', md: 'block' }}>
                        {productType === 0 ? (
                            <ProductSnippets nickname={product.author} likes={product.likes} />
                        ) : (
                            <ProductSnippets sold={product.sold} likes={product.likes} />
                        )}
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

export default NFTPreview;
