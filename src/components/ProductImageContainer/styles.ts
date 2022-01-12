import { styled, Box } from '@mui/material';

export const Container = styled(Box)`
    position: relative;
    img {
        border-radius: 18px;
        width: 100%;
        // height: calc(100vw / 3);
        height: 100%;
        ${(props) => props.theme.breakpoints.between('xs', 'sm')} {
            // height: calc(100vh / 3);
            height: 100%;
        }
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
