import { styled, Box, Button } from '@mui/material';

export const ProductImageContainer = styled(Box)<{ onlyShowImage?: boolean }>`
    position: relative;
    img {
        border-radius: 18px;
        width: 100%;
        height: ${({ onlyShowImage }) => (onlyShowImage ? '320px' : '100%')};
    }
`;

export const LikeBtn = styled(Box)`
    position: absolute;
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background: #ffffffcc;
    display: none;
    place-content: center;

    ${(props) => props.theme.breakpoints.up('sm')} {
        display: grid;
    }

    img {
        width: 20px;
        height: 20px;
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
