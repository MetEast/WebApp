import { styled, Box, Typography, Button } from '@mui/material';

export const ProductContainer = styled(Box)``;

export const ProductImageContainer = styled(Box)`
    img {
        border-radius: 8px;
        width: 100%;
        height: 100%;
    }
`;

export const ProductMainContainer = styled(Box)``;

export const ProductNameTypography = styled(Typography)`
    font-weight: 700;
    font-size: 0.875rem;
    line-height: 1.25rem;
`;

export const ProductPriceTypography = styled(Typography)`
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.25rem;
`;

export const ProductLikesContainer = styled(Box)``;

export const ProductLikesTypography = styled(Typography)`
    font-weight: 500;
    font-size: 0.75rem;
    line-height: 1.25rem;
`;

export const BuyNowBtn = styled(Button)`
    background: #E8F4FF;
    color: #1890FF;
    border-radius: 8px;
    padding: 8px 16px;
`;
