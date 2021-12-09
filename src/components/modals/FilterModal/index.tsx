import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, TextField, Grid } from '@mui/material';
import { H2Typography, H5Typography } from 'src/core/typographies';
import { enmFilterOption, TypeFilterRange } from 'src/types/filter-types';

export interface IFilterModalProps {
    open: boolean;
    onClose: () => void;
    filters: Array<enmFilterOption>;
    filterRange: TypeFilterRange;
    onDone: (filters: Array<enmFilterOption>, filterRange: TypeFilterRange) => void;
}

const FilterModal: React.FC<IFilterModalProps> = ({
    open,
    filters: _filters,
    filterRange: _filterRange,
    onClose,
    onDone,
}): JSX.Element => {
    const [filters, setFilters] = useState<Array<enmFilterOption>>(_filters);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>(_filterRange);

    useEffect(() => {
        if (open) {
            setFilters(_filters);
            setFilterRange(_filterRange);
        } else {
            clearAll();
        }
    }, [open, _filters, _filterRange]);

    const handleSelectFilter = (filter: enmFilterOption) => {
        if (!filters.includes(filter)) {
            setFilters([...filters, filter]);
        } else {
            setFilters([...filters].filter((item) => item !== filter));
        }
    };

    const getVariant = (filter: enmFilterOption) => {
        if (filters.includes(filter)) return 'contained';

        return 'outlined';
    };

    const handleClickFilter = (filter: enmFilterOption) => () => handleSelectFilter(filter);

    const handleChangeFilterRange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilterRange({ ...filterRange, [field]: value ? parseFloat(value) : undefined });
    };

    const handleClickDone = () => {
        onDone(filters, filterRange);
    };

    const handleClickClearAll = () => {
        clearAll();
    };

    const clearAll = () => {
        setFilters([]);
        setFilterRange({ min: undefined, max: undefined });
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: 500,
                    bgcolor: 'white',
                    boxShadow: 24,
                    pl: 8,
                    pr: 8,
                    pt: 4,
                    pb: 4,
                }}
            >
                <Button variant="outlined" onClick={handleClose}>
                    Back
                </Button>
                <H2Typography mt={3} mb={5.5}>
                    Filters
                </H2Typography>
                <H5Typography>STATUS</H5Typography>
                <Box mt={2}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Button
                                variant={getVariant(enmFilterOption.onAuction)}
                                onClick={handleClickFilter(enmFilterOption.onAuction)}
                                fullWidth
                            >
                                On Auction
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant={getVariant(enmFilterOption.buyNow)}
                                onClick={handleClickFilter(enmFilterOption.buyNow)}
                                fullWidth
                            >
                                Buy Now
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant={getVariant(enmFilterOption.hasBids)}
                                onClick={handleClickFilter(enmFilterOption.hasBids)}
                                fullWidth
                            >
                                Has Bids
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant={getVariant(enmFilterOption.new)}
                                onClick={handleClickFilter(enmFilterOption.new)}
                                fullWidth
                            >
                                New
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <H5Typography mt={5}>PRICE RANGE</H5Typography>
                <Box display="flex" mt={1.25}>
                    <TextField
                        type="number"
                        label="Min"
                        value={filterRange.min ?? ''}
                        onChange={handleChangeFilterRange('min')}
                    />
                    <Box pl={2} pr={2} display="flex" alignItems="center">
                        <H5Typography>to</H5Typography>
                    </Box>
                    <TextField
                        type="number"
                        label="Max"
                        value={filterRange.max ?? ''}
                        onChange={handleChangeFilterRange('max')}
                    />
                </Box>
                <Box mt={10} display="flex" justifyContent="space-between">
                    <Button variant="outlined" onClick={handleClickClearAll}>
                        Clear All
                    </Button>
                    <Button variant="contained" onClick={handleClickDone}>
                        Done
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default FilterModal;
