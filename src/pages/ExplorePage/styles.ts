import { styled, Typography, Button } from '@mui/material';

export const FilterItemTypography = styled(Typography)`
    border: 1px solid var(--color-base);
    color: var(--color-base);
    border-radius: 8px;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 2px;
    padding-bottom: 2px;
    margin-left: 8px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    line-height: 1rem;
`;

export const FilterButton = styled(Button)`
    background: #e8f4ff;
    padding: 8px 20px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    color: #1890ff;
`;

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
`;