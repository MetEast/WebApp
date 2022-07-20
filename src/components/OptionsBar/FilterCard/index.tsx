import React, { useEffect, useState } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { Container, SelectBtn } from './styles';
import CustomTextField from 'src/components/TextField';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { filterStatusButtons } from 'src/types/filter-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import Select from 'src/components/Select';
import { TypeSelectItem } from 'src/types/select-types';
import { mintNFTCategoryOptions } from 'src/constants/select-constants';

interface ComponentProps {
    changeHandler: (
        status: number,
        minPrice: string,
        maxPrice: string,
        category: TypeSelectItem | undefined,
        opened: boolean,
    ) => void;
    clearOption: boolean;
}

const FilterCard: React.FC<ComponentProps> = ({ changeHandler, clearOption }): JSX.Element => {
    const location = useLocation();
    const [status, setStatus] = useState<number>(-1);
    const [minPrice, setMinPrice] = useState<string>();
    const [maxPrice, setMaxPrice] = useState<string>();

    const theme = useTheme();
    const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));

    const [category, setCategory] = useState<TypeSelectItem>();
    const [categorySelectOpen, setCategorySelectOpen] = useState(false);

    const isBlindBoxPage: boolean = location.pathname.indexOf('/blind-box') !== -1;

    useEffect(() => {
        if (clearOption) {
            setStatus(-1);
            setMinPrice('');
            setMaxPrice('');
            setCategory(undefined);
            changeHandler(-1, '', '', undefined, true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clearOption]);

    return (
        <Container sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
            <Typography fontSize={32} fontWeight={700} sx={{ textTransform: 'none' }}>
                Filters
            </Typography>
            {!isBlindBoxPage && (
                <>
                    <Typography fontSize={16} fontWeight={700} marginTop={3} sx={{ textTransform: 'uppercase' }}>
                        Status
                    </Typography>
                    <Grid container columnSpacing={1} rowGap={1} marginTop={1}>
                        {filterStatusButtons.map((item, index) => (
                            <Grid item xs={6} key={`Profile-Optionbar-FilterCard-${index}`}>
                                <PrimaryButton
                                    size="small"
                                    fullWidth
                                    btn_color={index === status ? 'primary' : 'secondary'}
                                    sx={{ fontSize: { xs: 14, sm: 16 } }}
                                    onClick={() => setStatus(index)}
                                >
                                    <Icon icon={item.icon} style={{ marginBottom: 2, marginRight: 4 }} />
                                    {item.title}
                                </PrimaryButton>
                            </Grid>
                        ))}
                    </Grid>
                    <Stack spacing={0.5} marginTop={1}>
                        <Typography fontSize={16} fontWeight={700}>
                            CATEGORY
                        </Typography>
                        <Select
                            titlebox={
                                <SelectBtn fullWidth isopen={categorySelectOpen ? 1 : 0}>
                                    {category ? category.label : 'Select'}
                                    <Icon icon="ph:caret-down" className="arrow-icon" />
                                </SelectBtn>
                            }
                            selectedItem={category}
                            options={mintNFTCategoryOptions}
                            isOpen={categorySelectOpen ? 1 : 0}
                            handleClick={(value: string) => {
                                const item = mintNFTCategoryOptions.find((option) => option.value === value);
                                setCategory(item);
                            }}
                            setIsOpen={setCategorySelectOpen}
                        />
                    </Stack>
                </>
            )}
            <Typography fontSize={16} fontWeight={700} marginTop={2} sx={{ textTransform: 'uppercase' }}>
                price Range
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
                <CustomTextField
                    placeholder="Min"
                    number={true}
                    sx={{ width: '100%' }}
                    inputValue={minPrice}
                    changeHandler={(value: string) => setMinPrice(value)}
                />
                <Typography fontSize={14} fontWeight={400} sx={{ wordBreak: 'normal' }}>
                    to
                </Typography>
                <CustomTextField
                    placeholder="Max"
                    number={true}
                    sx={{ width: '100%' }}
                    inputValue={maxPrice}
                    changeHandler={(value: string) => setMaxPrice(value)}
                />
            </Stack>
            <PrimaryButton
                size="small"
                btn_color="none"
                sx={{ width: 142, marginTop: 3, alignSelf: 'center' }}
                onClick={() => {
                    setStatus(-1);
                    setMinPrice('');
                    setMaxPrice('');
                    setCategory(undefined);
                }}
            >
                Clear all
            </PrimaryButton>
            <Stack direction="row" alignItems="center" width="100%" spacing={1} marginTop={2}>
                <PrimaryButton
                    size={matchDownSm ? 'small' : undefined}
                    btn_color="secondary"
                    fullWidth
                    onClick={() => {
                        changeHandler(
                            status,
                            minPrice === undefined ? '' : minPrice,
                            maxPrice === undefined ? '' : maxPrice,
                            category,
                            false,
                        );
                    }}
                >
                    close
                </PrimaryButton>
                <PrimaryButton
                    size={matchDownSm ? 'small' : undefined}
                    fullWidth
                    onClick={() => {
                        changeHandler(
                            status,
                            minPrice === undefined ? '' : minPrice,
                            maxPrice === undefined ? '' : maxPrice,
                            category,
                            true,
                        );
                    }}
                >
                    apply
                </PrimaryButton>
            </Stack>
        </Container>
    );
};

export default FilterCard;
