import { styled, Box } from '@mui/material';

export const Container = styled(Box)<{ saleStatus: string }>`
    width: fit-content;
    border-radius: 8px;
    padding: 6px 8px;
    font-size: 14px;
    font-weight: 500;
`;
