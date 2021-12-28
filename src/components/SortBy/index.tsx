import React from 'react';
import { SortByBtn } from './styles';
import { Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface SelectProps {
    title: string;
    children: React.ReactElement<SelectItemProps> | React.ReactElement<SelectItemProps>[];
    classes?: string;
    placeholder?: string;
}

const SortByButton: React.FC = () => {
    return (
        // <Box>
        <SortByBtn>
            <img src="/assets/icons/sortby.svg" alt="" />
            {`SORT BY`}
            <KeyboardArrowDownIcon />
        </SortByBtn>
        // </Box>
    );
};

interface SelectItemProps {
    handleClick: (idx: number | string) => void;
    title: string;
    value: number | string;
}

export const SelectItem: React.FC<SelectItemProps> = ({ title, value, handleClick }) => {
    return <button onClick={(e) => handleClick(value)}>{title}</button>;
};

export default SortByButton;
