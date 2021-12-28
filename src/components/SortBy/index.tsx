import React, { useState } from 'react';
import { SortByBtn, ListItemsWrapper } from './styles';
import { Box, Button, Stack } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface SelectProps {
    options: { label: string; value: string }[];
    title?: string;
    placeholder?: string;
    handleClick: (value: string) => void;
}

const SortByButton: React.FC<SelectProps> = ({ options, title, placeholder = '', handleClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box
            width={200}
            onClick={() => {
                setIsOpen(!isOpen);
            }}
        >
            <SortByBtn fullWidth isOpen={isOpen}>
                <img src="/assets/icons/sortby.svg" alt="" />
                {title ? title : placeholder}
                <KeyboardArrowDownIcon className="arrow-icon" />
            </SortByBtn>
            <ListItemsWrapper width={200} isOpen={isOpen}>
                <Stack>
                    {options.map((item, index) => (
                        <SelectItem
                            key={`sort-option-${index}`}
                            title={item.label}
                            value={item.value}
                            handleClick={handleClick}
                        />
                    ))}
                </Stack>
            </ListItemsWrapper>
        </Box>
    );
};

interface SelectItemProps {
    handleClick: (value: string) => void;
    title: string;
    value: string;
}

const SelectItem: React.FC<SelectItemProps> = ({ title, value, handleClick }) => {
    return <Button onClick={(e) => handleClick(value)}>{title}</Button>;
};

export default SortByButton;
