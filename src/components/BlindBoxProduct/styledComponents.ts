import { styled, Box, Typography } from '@mui/material';

export const ProductContainer = styled(Box)`
    border-radius: 16px;
    border: 1px solid #e4e4e4;
    padding: 1.25rem;
    position: relative;
`;

export const ProductImageContainer = styled(Box)`
    positon: relative;

    img {
        border-radius: 8px;
        width: 100%;
        height: 100%;
    }
`;

export const ProductMainContainer = styled(Box)``;

export const ProductPriceTypography = styled(Typography)`
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25rem;
`;

export const ProductLikesContainer = styled(Box)``;

export const ProductLikesTypography = styled(Typography)`
    font-weight: 500;
    font-size: 0.75rem;
    line-height: 1.25rem;
`;

export const ComingSoonBadge = styled(Box)`
    background: var(--color-success);
    position: absolute;
    top: 10px;
    left: -20px;
    border-radius: 8px;
    padding: 4px 8px;
    color: white;
`;

export const SoldOutBadge = styled(Box)`
    background: var(--color-error);
    position: absolute;
    top: 10px;
    left: -20px;
    border-radius: 8px;
    padding: 4px 8px;
    color: white;
`;

export const HeartIconContainer = styled(Box)`
    position: absolute;
    top: 32px;
    right: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 16px;
    border: 1px solid var(--color-base);
    color: var(--color-base);
    border-radius: 8px;
`;
