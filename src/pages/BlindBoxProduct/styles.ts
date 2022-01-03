import { styled, Box, Button } from '@mui/material';

export const ProductImageContainer = styled(Box)`
    position: relative;
    img {
        border-radius: 18px;
        width: 100%;
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
    height: 56px;
    background: #1890ff;
    color: white;
    border-radius: 16px;
    font-size: 18px;
    font-weight: 700;
    &:hover {
        background: #0870ef;
    }
`;
