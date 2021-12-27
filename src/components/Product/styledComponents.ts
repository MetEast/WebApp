import { styled, Box, Typography, Button } from '@mui/material';

export const ProductContainer = styled(Box)``;

export const ProductImageContainer = styled(Box)<{ onlyShowImage?: boolean }>`
    img {
        border-radius: 18px;
        width: 100%;
        height: ${({ onlyShowImage }) => (onlyShowImage ? '320px' : '100%')};
    }
`;

export const ProductMainContainer = styled(Box)``;

export const ProductNameTypography = styled(Typography)`
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25rem;
`;

export const ProductPriceTypography = styled(Typography)`
    font-weight: 500;
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
    background: #e8f4ff;
    color: #1890ff;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
`;
