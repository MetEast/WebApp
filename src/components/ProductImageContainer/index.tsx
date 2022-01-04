import React from 'react';
import { Container, LikeBtn } from './styles';
import { Icon } from '@iconify/react';

export interface ComponentProps {
    imgurl: string;
}

const ProductImageContainer: React.FC<ComponentProps> = ({ imgurl }): JSX.Element => {
    return (
        <Container>
            <img src={imgurl} alt="" />
            <LikeBtn>
                <Icon icon="ph:heart" fontSize={20} color="black" />
            </LikeBtn>
        </Container>
    );
};

export default ProductImageContainer;
