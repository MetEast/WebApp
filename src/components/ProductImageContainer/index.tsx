import React, { useState, useEffect } from 'react';
import { Container, LikeBtn } from './styles';
import { Icon } from '@iconify/react';
import { SignInState, useSignInContext } from 'src/context/SignInContext';
import { TypeProduct } from 'src/types/product-types';
// import { Box, Skeleton } from '@mui/material';

export interface ComponentProps {
    product: TypeProduct;
    updateLikes: (type: string) => void;
    isBlindBox?: boolean;
}

const ProductImageContainer: React.FC<ComponentProps> = ({ product, updateLikes, isBlindBox }): JSX.Element => {
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [likeState, setLikeState] = useState(product.isLike);

    useEffect(() => {
        setLikeState(product.isLike);
    }, [product.isLike]);

    const changeLikeState = (event: React.MouseEvent) => {
        event.stopPropagation(); //
        if (signInDlgState.isLoggedIn) {
            const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/${
                likeState ? 'decTokenLikes' : 'incTokenLikes'
            }`;
            const reqBody = isBlindBox
                ? {
                      token: signInDlgState.token,
                      blindBoxIndex: product.tokenId,
                      did: signInDlgState.userDid,
                  }
                : {
                      token: signInDlgState.token,
                      tokenId: product.tokenId,
                      did: signInDlgState.userDid,
                  };
            // change state first
            updateLikes(likeState ? 'dec' : 'inc');
            setLikeState(!likeState);
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
            setSignInDlgState((prevState: SignInState) => {
                const _state = { ...prevState };
                _state.signInDlgOpened = true;
                return _state;
            });
        }
    };

    return (
        <Container>
            <img src={product.image} alt="" />
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
