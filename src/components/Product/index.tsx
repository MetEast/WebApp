import React from 'react';
import { TypeProduct } from 'src/types/product-types';
import { ProductContainer, ProductImageContainer, ProductMainContainer, ProductNameTypography, ProductPriceTypography, ProductLikesContainer, ProductLikesTypography } from './styledComponents';

export interface IProductProps {
    product: TypeProduct,
    onlyShowImage?: boolean
}

const Product: React.FC<IProductProps> = ({ product, onlyShowImage = false }): JSX.Element => {
    return <ProductContainer>
        <ProductImageContainer>
            <img src={product.image} />
        </ProductImageContainer>
        {!onlyShowImage && <ProductMainContainer>
            <ProductNameTypography>{product.name}</ProductNameTypography>
            <ProductPriceTypography>{`ELA ${product.price.toFixed(2)}`}</ProductPriceTypography>
            <ProductLikesContainer>
                <ProductLikesTypography>{`${product.likes} likes`}</ProductLikesTypography>
            </ProductLikesContainer>
        </ProductMainContainer>}
    </ProductContainer>
};

export default Product;
