import React from 'react';
import { Container } from './styles';
import { enmSaleStatus } from 'src/types/product-types';
import { SpacingProps } from '@mui/system';

interface SaleStatusBadgeProps extends SpacingProps {
    saleStatus: enmSaleStatus;
    content?: string;
}

const SaleStatusBadge: React.FC<SaleStatusBadgeProps> = ({ saleStatus, content, ...otherProps }): JSX.Element => {
    return (
        <Container saleStatus={saleStatus} {...otherProps}>{`${saleStatus}${content ? `: ${content}` : ''}`}</Container>
    );
};

export default SaleStatusBadge;
