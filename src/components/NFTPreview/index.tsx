import React, { useState, useEffect } from 'react';
import { TypeProduct } from 'src/types/product-types';
import { GalleryItemContainer, ProductImageContainer, ImageBox, LikeBtn } from './styles';
import { Typography, Stack, Box, Skeleton } from '@mui/material';
import ProductBadgeContainer from '../ProductBadgeContainer';
import { Icon } from '@iconify/react';
import { enumSingleNFTType, enumBlindBoxNFTType } from 'src/types/product-types';
import ELAPrice from 'src/components/ELAPrice';
import ProductSnippets from 'src/components/ProductSnippets';
import { useNavigate } from 'react-router-dom';
import { SignInState, useSignInContext } from 'src/context/SignInContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { serverConfig } from 'src/config';

export interface ComponentProps {
    isLoading: boolean;
    product: TypeProduct;
    productType: number; //0: from Home page, 1: from Products page, 2: from BlindBox page, 3: from BlindBox Product NFTSold
    index: number;
    updateLikes?: (index: number, type: string) => void;
    productViewMode?: 'grid1' | 'grid2';
    isBlindBox?: boolean;
}

const NFTPreview: React.FC<ComponentProps> = ({
    isLoading,
    product,
    productType,
    index,
    updateLikes,
    productViewMode,
    isBlindBox,
}): JSX.Element => {
    const navigate = useNavigate();
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [likeState, setLikeState] = useState(product.isLike);

    useEffect(() => {
        setLikeState(product.isLike);
    }, [product.isLike]);

    const getUrl = () => {
        if (product.type === enumSingleNFTType.BuyNow) return `/products/fixed-price/${product.tokenId}`;
        else if (product.type === enumSingleNFTType.OnAuction) return `/products/auction/${product.tokenId}`;
        else if (
            product.type === enumBlindBoxNFTType.ComingSoon ||
            product.type === enumBlindBoxNFTType.SaleEnds ||
            product.type === enumBlindBoxNFTType.SaleEnded ||
            product.type === enumBlindBoxNFTType.SoldOut
        )
            return `/blind-box/product/${product.tokenId}`;
        else return `/`;
    };

    const theme = useTheme();
    const matchDownSm = useMediaQuery(theme.breakpoints.up('sm'));
    const endedAuctionTypes =
        matchDownSm && product.type === enumSingleNFTType.OnAuction && product.isExpired
            ? [enumSingleNFTType.OnAuction, enumBlindBoxNFTType.SaleEnded]
            : undefined;

    const changeLikeState = (event: React.MouseEvent) => {
        event.preventDefault(); //
        event.stopPropagation(); //
        if (signInDlgState.isLoggedIn) {
            const reqUrl = `${serverConfig.metServiceUrl}/api/v1/${
                likeState
                    ? isBlindBox
                        ? 'decBlindBoxLikes'
                        : 'decTokenLikes'
                    : isBlindBox
                    ? 'incBlindBoxLikes'
                    : 'incTokenLikes'
            }`;
            const reqBody = isBlindBox
                ? {
                      blindBoxIndex: product.tokenId,
                      address: signInDlgState.address,
                  }
                : {
                      tokenId: product.tokenId,
                      address: signInDlgState.address,
                  };
            // change state first
            if (updateLikes !== undefined) updateLikes(index, likeState ? 'dec' : 'inc');
            setLikeState(!likeState);
            fetch(reqUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${signInDlgState.token}`,
                },
                body: JSON.stringify(reqBody),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === 200) {
                    } else {
                        console.log(data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            setSignInDlgState((prevState: SignInState) => {
                const _state = { ...prevState };
                _state.signInDlgOpened = true;
                return _state;
            });
        }
    };

    return (
        <GalleryItemContainer>
            <ProductImageContainer
                sx={{ cursor: productType === 3 ? 'auto' : 'pointer' }}
                onClick={() => {
                    if (!isLoading && product.tokenId && productType !== 3)
                        navigate(getUrl(), { state: { isLiked: likeState, isLoggedIn: signInDlgState.isLoggedIn } });
                }}
            >
                <ImageBox loading={isLoading ? 1 : 0}>
                    {isLoading ? (
                        <Skeleton
                            variant="rectangular"
                            animation="wave"
                            width="100%"
                            height="100%"
                            sx={{ bgcolor: '#E8F4FF' }}
                        />
                    ) : (
                        <>
                            <Box
                                sx={{
                                    background: `url(${product.image})`,
                                    width: '100%',
                                    height: '100%',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                }}
                            />
                            {productType !== 3 && (
                                <LikeBtn onClick={changeLikeState}>
                                    <Icon
                                        icon={likeState ? 'ph:heart-fill' : 'ph:heart'}
                                        fontSize={28}
                                        color={likeState ? 'red' : 'black'}
                                    />
                                </LikeBtn>
                            )}
                        </>
                    )}
                </ImageBox>
            </ProductImageContainer>
            <Stack marginTop={1} height="100%">
                <Box>
                    {isLoading ? (
                        <Skeleton
                            variant="rectangular"
                            animation="wave"
                            width="100%"
                            height={24}
                            sx={{ borderRadius: 2, bgcolor: '#E8F4FF' }}
                        />
                    ) : (
                        <Box>
                            <Typography
                                noWrap
                                fontWeight={700}
                                fontSize={{ xs: 16, lg: 22 }}
                                textAlign={productType === 3 ? 'center' : 'left'}
                            >
                                {product.name}
                            </Typography>
                            <Box
                                display={{
                                    xs: productType === 0 ? 'none' : productViewMode === 'grid1' ? 'block' : 'none',
                                    md: 'block',
                                }}
                            >
                                {productType === 0 && (
                                    <ProductSnippets
                                        nickname={product.author}
                                        likes={product.likes}
                                        views={product.views}
                                    />
                                )}
                                {productType === 1 && (
                                    <ProductSnippets
                                        nickname={product.author}
                                        likes={product.likes}
                                        views={product.views}
                                    />
                                )}
                                {productType === 2 && (
                                    <ProductSnippets
                                        nickname={product.author}
                                        sold={product.sold}
                                        likes={product.likes}
                                    />
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
                {productType !== 3 && (
                    <Stack
                        direction={{ xs: 'column-reverse', md: 'column' }}
                        height="100%"
                        justifyContent={{ xs: 'flex-end', md: 'space-between' }}
                        marginTop={{ xs: 0.25, md: 1 }}
                        spacing={{ xs: 0.25, md: 1 }}
                    >
                        {isLoading ? (
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width="100%"
                                height={16}
                                sx={{ borderRadius: 1, bgcolor: '#E8F4FF' }}
                            />
                        ) : (
                            <ProductBadgeContainer
                                nfttype={product.type}
                                content={product.endTime}
                                myNftTypes={endedAuctionTypes}
                                isReservedAuction
                            />
                        )}
                        {isLoading ? (
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width="100%"
                                height={16}
                                sx={{ borderRadius: 1, bgcolor: '#E8F4FF' }}
                            />
                        ) : (
                            <ELAPrice price_ela={product.price_ela} price_usd={product.price_usd} />
                        )}
                    </Stack>
                )}
            </Stack>
        </GalleryItemContainer>
    );
};

export default NFTPreview;
