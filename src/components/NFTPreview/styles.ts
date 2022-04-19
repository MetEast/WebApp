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
    padding-top: 75%;
`;

export const ImageBox = styled(Box)<{ loading: number }>`
    position: absolute;
    inset: 0;
    /* display: flex; */
    border: ${({ loading }) => (loading ? `0 solid #eeeeee` : `1px solid #eeeeee`)};
    border-radius: 18px;
    overflow: hidden;
    /* box-shadow: 4px 8px 4px -4px rgba(2, 14, 25, 0.2); */
    /* filter: drop-shadow(0px 4px 8px rgba(7, 43, 76, 0.2)); */
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 18px;
        margin: auto;
    }
`;

export const LikeBtnBox = styled(Box)`
    position: absolute;
    top: 12px;
    right: 12px;
    width: 10%;
    padding-top: 10%;
    border-radius: 100%;
    background: #ffffffcc;
    display: none;
    ${(props) => props.theme.breakpoints.up('sm')} {
        display: grid;
    }
`;

export const LikeBtn = styled(Box)`
    position: absolute;
    top: 12px;
    right: 12px;
    width: 48px;
    height: 48px;
    border-radius: 100%;
    background: #ffffffcc;
    display: none;
    place-content: center;

    ${(props) => props.theme.breakpoints.up('sm')} {
        display: grid;
    }
`;
