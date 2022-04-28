import React, { useState, useEffect } from 'react';
import { SearchFieldWrapper, SearchTextField } from './styles';
import { Icon } from '@iconify/react';
import { SxProps } from '@mui/system';

interface ComponentProps {
    handleChange: (value: string) => void;
    placeholder?: string;
    emptyKeyword?: number;
    setSearchFieldFocus?: (value: boolean) => void;
    sx?: SxProps;
}

const SearchField: React.FC<ComponentProps> = ({
    handleChange,
    placeholder,
    emptyKeyword,
    setSearchFieldFocus,
    sx,
}): JSX.Element => {
    const [keyWord, setKeyWord] = useState('');

    const handleChangeKeyWord = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setKeyWord(value);
        if (setSearchFieldFocus) setSearchFieldFocus(true);
    };

    const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.which === 13) {
            // press enter
            handleChange(keyWord);
            if (setSearchFieldFocus) setSearchFieldFocus(false);
        }
    };

    useEffect(() => {
        setKeyWord('');
    }, [emptyKeyword]);

    return (
        <SearchFieldWrapper sx={{ ...sx }}>
            <Icon icon="ph:magnifying-glass" fontSize={24} color="black" />
            <SearchTextField
                fullWidth
                value={keyWord}
                onChange={handleChangeKeyWord}
                onKeyPress={handleEnterKey}
                onFocus={() => {
                    if (setSearchFieldFocus) setSearchFieldFocus(true);
                }}
                onBlur={() => {
                    if (setSearchFieldFocus) setSearchFieldFocus(false);
                }}
                placeholder={placeholder === undefined ? 'Search...' : placeholder}
                sx={{ minWidth: 0 }}
            />
        </SearchFieldWrapper>
    );
};

export default SearchField;
