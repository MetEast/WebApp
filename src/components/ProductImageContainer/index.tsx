import React, { useState } from 'react';
import { Container, LikeBtn } from './styles';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import authAtom from 'src/recoil/auth';
import { useCookies } from "react-cookie";
import { useSnackbar } from 'notistack';
import { TypeProduct } from 'src/types/product-types';

export interface ComponentProps {
    product: TypeProduct;
    updateLikes: (type: string) => void;
}

const ProductImageContainer: React.FC<ComponentProps> = ({ product, updateLikes }): JSX.Element => {
    const navigate = useNavigate();
    const auth = useRecoilValue(authAtom);
    const [didCookies, setDidCookie, removeDidCookie] = useCookies(["did"]);
    const [tokenCookies, setTokenCookie, removeTokenCookie] = useCookies(["token"]);
    const [likeState, setLikeState] = useState(product.isLike);
    const { enqueueSnackbar } = useSnackbar();
    
    const changeLikeState = (event: React.MouseEvent) => {
        event.stopPropagation(); // 
        if(auth.isLoggedIn) {
            let reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;
            reqUrl += likeState ? 'decTokenLikes' : 'incTokenLikes'; 
            const reqBody = {"token": tokenCookies.token, "tokenId": product.tokenId, "did": didCookies.did};
            // change state first
            updateLikes(likeState ? 'dec' : 'inc');
            setLikeState(!likeState);
            //
            fetch(reqUrl,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(reqBody)
              }).then(response => response.json()).then(data => {
                if (data.code === 200) {
                    enqueueSnackbar('Succeed!', { variant: "success", anchorOrigin: {horizontal: "right", vertical: "top"} })
                } else {
                  console.log(data);
                }
              }).catch((error) => {
                console.log(error);
            });
        }
        else {
            navigate('/login');
        }
    };

    return (
        <Container>
            <img src={product.image} alt="" />
            <LikeBtn onClick={changeLikeState}>
                {likeState ? <Icon icon="ph:heart-fill" fontSize={'2vw'} color="red" /> : <Icon icon="ph:heart" fontSize={'2vw'} color="black" />}
            </LikeBtn>
        </Container>
    );
};

export default ProductImageContainer;
