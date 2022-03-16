import React, { useState } from 'react';
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
    Skeleton,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import IconButton from '@mui/material/IconButton';
import { DataTable, PageButton } from './styles';
import Select from 'src/components/Admin/Select';
import { TypeSelectItem } from 'src/types/select-types';
import { Order } from 'src/types/order';
import { Icon } from '@iconify/react';
import { AdminTableItemType, AdminTableColumn } from 'src/types/admin-table-data-types';
import { stableSort, getComparator } from './comparefunc';

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    columns: AdminTableColumn[];
    checkable: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, columns } = props;
    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {props.checkable && (
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
                )}
                {columns.map((column) => (
                    <TableCell key={column.id} sortDirection={orderBy === column.id ? order : false}>
                        <TableSortLabel
                            active={orderBy === column.id}
                            direction={orderBy === column.id ? order : 'asc'}
                            onClick={createSortHandler(column.id)}
                            sx={{
                                width: column.width === undefined ? 120 : column.width,
                                fontSize: 14,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                            }}
                        >
                            {column.label}
                            {orderBy === column.id ? (
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

interface ComponentProps {
    tabledata: AdminTableItemType[];
    columns: AdminTableColumn[];
    checkable?: boolean;
    isLoading?: boolean;
}

const Table: React.FC<ComponentProps> = ({ tabledata, columns, checkable = true, isLoading = true }): JSX.Element => {
    const [page, setPage] = useState(0);
    const [curPaginationFirstPage, setCurPaginationFirstPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<string>('');
    const [selected, setSelected] = useState<readonly number[]>([]);

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

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = tabledata.map((item) => item.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    React.useEffect(() => {
        setCurPaginationFirstPage(Math.floor(page / 10) * 10);
    }, [page]);

    console.log(isLoading);
    return (
        <Stack height="100%">
            <TableContainer component={Paper} sx={{ height: '70%' }}>
                <DataTable aria-label="custom pagination table">
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={tabledata.length}
                        columns={columns}
                        checkable={checkable}
                    />
                    <TableBody>
                        {stableSort(tabledata, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <>
                                        {(isLoading || tabledata.length === 0) ? (
                                            <TableRow style={{ height: 53 * emptyRows }}>
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        ) : (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(event, row.id)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                {checkable && (
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            color="primary"
                                                            checked={isItemSelected}
                                                            inputProps={{
                                                                'aria-labelledby': labelId,
                                                            }}
                                                        />
                                                    </TableCell>
                                                )}
                                                {columns.map((column) => (
                                                    <TableCell sx={{ fontSize: 16, fontWeight: 400 }}>
                                                        {column.cell
                                                            ? column.cell({ value: (row as any)[column.id], data: row })
                                                            : (row as any)[column.id]}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        )}
                                    </>
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
        </Stack>
    );
};

export default Table;
