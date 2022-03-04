import React, { useState } from 'react';
import { SearchFieldWrapper, SearchTextField } from './styles';
import { Icon } from '@iconify/react';
import { SxProps } from '@mui/system';

interface ComponentProps {
    handleChange: (value: string) => void;
    placeholder?: string;
    sx?: SxProps;
}

const SearchField: React.FC<ComponentProps> = ({ handleChange, placeholder, sx }): JSX.Element => {
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
        <SearchFieldWrapper sx={{ ...sx }}>
            <Icon icon="ph:magnifying-glass" fontSize={24} color="black" />
            <SearchTextField
                fullWidth
                value={keyWord}
                onChange={handleChangeKeyWord}
                onKeyPress={handleEnterKey}
                placeholder={placeholder === undefined ? 'Search...' : placeholder}
                sx={{ minWidth: 0 }}
            />
        </SearchFieldWrapper>
    );
};

export default SearchField;
