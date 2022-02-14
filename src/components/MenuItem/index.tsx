import React from 'react';
import { Box, Button } from '@mui/material';
import { TypeMenuItem } from 'src/types/layout-types';
import { MenuButton, MenuItemTypography } from './styles';
import { useNavigate } from 'react-router-dom';

export interface IMenuItemProps {
    data: TypeMenuItem;
    isSelected: boolean;
}

const MenuItem: React.FC<IMenuItemProps> = ({ data: { icon, title, url }, isSelected }): JSX.Element => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(url);
    };

    return (
        <MenuButton selected={isSelected} onClick={handleClick}>
            {icon}
            <MenuItemTypography selected={isSelected}>{title}</MenuItemTypography>
        </MenuButton>
    );
};

export default MenuItem;
