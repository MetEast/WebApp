import { styled, Box, Stack } from '@mui/material';

export const GalleryItemContainer = styled(Stack)`
    height: 100%;
    justify-content: space-between;
`;

export const ProductImageContainer = styled(Stack)<{ onlyShowImage?: boolean }>`
    position: relative;
    width: 100%;
    padding-top: 100%;
    cursor: pointer;
`;

export const ImageBox = styled(Box)`
    background: #eeeeee;
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    /* align-items: center; */
    img {
        /* width: auto; */
        /* height: auto; */
        max-width: 100%;
        max-height: 100%;
        /* object-fit: contain; */
        border-radius: 10px;
        margin: auto;
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
`;
