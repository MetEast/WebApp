import React, { useState } from 'react';
import { SelectBtn, ListItemsWrapper } from './styles';
import { Box, Button, Stack } from '@mui/material';
import { Icon } from '@iconify/react';
import { TypeSelectItem } from 'src/types/select-types';

interface ComponentProps {
    options: Array<TypeSelectItem>;
    selected?: TypeSelectItem;
    placeholder?: string;
    handleClick: (value: string) => void;
}

const SortSelect: React.FC<ComponentProps> = ({ options, selected, placeholder = '', handleClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box
            onClick={() => {
                setIsOpen(!isOpen);
            }}
            position="relative"
        >
            <SelectBtn fullWidth isOpen={isOpen}>
                <Icon icon="ph:sort-ascending" fontSize={20} />
                {selected ? selected.label : placeholder}
                <Icon icon="ph:caret-down" className="arrow-icon" />
            </SelectBtn>
            <ListItemsWrapper width={'100%'} isOpen={isOpen}>
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

export default SortSelect