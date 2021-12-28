import React from 'react';
import { SearchFieldWrapper, SearchTextField } from './styles';

const SearchField: React.FC = (): JSX.Element => {
    return (
        <SearchFieldWrapper>
            <img src="/assets/icons/search.svg" width={20} height={20} alt="" />
            <SearchTextField fullWidth placeholder="Search..." />
        </SearchFieldWrapper>
    );
};

export default SearchField;
