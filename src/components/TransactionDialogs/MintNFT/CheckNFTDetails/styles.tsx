import { styled, Box } from '@mui/material';

export const ImageBox = styled(Box)`
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 12px;
    }
`;
