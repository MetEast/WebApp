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

export const PageButton = styled(Button)`
    width: 40px;
    min-width: 0;
    height: 40px;
    background: #1890ff;
    color: white;
    border-radius: 12px;
    &:hover {
        background: #28a0ff;
    }
`;
