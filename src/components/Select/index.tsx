import React from 'react';
import { ListItemsWrapper } from './styles';
import { Box, Button, Stack } from '@mui/material';
import { TypeSelectItem } from 'src/types/select-types';

interface ComponentProps {
    titlebox: React.ReactNode;
    options: Array<TypeSelectItem>;
    isOpen: number;
    width?: number;
    min_width?: number | string;
    listitemsbox_width?: number | string;
    setIsOpen: (value: boolean) => void;
    handleClick: (value: string) => void;
}

const Select: React.FC<ComponentProps> = ({
    titlebox,
    options,
    isOpen,
    width,
    min_width,
    listitemsbox_width,
    setIsOpen,
    handleClick,
}) => {
    return (
        <Box
            onClick={() => {
                setIsOpen(!isOpen);
            }}
            position="relative"
            sx={{ width: width ? width : 'auto', minWidth: min_width ? min_width : 'auto' }}
        >
            {titlebox}
            <ListItemsWrapper width={listitemsbox_width ? listitemsbox_width : '100%'} isOpen={isOpen}>
                <Stack borderRadius={3} overflow="hidden" sx={{ background: '#F8F8F8' }}>
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
    return (
        <Button sx={{ fontSize: 14, fontWeight: 500 }} onClick={(e) => handleClick(value)}>
            {title}
        </Button>
    );
};

export default Select;
