import { styled, Box } from '@mui/material';

export const ProfileImageWrapper = styled(Box)`
    align-self: center;
    display: grid;
    place-content: center;
    position: relative;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    overflow: hidden;
    background: #e8f4ff;
`;

export const ProfileImage = styled('img')`
    width: 100%;
    height: 100%;
    background: white;
`;
