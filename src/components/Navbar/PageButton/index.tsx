import React from 'react';
import { TypeMenuItem } from 'src/types/layout-types';
import { PageBtn, MenuItemTypography } from './styles';
import { useNavigate } from 'react-router-dom';

interface ComponentProps {
    data: TypeMenuItem;
    isSelected: boolean;
    mobile?: boolean;
}

const PageButton: React.FC<ComponentProps> = ({ data: { icon, title, url }, isSelected, mobile }): JSX.Element => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(url);
    };

    return (
        <PageBtn
            selected={isSelected}
            sx={{
                paddingX: mobile ? 0 : 2,
                display: mobile ? 'inline-flex' : { xs: title === 'Home' ? 'none' : 'inline-flex', lg: 'inline-flex' },
            }}
            onClick={handleClick}
        >
            {icon}
            {!mobile && <MenuItemTypography selected={isSelected}>{title}</MenuItemTypography>}
        </PageBtn>
    );
};

export default PageButton;
