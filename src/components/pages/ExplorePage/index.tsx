import { Grid24Filled, GridDots24Filled, DismissCircle24Filled } from '@fluentui/react-icons';
import { Box, Grid, Button, Stack } from '@mui/material';
import React, { useState } from 'react';
import FilterModal from 'src/components/modals/FilterModal';
import Product from 'src/components/Product';
import { dummyProducts } from 'src/constants/dummyData';
import { enmFilterOption, TypeFilterRange } from 'src/types/filter-types';
import { filterOptions } from 'src/constants/filter-constants';
import { sortOptions } from 'src/constants/select-constants';
import { SortOption } from 'src/types/select-types';
import { TypeProduct } from 'src/types/product-types';
import { FilterItemTypography, FilterButton } from './styles';
import SearchField from '../../SearchField';
import SortByButton from '../../SortBy';
import { ReactComponent as FilterIcon } from '../../../assets/icons/filter.svg';
import { Swiper, SwiperSlide } from 'swiper/react';

const ExplorePage: React.FC = (): JSX.Element => {
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid1');
    const [sortBy, setSortBy] = useState<SortOption>();
    const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<Array<enmFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });

    const productList: Array<TypeProduct> = dummyProducts;

    const handleChangeSortBy = (value: string) => {
        const item = sortOptions.find((option) => option.value === value);
        setSortBy(item);
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
            <Box>
                <Swiper autoplay={{ delay: 5000 }} spaceBetween={8}>
                    {productList.map((product, index) => (
                        <SwiperSlide key={`banner-carousel-${index}`}>
                            <Product product={product} onlyShowImage />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
            <Stack direction="row" spacing={2} marginTop={5}>
                <SearchField />
                <SortByButton
                    options={sortOptions}
                    title={sortBy?.label}
                    placeholder="SORT BY"
                    handleClick={handleChangeSortBy}
                />
                <FilterButton onClick={handleClickFilterButton}>
                    <FilterIcon width={18} height={18} fill="#1890FF" />
                    {`Filter`}
                </FilterButton>
                <Box display="flex" borderRadius={3} overflow="hidden" sx={{ background: '#E8F4FF' }}>
                    <Button
                        onClick={() => setProductViewMode('grid1')}
                        sx={{
                            borderRadius: 3,
                            color: productViewMode === 'grid1' ? 'white' : 'var(--color-base)',
                            background: productViewMode === 'grid1' ? '#1890FF' : 'auto',
                        }}
                    >
                        <Grid24Filled />
                    </Button>
                    <Button
                        onClick={() => setProductViewMode('grid2')}
                        sx={{
                            borderRadius: 3,
                            color: productViewMode === 'grid2' ? 'white' : 'var(--color-base)',
                            background: productViewMode === 'grid2' ? '#1890FF' : 'auto',
                        }}
                    >
                        <GridDots24Filled />
                    </Button>
                </Box>
            </Stack>
            <Box display="flex" mt={3}>
                {filters.map((item, index) => (
                    <FilterItemTypography key={`filter-option-${index}`} onClick={handleClickFilterItem(item)}>
                        {filterOptions[item]} <DismissCircle24Filled style={{ display: 'flex', marginLeft: '4px' }} />
                    </FilterItemTypography>
                ))}
            </Box>
            <Grid container mt={2} spacing={4}>
                {productList.map((item, index) => (
                    <Grid item xs={productViewMode === 'grid1' ? 6 : 3} key={`explore-product-${index}`}>
                        <Product product={item} />
                    </Grid>
                ))}
            </Grid>
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
