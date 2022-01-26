import { styled, Box, Stack } from '@mui/material';

export const GalleryItemContainer = styled(Stack)`
    height: 100%;
    justify-content: space-between;
`;

export const ProductImageContainer = styled(Stack)<{ param: number }>`
    height: 100%;
    cursor: pointer;
    justify-content: center;
    img {
        border-radius: 10px;
        width: 100%;
        height: ${({ param }) => (param ? '320px' : 'auto')};
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
