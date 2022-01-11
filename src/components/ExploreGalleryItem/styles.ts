import { styled, Box, Button } from '@mui/material';

export const ProductImageContainer = styled(Box)<{ onlyShowImage?: boolean }>`
    position: relative;
    img {
        border-radius: 10px;
        width: 100%;
        height: ${({ onlyShowImage }) => (onlyShowImage ? 'calc(100vw / 5)' : 'calc(100vw / 6)')};
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
