import React, { useState, useEffect } from 'react';
import { Container, LikeBtn } from './styles';
import { Icon } from '@iconify/react';
import { SignInState, useSignInContext } from 'src/context/SignInContext';
import { TypeProduct } from 'src/types/product-types';
import { serverConfig } from 'src/config';

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
            updateLikes(likeState ? 'dec' : 'inc');
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
