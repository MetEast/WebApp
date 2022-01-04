import React from 'react';
import { SearchFieldWrapper, SearchTextField } from './styles';
import { Icon } from '@iconify/react';

const SearchField: React.FC = (): JSX.Element => {
    return (
        <SearchFieldWrapper>
            <Icon icon="ph:magnifying-glass" fontSize={24} color="black" />
            <SearchTextField fullWidth placeholder="Search..." />
        </SearchFieldWrapper>
    );
};

export default SearchField;
