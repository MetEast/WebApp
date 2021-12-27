import { styled, Box, Button } from '@mui/material';

export const ProductImageContainer = styled(Box)<{ onlyShowImage?: boolean }>`
    img {
        border-radius: 18px;
        width: 100%;
        height: ${({ onlyShowImage }) => (onlyShowImage ? '320px' : '100%')};
    }
`;

export const BuyNowBtn = styled(Button)`
    background: #e8f4ff;
    color: #1890ff;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    width: fit-content;
`;
