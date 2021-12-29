import React from 'react';
import { Container } from './styles';
import { TypeProduct } from 'src/types/product-types';

interface SaleStatusBadgeProps {
    product: TypeProduct;
}

const SaleStatusBadge: React.FC<SaleStatusBadgeProps> = ({ product }): JSX.Element => {
    return (
        <>
            <Container saleStatus={product.saleStatus}>{`${product.saleStatus}${
                product.saleTime ? `: ${product.saleTime}` : ''
            }`}</Container>
        </>
    );
};

export default SaleStatusBadge;
