import React, { useState } from 'react';
import { Grid, Stack, Typography, Button } from '@mui/material';
import { Icon } from '@iconify/react';
import { Container, StatusButton } from './styles';
import CustomTextField from 'src/components/TextField';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { filterStatusButtons } from 'src/types/filter-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface ComponentProps {
    changeHandler: (status: number, minPrice: string, maxPrice: string, opened: boolean) => void;
}

const FilterCard: React.FC<ComponentProps> = ({ changeHandler }): JSX.Element => {
    const [status, setStatus] = useState<number>(0);
    const [minPrice, setMinPrice] = useState<string>('0');
    const [maxPrice, setMaxPrice] = useState<string>('0');

    const theme = useTheme();
    const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Container alignItems="flex-start">
            <Typography fontSize={32} fontWeight={700} sx={{ textTransform: 'none' }}>
                Filters
            </Typography>
            <Typography fontSize={16} fontWeight={700} marginTop={3} sx={{ textTransform: 'uppercase' }}>
                Status
            </Typography>
            <Grid container columnSpacing={1} rowGap={1} marginTop={1}>
                {filterStatusButtons.map((item, index) => (
                    <Grid item xs={6} key={`Profile-Optionbar-FilterCard-${index}`}>
                        <StatusButton size="small" selected={index === status} onClick={() => setStatus(index)}>
                            <Icon icon={item.icon} style={{ marginBottom: 2, marginRight: 4 }} />
                            {item.title}
                        </StatusButton>
                    </Grid>
                ))}
            </Grid>
            <Typography fontSize={16} fontWeight={700} marginTop={2} sx={{ textTransform: 'uppercase' }}>
                price Range
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
                <CustomTextField
                    placeholder="Min"
                    number={true}
                    changeHandler={(value: string) => setMinPrice(value)}
                />
                <Typography fontSize={14} fontWeight={400}>
                    to
                </Typography>
                <CustomTextField
                    placeholder="Max"
                    number={true}
                    changeHandler={(value: string) => setMaxPrice(value)}
                />
            </Stack>
            <SecondaryButton
                size="small"
                sx={{ width: 142, background: 'transparent', marginTop: 3, alignSelf: 'center' }}
                onClick={() => {
                    setStatus(0);
                    setMinPrice('');
                    setMaxPrice('');
                    changeHandler(-1, '', '', true);
                }}
            >
                Clear all
            </SecondaryButton>
            <Stack direction="row" alignItems="center" width="100%" spacing={1} marginTop={2}>
                <SecondaryButton
                    size={matchDownSm ? 'small' : undefined}
                    fullWidth
                    onClick={() => {
                        changeHandler(status, minPrice, maxPrice, false);
                    }}
                >
                    close
                </SecondaryButton>
                <PrimaryButton
                    size={matchDownSm ? 'small' : undefined}
                    fullWidth
                    onClick={() => {
                        changeHandler(status, minPrice, maxPrice, true);
                    }}
                >
                    apply
                </PrimaryButton>
            </Stack>
        </Container>
    );
};

export default FilterCard;
