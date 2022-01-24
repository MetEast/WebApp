import { styled, Typography } from '@mui/material';

export const EmptyTitleGalleryItem = styled(Typography)`
    border-radius: 8px;
    background: #DCDDDF;
    margin: 20px 8px;
    display: grid;
    align-items: center;
    font-size: 2rem;
    line-height: 2rem;
    text-align: center;
    min-height: 320px;
`;

export const EmptyBodyGalleryItem = styled(Typography)`
    padding: 2px 8px;
    margin: 50px 8px 10px 8px;
    display: grid;
    align-items: center;
    font-size: 1rem;
    line-height: 1rem;
    text-align: center;
    min-height: 200px;
`;