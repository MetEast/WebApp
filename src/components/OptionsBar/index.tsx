import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import SearchField from '../SearchField';
import SortByButton from '../SortBy';
import { SortOption } from 'src/types/select-types';
import { FilterButton } from './styles';
import { ReactComponent as FilterIcon } from '../../assets/icons/filter.svg';
import { Grid24Filled, GridDots24Filled } from '@fluentui/react-icons';

interface OptionsBarProps {
    sortOptions: SortOption[];
    sortSelected?: SortOption;
    handleSortChange: (value: string) => void;
    handleClickFilterButton: () => void;
    productViewMode: string;
    setProductViewMode: (value: 'grid1' | 'grid2') => void;
}

const OptionsBar: React.FC<OptionsBarProps> = ({
    sortOptions,
    sortSelected,
    handleSortChange,
    handleClickFilterButton,
    productViewMode,
    setProductViewMode,
}): JSX.Element => {
    return (
        <Stack direction="row" spacing={2} marginTop={5}>
            <SearchField />
            <SortByButton
                options={sortOptions}
                title={sortSelected?.label}
                placeholder="SORT BY"
                handleClick={handleSortChange}
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
    );
};

export default OptionsBar;
