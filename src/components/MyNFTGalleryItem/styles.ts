import { styled, Stack, Box } from '@mui/material';

export const GalleryItemContainer = styled(Stack)`
    height: 100%;
    justify-content: space-between;
`;

export const ProductImageContainer = styled(Stack)`
    position: relative;
    width: 100%;
    padding-top: 75%;
    cursor: pointer;
`;

export const ImageBox = styled(Box)<{ loading: number }>`
    position: absolute;
    inset: 0;
    border: ${({ loading }) => (loading ? `0 solid #eeeeee` : `1px solid #eeeeee`)};
    border-radius: 18px;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 18px;
        margin: auto;
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
