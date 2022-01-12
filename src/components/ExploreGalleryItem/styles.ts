import { styled, Box, Button } from '@mui/material';

export const ProductImageContainer = styled(Box)<{ onlyShowImage?: boolean }>`
    position: relative;
    img {
        border-radius: 10px;
        width: 100%;
        height: ${({ onlyShowImage }) => (onlyShowImage ? '320px' : 'calc(width * 320 / 230)')};
        // height: ${({ onlyShowImage }) => (onlyShowImage ? 'calc(100vw / 5)' : 'calc(100vw / 6)')};
    }
`;

export const LikeBtn = styled(Box)`
    position: absolute;
    top: 1vw;
    right: 1vw;
    width: 2.5vw;
    height: 2.5vw;
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
