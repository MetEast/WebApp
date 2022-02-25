import React, { useState } from 'react';
import { TypeProduct } from 'src/types/product-types';
import { GalleryItemContainer, ProductImageContainer, ImageBox, LikeBtn } from 'src/components/NFTPreview/styles';
import { Typography, Grid } from '@mui/material';
import ProductBadgeContainer from '../ProductBadgeContainer';
import { Icon } from '@iconify/react';
import ELAPrice from 'src/components/ELAPrice';
import ProductSnippets from 'src/components/ProductSnippets';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useSignInContext } from 'src/context/SignInContext';


export interface BlindBoxGalleryItemProps {
    product: TypeProduct;
    index: number;
    updateLikes: (index: number, type: string) => void;
}

const BlindBoxGalleryItem: React.FC<BlindBoxGalleryItemProps> = ({ product, index, updateLikes }): JSX.Element => {
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
                        console.log("succeed");
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
        return `/blind-box/product/${product.tokenId}`;
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
            <Grid container marginTop={1}>
                <Grid item order={1} width={'100%'}>
                    <Typography noWrap fontWeight={700} fontSize={{ xs: 16, lg: 22 }}>
                        {product.name}
                    </Typography>
                </Grid>
                <Grid
                    item
                    order={{ xs: 4, sm: 4, md: 2 }}
                    width={'100%'}
                    display={{ xs: 'none', sm: 'none', md: 'block' }}
                >
                    <ProductSnippets sold={product.sold} likes={product.likes} />
                </Grid>
                <Grid item order={3} width={'100%'} marginTop={{ xs: 0.25, md: 1 }}>
                    <ProductBadgeContainer nfttype={product.type} content={product.endTime} isReservedAuction={product.status === 'HAS BIDS'} />
                </Grid>
                <Grid item order={{ xs: 2, sm: 2, md: 4 }} width={'100%'} marginTop={{ xs: 0.25, md: 1 }}>
                    <ELAPrice price_ela={product.price_ela} price_usd={product.price_usd} />
                </Grid>
            </Grid>
        </GalleryItemContainer>
    );
};

export default BlindBoxGalleryItem;
