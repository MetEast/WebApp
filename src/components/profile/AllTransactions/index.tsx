import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { SecondaryButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';
import Select from '../Select';
import { TypeSelectItem } from 'src/types/select-types';

export interface ComponentProps {}

const AllTransactions: React.FC<ComponentProps> = (): JSX.Element => {
    const sortbyOptions: Array<TypeSelectItem> = [
        {
            label: 'Option2',
            value: 'Option2',
        },
        {
            label: 'Option2',
            value: 'Option2',
        },
        {
            label: 'Option2',
            value: 'Option2',
        },
    ];
    const [sortby, setSortby] = React.useState<TypeSelectItem>();
    const handleSortbyChange = (value: string) => {
        const item = sortbyOptions.find((option) => option.value === value);
        setSortby(item);
    };

    return (
        <Stack spacing={5} width={520}>
            <Stack direction="row" justifyContent="space-between">
                <DialogTitleTypo>All Transactions</DialogTitleTypo>
                <Select
                    options={sortbyOptions}
                    selected={sortby}
                    placeholder="Sort by"
                    handleClick={handleSortbyChange}
                    width={160}
                />
            </Stack>
            <Stack spacing={3}></Stack>
            <SecondaryButton fullWidth>Close</SecondaryButton>
        </Stack>
    );
};

export default AllTransactions;
