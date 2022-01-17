import React, { useState, useMemo } from 'react';
import {
    Box,
    Stack,
    TableContainer,
    Paper,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Checkbox,
    TableSortLabel,
    Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import ELAPrice from 'src/components/ELAPrice';
import { DataTable, PageButton } from './styles';
import Select from 'src/components/Admin/Select';
import { TypeSelectItem } from 'src/types/select-types';
import { Icon } from '@iconify/react';

interface Data {
    rulenumber: string;
    nftid: string;
    nfttitle: string;
    state: string;
    classification: string;
    original_price: number;
    original_owner: string;
}

interface HeadCell {
    id: keyof Data;
    label: string;
}

type Order = 'asc' | 'desc';

const createData = (
    rulenumber: string,
    nftid: string,
    nfttitle: string,
    state: string,
    classification: string,
    original_price: number,
    original_owner: string,
): Data => ({
    rulenumber,
    nftid,
    nfttitle,
    state,
    classification,
    original_price,
    original_owner,
});

const headCells: readonly HeadCell[] = [
    {
        id: 'rulenumber',
        label: 'Rule Number',
    },
    {
        id: 'nftid',
        label: 'NFT ID',
    },
    {
        id: 'nfttitle',
        label: 'NFT Title',
    },
    {
        id: 'state',
        label: 'State',
    },
    {
        id: 'classification',
        label: 'Classification',
    },
    {
        id: 'original_price',
        label: 'Original Price',
    },
    {
        id: 'original_owner',
        label: 'original owner',
    },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const AdminNFTs: React.FC = (): JSX.Element => {
    const makeData = (lens: number) =>
        [...Array(lens).keys()].map((item) =>
            createData(
                String(item + 1).padStart(5, '0'),
                String(item + 1).padStart(5, '0'),
                'NFT Title',
                'online',
                'Blind Box',
                199,
                'Nickname',
            ),
        );

    const tabledata: Data[] = useMemo(() => makeData(278), []);

    const [page, setPage] = useState(0);
    const [curPaginationFirstPage, setCurPaginationFirstPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Data>('rulenumber');
    const [selected, setSelected] = useState<readonly string[]>([]);

    const rowsPerPageOptions: Array<TypeSelectItem> = [
        {
            label: '5 art./page',
            value: '5',
        },
        {
            label: '10 art./page',
            value: '10',
        },
        {
            label: '25 art./page',
            value: '25',
        },
    ];

    const totalPages = Math.ceil(tabledata.length / rowsPerPage);

    const setCurPage = (page: number) => {
        if (page < 0 || page >= totalPages) return;
        setPage(page);
    };

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(parseInt(value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tabledata.length) : 0;

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = tabledata.map((item) => item.nftid);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, nftid: string) => {
        const selectedIndex = selected.indexOf(nftid);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, nftid);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const isSelected = (nftid: string) => selected.indexOf(nftid) !== -1;

    React.useEffect(() => {
        setCurPaginationFirstPage(Math.floor(page / 10) * 10);
    }, [page]);

    return (
        <Box>
            <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
                <DataTable aria-label="custom pagination table">
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={tabledata.length}
                    />
                    <TableBody>
                        {stableSort(tabledata, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const isItemSelected = isSelected(row.nftid);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.nftid)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        key={row.nftid}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.rulenumber}
                                        </TableCell>
                                        <TableCell>{row.nftid}</TableCell>
                                        <TableCell>{row.nfttitle}</TableCell>
                                        <TableCell>{row.state}</TableCell>
                                        <TableCell>{row.classification}</TableCell>
                                        <TableCell>{row.original_price}</TableCell>
                                        <TableCell>{row.original_owner}</TableCell>
                                    </TableRow>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </DataTable>
            </TableContainer>
            <Stack direction="row" alignItems="center" justifyContent="space-between" marginTop={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box width={200}>
                        <Select
                            options={rowsPerPageOptions}
                            selected={rowsPerPage}
                            handleClick={handleRowsPerPageChange}
                        />
                    </Box>
                    <Typography fontSize={14} fontWeight={400}>{`Tot.${tabledata.length}`}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                        onClick={() => {
                            setCurPage(curPaginationFirstPage - 1);
                        }}
                    >
                        <Icon icon="ph:caret-left-bold" color="#1890FF" />
                    </IconButton>
                    {[...Array(10).keys()].map((item) => {
                        let pagenum = curPaginationFirstPage + item;
                        let enable = pagenum < totalPages;
                        let active = pagenum === page;
                        return (
                            <PageButton
                                active={active}
                                onClick={() => {
                                    setCurPage(pagenum);
                                }}
                                sx={{ display: enable ? 'auto' : 'none' }}
                            >
                                {pagenum + 1}
                            </PageButton>
                        );
                    })}
                    <IconButton
                        onClick={() => {
                            setCurPage(curPaginationFirstPage + 10);
                        }}
                    >
                        <Icon icon="ph:caret-right-bold" color="#1890FF" />
                    </IconButton>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography fontSize={14} fontWeight={400}>
                        page
                    </Typography>
                    <Typography
                        fontSize={14}
                        fontWeight={400}
                        paddingX={2}
                        paddingY={1}
                        borderRadius={3}
                        sx={{ background: '#F0F1F2' }}
                    >
                        {page + 1}
                    </Typography>
                    <Typography fontSize={14} fontWeight={400}>
                        {`/ ${totalPages}`}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
};

export default AdminNFTs;
