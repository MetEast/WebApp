import React from 'react';
import { Box, Button } from '@mui/material';
import { TypeMenuItem } from 'src/types/layout-types';
import { MenuButton, MenuItemTypography } from './styles';
import { useNavigate } from 'react-router-dom';

export interface IMenuItemProps {
    data: TypeMenuItem;
    isSelected: boolean;
    mobile?: boolean;
}

const MenuItem: React.FC<IMenuItemProps> = ({ data: { icon, title, url }, isSelected, mobile }): JSX.Element => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(url);
    };

    return (
        <MenuButton selected={isSelected} sx={{ paddingX: mobile ? 0 : 2 }} onClick={handleClick}>
            {icon}
            {!mobile && <MenuItemTypography selected={isSelected}>{title}</MenuItemTypography>}
        </MenuButton>
    );
};

export default MenuItem;
