import React from 'react';
import { Box } from '@mui/material';
import { Container } from './styles';

const SaleStatusBadge: React.FC = (): JSX.Element => {
    return (
        <>
            <Container>Sale Ends: 2022/02/28 10:00</Container>
        </>
    );
};

export default SaleStatusBadge;
