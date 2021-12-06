import React from 'react';
import { Box, Button } from '@mui/material';
import { TypeNavbarItem } from 'src/types/layout-types';
import { NavbarItemTypography } from './styledComponents';
import { useNavigate } from 'react-router-dom';

export interface INavbarItemProps {
    data: TypeNavbarItem,
    isSelected: boolean,
}

const NavbarItem: React.FC<INavbarItemProps> = ({ data: { icon: Icon, title, url }, isSelected }): JSX.Element => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(url);
    };

    return <Button onClick={handleClick}>
        <Box color={isSelected ? 'var(--color-base)' : 'black'}>
            <Box display="flex" justifyContent="center">
                <Icon />
            </Box>
            <NavbarItemTypography>{title}</NavbarItemTypography>
        </Box>
    </Button>
};

export default NavbarItem;
