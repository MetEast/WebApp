import { styled, Table, Button } from '@mui/material';

export const DataTable = styled(Table)({
    '& .MuiTableHead-root': {
        '& .MuiTableCell-root': {
            fontSize: 14,
            fontWeight: 700,
        },
    },
    '& .MuiTableCell-root': {
        // borderWidth: 0,
    },
});

export const PageButton = styled(Button)<{ active: number }>`
    width: 40px;
    min-width: 0;
    height: 40px;
    background: ${({ active }) => (active ? '#1890ff' : 'transparent')};
    color: ${({ active }) => (active ? 'white' : '#1890ff')};
    border-radius: 12px;
    &:hover {
        background: ${({ active }) => (active ? '#28a0ff' : '#E8F4FF')};
    }
`;
