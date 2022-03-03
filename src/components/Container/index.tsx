import React from 'react';
import { ContainerWrapper } from './styles';
import { SxProps } from '@mui/system';

export interface ComponentProps {
    sx?: SxProps;
}

const Container: React.FC<ComponentProps> = ({ sx, children }): JSX.Element => {
    return (
        <>
            <ContainerWrapper sx={{ ...sx }}>{children}</ContainerWrapper>
        </>
    );
};

export default Container;
