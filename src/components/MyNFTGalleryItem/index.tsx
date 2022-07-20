import React, { useEffect, useState } from 'react';
import { TypeProduct } from 'src/types/product-types';
import { GalleryItemContainer, ProductImageContainer, ImageBox, LikeBtn } from './styles';
import { Stack, Box, Typography, Skeleton } from '@mui/material';
import ProductBadgeContainer from '../ProductBadgeContainer';
import { Icon } from '@iconify/react';
import { enumMyNFTType } from 'src/types/product-types';
import ELAPrice from 'src/components/ELAPrice';
import ProductSnippets from 'src/components/ProductSnippets';
import { useNavigate } from 'react-router-dom';
import { SignInState, useSignInContext } from 'src/context/SignInContext';
import { serverConfig } from 'src/config';

export interface ComponentProps {
    product: TypeProduct;
    index: number;
    isLoading: boolean;
    productViewMode?: 'grid1' | 'grid2';
    updateLikes: (index: number, type: string) => void;
}

const MyNFTGalleryItem: React.FC<ComponentProps> = ({
    product,
    index,
    isLoading,
    productViewMode,
    updateLikes,
}): JSX.Element => {
    const navigate = useNavigate();
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [likeState, setLikeState] = useState<boolean>(product.isLike);

    const changeLikeState = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (signInDlgState.isLoggedIn) {
            const reqUrl = `${serverConfig.metServiceUrl}/api/v1/${likeState ? 'decTokenLikes' : 'incTokenLikes'}`;
            const reqBody = {
                tokenId: product.tokenId,
                address: signInDlgState.address,
            };
            // change state first
            updateLikes(index, likeState ? 'dec' : 'inc');
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

    useEffect(() => {
        setLikeState(product.isLike);
    }, [product]);

    const getUrl = () => {
        if (product.type === enumMyNFTType.BuyNow) return `/mynft/buynow/${product.tokenId}`;
        else if (product.type === enumMyNFTType.OnAuction) return `/mynft/auction/${product.tokenId}`;
        else if (product.type === enumMyNFTType.Created) return `/mynft/created/${product.tokenId}`;
        else if (product.type === enumMyNFTType.Sold) return `/mynft/sold/${product.tokenId}`;
        else if (product.type === enumMyNFTType.Purchased) return `/mynft/purchased/${product.tokenId}`;
        else return `/mynft/buynow/${product.tokenId}`;
    };

    return (
        <GalleryItemContainer>
            <ProductImageContainer
                onClick={() => {
                    if (!isLoading) navigate(getUrl(), { state: { product } });
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
                            {/* <img src={product.image} alt="" /> */}
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
                            <LikeBtn onClick={changeLikeState}>
                                <Icon
                                    icon={likeState ? 'ph:heart-fill' : 'ph:heart'}
                                    fontSize={28}
                                    color={likeState ? 'red' : 'black'}
                                />
                            </LikeBtn>
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
                            <Typography noWrap fontWeight={700} fontSize={{ xs: 16, lg: 32 }}>
                                {product.name}
                            </Typography>
                            <Box display={{ xs: productViewMode === 'grid1' ? 'block' : 'none', md: 'block' }}>
                                <ProductSnippets
                                    nickname={product.author}
                                    likes={product.likes}
                                    views={product.views}
                                />
                            </Box>
                        </Box>
                    )}
                </Box>
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
                            myNftTypes={product.types}
                            content={product.endTime}
                            isReservedAuction={product.status === '2'}
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
            </Stack>
        </GalleryItemContainer>
    );
};

export default MyNFTGalleryItem;
