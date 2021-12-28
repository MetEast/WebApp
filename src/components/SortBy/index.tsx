import React, { useState } from 'react';
import { SortByBtn, ListItemsWrapper } from './styles';
import { Box, Button, Stack } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface SelectProps {
    title?: string;
    children: React.ReactElement<SelectItemProps> | React.ReactElement<SelectItemProps>[];
    placeholder?: string;
}

const SortByButton: React.FC<SelectProps> = ({ title, children, placeholder = '' }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box
            width="auto"
            minWidth={200}
            onClick={() => {
                setIsOpen(!isOpen);
            }}
        >
            <SortByBtn fullWidth isOpen={isOpen}>
                <img src="/assets/icons/sortby.svg" alt="" />
                {title ? title : placeholder}
                <KeyboardArrowDownIcon className="arrow-icon" />
            </SortByBtn>
            <ListItemsWrapper isOpen={isOpen}>
                <Stack>{children}</Stack>
            </ListItemsWrapper>
        </Box>
    );
};

interface SelectItemProps {
    handleClick: (idx: string) => void;
    title: string;
    value: string;
}

export const SelectItem: React.FC<SelectItemProps> = ({ title, value, handleClick }) => {
    return <Button onClick={(e) => handleClick(value)}>{title}</Button>;
};

export default SortByButton;
