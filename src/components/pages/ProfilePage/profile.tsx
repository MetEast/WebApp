import { DismissCircle24Filled } from '@fluentui/react-icons';
import { Box, Grid, Typography, Stack } from '@mui/material';
import React, { useState } from 'react';
import FilterModal from 'src/components/modals/FilterModal';
import Product from 'src/components/Product';
import OptionsBar from 'src/components/OptionsBar';
import { dummyProducts } from 'src/constants/dummyData';
import { enmFilterOption, TypeFilterRange } from 'src/types/filter-types';
import { filterOptions } from 'src/constants/filter-constants';
import { sortOptions } from 'src/constants/select-constants';
import { nftGalleryFilterBtnTypes, nftGalleryFilterButtons } from 'src/constants/nft-gallery-filter-buttons';
import { SortOption } from 'src/types/select-types';
import { TypeProduct } from 'src/types/product-types';
import { FilterItemTypography, FilterButton, ProfileImageWrapper, ProfileImage } from './styles';
import { Swiper, SwiperSlide } from 'swiper/react';

const PrivateProfilePage: React.FC = (): JSX.Element => {
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid2');
    const [sortBy, setSortBy] = useState<SortOption>();
    const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<Array<enmFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [nftGalleryFilterBtnSelected, setNftGalleryFilterBtnSelected] = useState<nftGalleryFilterBtnTypes>(
        nftGalleryFilterBtnTypes.All,
    );

    const productList: Array<TypeProduct> = dummyProducts;
    const nftGalleryFilterButtonsList = nftGalleryFilterButtons;

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
            <ProfileImageWrapper>
                <ProfileImage src="https://miro.medium.com/focal/58/58/50/50/0*sViPWB4sXg5xE1TT" />
            </ProfileImageWrapper>
            <Stack direction="row" justifyContent="space-between" marginTop={-6}>
                <Box>
                    <Typography fontSize={20} fontWeight={900}>
                        420.00 ELA
                    </Typography>
                    <Typography fontSize={16} fontWeight={400}>
                        Total Earned
                    </Typography>
                </Box>
                <Box>
                    <Typography fontSize={20} fontWeight={900}>
                        6.80 ELA
                    </Typography>
                    <Typography fontSize={16} fontWeight={400}>
                        Earned Today
                    </Typography>
                </Box>
            </Stack>
            <Typography fontSize={42} fontWeight={700}>
                your NFTs
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2} marginTop={1}>
                <Stack direction="row" spacing={1}>
                    {nftGalleryFilterButtonsList.map((items) => (
                        <FilterButton
                            selected={items.label === nftGalleryFilterBtnSelected}
                            onClick={() => setNftGalleryFilterBtnSelected(items.label)}
                        >
                            {items.label}
                            <p>{items.value}</p>
                        </FilterButton>
                    ))}
                </Stack>
                <OptionsBar
                    sortOptions={sortOptions}
                    sortSelected={sortBy}
                    handleSortChange={handleChangeSortBy}
                    handleClickFilterButton={handleClickFilterButton}
                    productViewMode={productViewMode}
                    setProductViewMode={setProductViewMode}
                    filterBtnHidden
                />
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

export default PrivateProfilePage;
