import { Grid24Filled, GridDots24Filled, DismissCircle24Filled } from '@fluentui/react-icons';
import {
    TextField,
    Box,
    Grid,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import React, { useState } from 'react';
import FilterModal from 'src/components/modals/FilterModal';
import Product from 'src/components/Product';
import { dummyProducts } from 'src/constants/dummyData';
import { enmFilterOption, TypeFilterRange } from 'src/types/filter-types';
import { filterOptions } from 'src/constants/filter-constants';
import { enmSortOptionValues, sortOptions } from 'src/constants/select-constants';
import { H2Typography } from 'src/core/typographies';
import { TypeProduct } from 'src/types/product-types';
import { FilterItemTypography } from './styledComponents';

const ExplorePage: React.FC = (): JSX.Element => {
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid1');
    const [sortBy, setSortBy] = useState<string>(enmSortOptionValues.low_to_high);
    const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<Array<enmFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });

    const productList: Array<TypeProduct> = dummyProducts;

    const handleChangeSortBy = (e: SelectChangeEvent) => {
        setSortBy(e.target.value);
    };

    const handleCloseFilterModal = () => {
        setFilterModalOpen(false);
    };

    const handleClickFilterButton = () => {
        setFilterModalOpen(true);
    };

    const handleDoneFilterModal = (filters: Array<enmFilterOption>, filterRange: TypeFilterRange) => {
        setFilters(filters);
        setFilterRange(filterRange);
        setFilterModalOpen(false);
    };

    const handleClickFilterItem = (filter: enmFilterOption) => () => {
        if (filters.includes(filter)) setFilters([...filters.filter((item) => item !== filter)]);
    };

    return (
        <>
            <H2Typography mb={3.5}>Explore</H2Typography>

            <Box display="flex">
                <TextField label="Search" fullWidth />
                <Box display="flex" alignItems="center">
                    <Box ml={2}>
                        <Button
                            onClick={() => setProductViewMode('grid1')}
                            sx={{ color: productViewMode === 'grid1' ? 'var(--color-base)' : 'black' }}
                        >
                            <Grid24Filled />
                        </Button>
                    </Box>
                    <Box>
                        <Button
                            onClick={() => setProductViewMode('grid2')}
                            sx={{ color: productViewMode === 'grid2' ? 'var(--color-base)' : 'black' }}
                        >
                            <GridDots24Filled />
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Box mt={2}>
                <FormControl fullWidth>
                    <InputLabel id="sort-select-label">Sort By</InputLabel>
                    <Select
                        labelId="sort-select-label"
                        id="sort-select"
                        value={sortBy}
                        label="Sort By"
                        onChange={handleChangeSortBy}
                    >
                        {sortOptions.map((item, index) => (
                            <MenuItem key={`sort-option-${index}`} value={item.value}>
                                {item.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box display="flex" mt={3}>
                {filters.map((item, index) => (
                    <FilterItemTypography key={`filter-option-${index}`} onClick={handleClickFilterItem(item)}>
                        {filterOptions[item]} <DismissCircle24Filled style={{ display: 'flex', marginLeft: '4px' }} />
                    </FilterItemTypography>
                ))}
            </Box>

            <Grid container mt={2.5} spacing={3}>
                {productList.map((item, index) => (
                    <Grid item xs={productViewMode === 'grid1' ? 12 : 6} key={`explore-product-${index}`}>
                        <Product product={item} />
                    </Grid>
                ))}
            </Grid>
            <Box width="100%" ml={-4} mb={2} position="fixed" bottom="100px" textAlign="center" maxWidth="800px">
                <Button variant="contained" onClick={handleClickFilterButton}>
                    Filters ({filters.length})
                </Button>
            </Box>

            <FilterModal
                open={filterModalOpen}
                onClose={handleCloseFilterModal}
                filters={filters}
                filterRange={filterRange}
                onDone={handleDoneFilterModal}
            />
        </>
    );
};

export default ExplorePage;
