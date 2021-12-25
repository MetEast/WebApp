import React from 'react';
import { Box, Button } from '@mui/material';
import { TypeMenuItem } from 'src/types/layout-types';
import { MenuItemTypography } from './styledComponents';
import { useNavigate } from 'react-router-dom';

export interface IMenuItemProps {
    data: TypeMenuItem;
    isSelected: boolean;
}

const MenuItem: React.FC<IMenuItemProps> = ({ data: { icon: Icon, title, url }, isSelected }): JSX.Element => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(url);
    };

    return (
        <Button onClick={handleClick}>
            <Box color="black">
                {/* <Box display="flex" justifyContent="center">
                    <Icon />
                </Box> */}
                <MenuItemTypography sx={isSelected ? { fontWeight: '700' } : {}}>{title}</MenuItemTypography>
            </Box>
        </Button>
    );
};

export default MenuItem;
