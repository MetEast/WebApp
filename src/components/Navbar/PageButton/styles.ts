import { styled, Button, Typography } from '@mui/material';

export const PageBtn = styled(Button)<{ selected: boolean }>`
    height: 40px;
    min-width: 40px;
    border-radius: 8px;
    color: ${({ selected }) => (selected ? '#1890FF' : 'black')};
    background: ${({ selected }) => (selected ? '#E8F4FF' : 'transparent')};
    &:hover {
        background: #e8f4ff;
    }
`;

export const MenuItemTypography = styled(Typography)<{ selected: boolean }>`
    color: ${({ selected }) => (selected ? '#1890FF' : 'black')};
    font-weight: 500;
    font-size: 14px;
    line-height: 14px;
    text-transform: capitalize;
`;
