import { styled, Button } from '@mui/material';

export const SaleTypeButton = styled(Button)<{ selected: boolean }>`
    height: 40px;
    background: ${({ selected }) => (selected ? '#E8F4FF' : 'transparent')};
    color: ${({ selected }) => (selected ? '#1890FF' : '#0A0B0C')};
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    &:hover {
        background: #d8e4ff;
    }
`;
