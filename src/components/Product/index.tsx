import React from 'react';
import { Link } from 'react-router-dom';
import { TypeProduct } from 'src/types/product-types';
import {
    ProductContainer,
    ProductImageContainer,
    ProductMainContainer,
    ProductNameTypography,
    ProductPriceTypography,
    ProductLikesContainer,
    ProductLikesTypography,
    BuyNowBtn,
} from './styledComponents';
import { Stack, Button } from '@mui/material';

export interface IProductProps {
    product: TypeProduct;
    onlyShowImage?: boolean;
}

const Product: React.FC<IProductProps> = ({ product, onlyShowImage = false }): JSX.Element => {
    return (
        <ProductContainer>
            <Link to={`/buy-now/${product.id}`}>
                <ProductImageContainer>
                    <img src={product.image} alt="" />
                </ProductImageContainer>
            </Link>
            {!onlyShowImage && (
                <ProductMainContainer>
                    <ProductNameTypography>{product.name}</ProductNameTypography>
                    <Stack direction="row" spacing={1}>
                        <img src="/assets/icons/elatos-ela.svg" alt="" />
                        <ProductPriceTypography>{`ELA ${product.price.toFixed(2)}`}</ProductPriceTypography>
                    </Stack>
                    <BuyNowBtn startIcon={<img src="/assets/icons/buy-now.svg" alt=""></img>} sx={{ marginTop: 1 }}>
                        Buy Now
                    </BuyNowBtn>
                    {/* <ProductLikesContainer>
                        <ProductLikesTypography>{`${product.likes} likes`}</ProductLikesTypography>
                    </ProductLikesContainer> */}
                </ProductMainContainer>
            )}
        </ProductContainer>
    );
};

export default Product;
