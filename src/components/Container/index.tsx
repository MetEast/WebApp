import React from 'react';
import { ContainerWrapper } from './styles';

const Container: React.FC = ({ children }): JSX.Element => {
    return (
        <>
            <ContainerWrapper>{children}</ContainerWrapper>
        </>
    );
};

export default Container;
