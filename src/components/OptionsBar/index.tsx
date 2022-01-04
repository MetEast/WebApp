import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import SearchField from '../SearchField';
import SortByButton from '../SortBy';
import { SortOption } from 'src/types/select-types';
import { FilterButton } from './styles';
import { Grid24Filled, GridDots24Filled } from '@fluentui/react-icons';
import { SpacingProps } from '@mui/system';
import { Icon } from '@iconify/react';

interface OptionsBarProps extends SpacingProps {
    sortOptions: SortOption[];
    sortSelected?: SortOption;
    handleSortChange: (value: string) => void;
    handleClickFilterButton: () => void;
    productViewMode: string;
    setProductViewMode: (value: 'grid1' | 'grid2') => void;
    filterBtnHidden?: boolean;
}

const OptionsBar: React.FC<OptionsBarProps> = ({
    sortOptions,
    sortSelected,
    handleSortChange,
    handleClickFilterButton,
    productViewMode,
    setProductViewMode,
    filterBtnHidden = false,
    ...otherProps
}): JSX.Element => {
    return (
        <Stack direction="row" spacing={2} {...otherProps}>
            <SearchField />
            <SortByButton
                options={sortOptions}
                title={sortSelected?.label}
                placeholder="SORT BY"
                handleClick={handleSortChange}
            />
            {!filterBtnHidden && (
                <FilterButton onClick={handleClickFilterButton}>
                    <Icon icon="ph:funnel" fontSize={20} color="#1890FF" style={{ marginRight: 4 }} />
                    {`Filter`}
                </FilterButton>
            )}
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
