import React, { useState, useMemo } from 'react';
import {
    Box,
    Stack,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableFooter,
    TablePagination,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import ELAPrice from 'src/components/ELAPrice';
import { DataTable } from './styles';

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                <FirstPageIcon />
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                <KeyboardArrowRight />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                <LastPageIcon />
            </IconButton>
        </Box>
    );
}

const AdminNFTs: React.FC = (): JSX.Element => {
    const makeData = (lens: number) =>
        [...Array(lens).keys()].map((item, index) => ({
            rulenumber: String(item + 1).padStart(5, '0'),
            nftid: String(item + 1).padStart(5, '0'),
            nfttitle: 'NFT Title',
            state: 'online',
            classification: 'Blind Box',
            original_price: 199,
            original_owner: 'Nickname',
        }));

    const tabledata = useMemo(() => makeData(300), []);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tabledata.length) : 0;

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            <TableContainer component={Paper}>
                <DataTable aria-label="custom pagination table">
                    <TableHead>
                        <TableRow sx={{ textTransform: 'uppercase' }}>
                            <TableCell>Rule Number</TableCell>
                            <TableCell>NFT ID</TableCell>
                            <TableCell>NFT Title</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Classification</TableCell>
                            <TableCell>Original Price</TableCell>
                            <TableCell>original owner</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? tabledata.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : tabledata
                        ).map((data) => (
                            <TableRow key={data.nftid}>
                                <TableCell component="th" scope="row">
                                    {data.rulenumber}
                                </TableCell>
                                <TableCell>{data.nftid}</TableCell>
                                <TableCell>{data.nfttitle}</TableCell>
                                <TableCell>{data.state}</TableCell>
                                <TableCell>{data.classification}</TableCell>
                                <TableCell>{data.original_price}</TableCell>
                                <TableCell>{data.original_owner}</TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={tabledata.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </DataTable>
            </TableContainer>
        </Box>
    );
};

export default AdminNFTs;
