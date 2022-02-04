import { styled, Box, Stack } from '@mui/material';

export const GalleryItemContainer = styled(Stack)`
    height: 100%;
    justify-content: space-between;
    /* border: 1px solid #eeeeee;
    border-radius: 8px;
    padding: 8px; */
`;

export const ProductImageContainer = styled(Stack)`
    position: relative;
    width: 100%;
    padding-top: 100%;
    cursor: pointer;
`;

export const ImageBox = styled(Box)`
    /* background: #eeeeee; */
    position: absolute;
    inset: 0;
    display: flex;
    border: 1px solid #eeeeee;
    border-radius: 8px;
    padding: 16px;
    /* justify-content: center; */
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
    top: 0.8vw;
    right: 0.8vw;
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
