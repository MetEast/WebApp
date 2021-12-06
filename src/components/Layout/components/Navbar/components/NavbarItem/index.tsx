import React from 'react';
import { Box } from '@mui/material';
import { TypeNavbarItem } from 'src/types/layout-types';
import { NavbarItemTypography } from './styledComponents';

export interface INavbarItemProps {
    data: TypeNavbarItem
}

const NavbarItem: React.FC<INavbarItemProps> = ({ data: { icon: Icon, title } }): JSX.Element => {
    return <Box>
        <Box display="flex" justifyContent="center">
            <Icon />
        </Box>
        <NavbarItemTypography>{title}</NavbarItemTypography>
    </Box>
};

export default NavbarItem;
