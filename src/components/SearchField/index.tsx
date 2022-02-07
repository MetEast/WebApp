import React, { useState } from 'react';
import { SearchFieldWrapper, SearchTextField } from './styles';
import { Icon } from '@iconify/react';

interface SearchFieldProps {
    handleChange: (value: string) => void;
}

const SearchField: React.FC<SearchFieldProps> = ({ handleChange }): JSX.Element => {
    const [keyWord, setKeyWord] = useState('');

    const handleChangeKeyWord = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setKeyWord(value);
    };

    const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.which === 13) {
            // press enter
            handleChange(keyWord);
        }
    };

    return (
        <SearchFieldWrapper>
            <Icon icon="ph:magnifying-glass" fontSize={24} color="black" />
            <SearchTextField
                fullWidth
                value={keyWord}
                onChange={handleChangeKeyWord}
                onKeyPress={handleEnterKey}
                placeholder="Search..."
                sx={{ minWidth: 0 }}
            />
        </SearchFieldWrapper>
    );
};

export default SearchField;
