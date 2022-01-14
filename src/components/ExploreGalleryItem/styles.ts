import { styled, Box } from '@mui/material';

export const ProductImageContainer = styled(Box)<{ onlyShowImage?: boolean }>`
    position: relative;
    width: 100%;
    padding-top: ${({ onlyShowImage }) => (onlyShowImage ? 'auto' : '100%')};
    img {
        position: ${({ onlyShowImage }) => (onlyShowImage ? 'auto' : 'absolute')};
        top: 0;
        border-radius: 10px;
        width: 100%;
        height: ${({ onlyShowImage }) => (onlyShowImage ? '320px' : 'auto')};
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
