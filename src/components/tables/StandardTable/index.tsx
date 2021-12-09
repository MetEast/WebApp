import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material';

export interface IStandardTableProps {
    titles: Array<string>;
    rows: Array<Array<string | number | null | undefined>>;
}

const StyledTableCell = styled(TableCell)`
    font-size: 0.75rem;
    border-bottom: unset;
    padding-bottom: 8px;
`;

const StandardTable: React.FC<IStandardTableProps> = ({ titles, rows }): JSX.Element => {
    return (
        <TableContainer component={Paper} sx={{ boxShadow: 'unset' }}>
            <Table size="small" padding="none">
                <TableHead>
                    <TableRow>
                        {titles.map((title, index) => (
                            <StyledTableCell key={`table-head-${index}`}>{title}</StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={`table-row-${index}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            {row.map((cell, index) => (
                                <StyledTableCell key={`table-cell-${index}`}>{cell}</StyledTableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default StandardTable;
