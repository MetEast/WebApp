import React, { useState } from 'react';
import { SortByBtn, ListItemsWrapper } from './styles';
import { Box, Button, Stack } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Icon } from '@iconify/react';

interface SelectProps {
    options: { label: string; value: string }[];
    title?: string;
    placeholder?: string;
    handleClick: (value: string) => void;
    onlyShowIcon: boolean;
}

const SortByButton: React.FC<SelectProps> = ({ options, title, placeholder = '', handleClick, onlyShowIcon }) => {
    const [isOpened, setIsOpened] = useState(false);

    return (
        <Box
            onClick={() => {
                setIsOpened(!isOpened);
            }}
        >
            <SortByBtn fullWidth isOpenned={isOpened}>
                <Icon icon="ph:sort-ascending" fontSize={24} />
                {!onlyShowIcon && <>
                    {title ? title : placeholder}
                    <KeyboardArrowDownIcon className="arrow-icon" />
                </>}
            </SortByBtn>
            <ListItemsWrapper width={200} isOpenned={isOpened}>
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
    handleClick: (value: string) => void; // 
    title: string;
    value: string;
}

const SelectItem: React.FC<SelectItemProps> = ({ title, value, handleClick }) => {
    return <Button onClick={(e) => handleClick(value)}>{title}</Button>;
};

export default SortByButton;
