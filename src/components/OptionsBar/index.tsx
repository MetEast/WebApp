import React, { useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import SearchField from '../SearchField';
import { TypeSelectItem } from 'src/types/select-types';
import { FilterButton, SortByBtn } from './styles';
import { Grid24Filled, GridDots24Filled } from '@fluentui/react-icons';
import { SpacingProps } from '@mui/system';
import { Icon } from '@iconify/react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Select from 'src/components/Select';

interface OptionsBarProps extends SpacingProps {
    handleKeyWordChange: (value: string) => void;
    sortOptions: TypeSelectItem[];
    sortSelected?: TypeSelectItem;
    handleSortChange: (value: string) => void;
    handleClickFilterButton: () => void;
    productViewMode: string;
    setProductViewMode: (value: 'grid1' | 'grid2') => void;
    // filterBtnHidden?: boolean;
}

const OptionsBar: React.FC<OptionsBarProps> = ({
    handleKeyWordChange,
    sortOptions,
    sortSelected,
    handleSortChange,
    handleClickFilterButton,
    productViewMode,
    setProductViewMode,
    // filterBtnHidden = false,
    ...otherProps
}): JSX.Element => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const matchDownLg = useMediaQuery(theme.breakpoints.down('lg'));
    const displayFilterLable = matchDownMd ? false : true;
    const onlyShowIcon = matchDownMd ? true : false;
    const filterBtnHidden = matchDownLg ? false : true;

    const [sortBySelectOpen, isSortBySelectOpen] = useState(false);

    return (
        <Stack direction="row" spacing={{ xs: 1, sm: 2 }} {...otherProps}>
            <SearchField handleChange={handleKeyWordChange} />
            <Select
                titlebox={
                    <SortByBtn fullWidth isopen={sortBySelectOpen ? 1 : 0}>
                        <Icon icon="ph:sort-ascending" fontSize={24} />
                        {!onlyShowIcon && (
                            <>
                                {sortSelected ? sortSelected.label : 'SORT BY'}
                                <Icon icon="ph:caret-down" className="arrow-icon" style={{ marginBottom: 2 }} />
                            </>
                        )}
                    </SortByBtn>
                }
                options={sortOptions}
                isOpen={sortBySelectOpen}
                setIsOpen={isSortBySelectOpen}
                handleClick={handleSortChange}
                // width={260}
                min_width={onlyShowIcon ? 'auto' : 240}
                listitemsbox_width={240}
            />
            {!filterBtnHidden && (
                <FilterButton onClick={handleClickFilterButton}>
                    <Icon icon="ph:funnel" fontSize={20} color="#1890FF" style={{ marginRight: 4 }} />
                    {displayFilterLable && `Filter`}
                </FilterButton>
            )}
            <Box display="flex" borderRadius={3} sx={{ background: '#E8F4FF' }}>
                <Button
                    onClick={() => setProductViewMode('grid2')}
                    sx={{
                        // minWidth: 0,
                        borderRadius: 3,
                        color: productViewMode === 'grid2' ? 'white' : '#1890FF',
                        backgroundColor: productViewMode === 'grid2' ? '#1890FF !important' : '#E8F4FF',
                    }}
                >
                    <GridDots24Filled />
                </Button>
                <Button
                    onClick={() => setProductViewMode('grid1')}
                    sx={{
                        borderRadius: 3,
                        color: productViewMode === 'grid1' ? 'white' : '#1890FF',
                        backgroundColor: productViewMode === 'grid1' ? '#1890FF !important' : '#E8F4FF',
                    }}
                >
                    <Grid24Filled />
                </Button>
            </Box>
        </Stack>
    );
};

export default OptionsBar;
