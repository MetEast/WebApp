import React from 'react';
import { Stack } from '@mui/material';
import { PrimaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {}

const SearchBlindBoxItems: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={600}>
            SearchBlindBoxItems
        </Stack>
    );
};

export default SearchBlindBoxItems;
