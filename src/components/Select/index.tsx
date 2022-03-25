import React from 'react';
import { ListItemsWrapper, ListItemsStack, ItemButton } from './styles';
import { Box, Typography } from '@mui/material';
import { TypeSelectItem } from 'src/types/select-types';
import { Icon } from '@iconify/react';

interface ComponentProps {
    titlebox: React.ReactNode;
    selectedItem?: TypeSelectItem;
    options: Array<TypeSelectItem>;
    isOpen: number;
    width?: number;
    min_width?: number | string;
    listitemsbox_width?: number | string;
    error?: boolean;
    errorText?: string;
    setIsOpen: (value: boolean) => void;
    handleClick: (value: string) => void;
    onMouseLeave?: () => void;
}

const Select: React.FC<ComponentProps> = ({
    titlebox,
    selectedItem,
    options,
    isOpen,
    width,
    min_width,
    listitemsbox_width,
    error,
    errorText,
    setIsOpen,
    handleClick,
    onMouseLeave,
}) => {
    return (
        <Box
            onClick={() => {
                setIsOpen(!isOpen);
            }}
            position="relative"
            sx={{ width: width ? width : 'auto', minWidth: min_width ? min_width : 'auto' }}
            onMouseLeave={onMouseLeave}
        >
            <Box borderRadius={2} overflow="hidden" border={error ? '2px solid #EB5757' : 'none'}>
                {titlebox}
            </Box>
            {error && (
                <Typography fontSize={12} fontWeight={500} color="#EB5757" marginTop={0.5}>
                    {errorText}
                </Typography>
            )}
            <ListItemsWrapper width={listitemsbox_width ? listitemsbox_width : '100%'} isOpen={isOpen}>
                <ListItemsStack>
                    {options.map((item, index) => (
                        <SelectItem
                            key={`sort-option-${index}`}
                            title={item.label}
                            value={item.value}
                            icon={item.icon}
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
    icon?: string;
    selectedValue?: string;
}

const SelectItem: React.FC<SelectItemProps> = ({ title, value, icon, selectedValue, handleClick }) => {
    return (
        <ItemButton
            fullWidth
            selected={value === selectedValue}
            sx={{ fontSize: 14, fontWeight: 500 }}
            onClick={(e) => handleClick(value)}
        >
            {icon && <Icon icon={icon} fontSize={16} style={{ marginRight: 4 }} />}
            {title}
        </ItemButton>
    );
};

export default Select;
