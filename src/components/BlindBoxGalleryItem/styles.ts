import { styled, Box } from '@mui/material';

export const ProductImageContainer = styled(Box)<{ param?: boolean }>`
    position: relative;
    img {
        border-radius: 10px;
        width: 100%;
        height: ${({ param }) => (param ? '320px' : '230px')};
    }
`;

export const LikeBtn = styled(Box)`
    position: absolute;
    top: 1vw;
    right: 1vw;
    width: 2.5vw;
    height: 2.5vw;
    // top: 16px;
    // right: 16px;
    // width: 40px;
    // height: 40px;
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
