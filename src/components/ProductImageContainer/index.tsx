import React, { useState, useEffect } from 'react';
import { Container, LikeBtn } from './styles';
import { Icon } from '@iconify/react';
import { useSignInContext } from 'src/context/SignInContext';
import { useCookies } from 'react-cookie';
import { TypeProduct } from 'src/types/product-types';
import { Box, Skeleton } from '@mui/material';

export interface ComponentProps {
    product: TypeProduct;
    updateLikes: (type: string) => void;
}

const ProductImageContainer: React.FC<ComponentProps> = ({ product, updateLikes }): JSX.Element => {
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [didCookies] = useCookies(['METEAST_DID']);
    const [tokenCookies] = useCookies(['METEAST_TOKEN']);
    const [likeState, setLikeState] = useState(product.isLike);

    useEffect(() => {
        setLikeState(product.isLike);
    }, [product.isLike]);

    const changeLikeState = (event: React.MouseEvent) => {
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
            updateLikes(likeState ? 'dec' : 'inc');
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
            setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
        }
    };

    return (
        <Container>
            {product.image ? (
                <img src={product.image} alt="" />
            ) : (
                <Box
                    position="relative"
                    borderRadius={4.5}
                    overflow="hidden"
                    sx={{ width: '100%', paddingTop: '100%' }}
                >
                    <Box position="absolute" sx={{ inset: 0 }}>
                        <Skeleton
                            variant="rectangular"
                            animation="wave"
                            width="100%"
                            height="100%"
                            sx={{ bgcolor: '#E8F4FF' }}
                        />
                    </Box>
                </Box>
            )}
            <LikeBtn onClick={changeLikeState}>
                {likeState ? (
                    <Icon icon="ph:heart-fill" fontSize={'2vw'} color="red" />
                ) : (
                    <Icon icon="ph:heart" fontSize={'2vw'} color="black" />
                )}
            </LikeBtn>
        </Container>
    );
};

export default ProductImageContainer;
