import React from 'react';
import { ListItemsWrapper, ListItemsStack, ItemButton } from './styles';
import { Box } from '@mui/material';
import { TypeSelectItem } from 'src/types/select-types';

interface ComponentProps {
    titlebox: React.ReactNode;
    selectedItem?: TypeSelectItem;
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
    selectedItem,
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
                <ListItemsStack>
                    {options.map((item, index) => (
                        <SelectItem
                            key={`sort-option-${index}`}
                            title={item.label}
                            value={item.value}
                            selectedValue={selectedItem?.value}
                            handleClick={handleClick}
                        />
                    ))}
                </ListItemsStack>
            </ListItemsWrapper>
        </Box>
    );
};

interface SelectItemProps {
    handleClick: (value: string) => void;
    title: string;
    value: string;
    selectedValue?: string;
}

const SelectItem: React.FC<SelectItemProps> = ({ title, value, selectedValue, handleClick }) => {
    return (
        <ItemButton
            fullWidth
            selected={value === selectedValue}
            sx={{ fontSize: 14, fontWeight: 500 }}
            onClick={(e) => handleClick(value)}
        >
            {title}
        </ItemButton>
    );
};

export default Select;
