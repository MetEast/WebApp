import { styled, Table } from '@mui/material';

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
