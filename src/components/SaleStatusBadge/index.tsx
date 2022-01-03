import React from 'react';
import { Container } from './styles';
import { enmSaleStatus, enumSingleNFTType } from 'src/types/product-types';
import { SpacingProps } from '@mui/system';

interface SaleStatusBadgeProps extends SpacingProps {
    saleStatus: enmSaleStatus | enumSingleNFTType;
    content?: string;
}

const SaleStatusBadge: React.FC<SaleStatusBadgeProps> = ({ saleStatus, content, ...otherProps }): JSX.Element => {
    const styles = {
        [enmSaleStatus.ComingSoon]: {
            background: 'var(--color-badge-comingsoon-bg)',
            color: 'var(--color-badge-comingsoon-text)',
        },
        [enmSaleStatus.SaleEnds]: {
            background: 'var(--color-badge-saleends-bg)',
            color: 'var(--color-badge-saleends-text)',
        },
        [enmSaleStatus.SaleEnded]: {
            background: 'var(--color-badge-saleended-bg)',
            color: 'var(--color-badge-saleended-text)',
        },
        [enumSingleNFTType.BuyNow]: {
            background: 'var(--color-badge-comingsoon-bg)',
            color: 'var(--color-badge-comingsoon-text)',
        },
        [enumSingleNFTType.OnAuction]: {
            background: 'var(--color-badge-comingsoon-bg)',
            color: 'var(--color-badge-comingsoon-text)',
        },
    };

    return (
        <Container
            saleStatus={saleStatus}
            sx={{ background: styles[saleStatus].background, color: styles[saleStatus].color }}
            {...otherProps}
        >{`${saleStatus}${content ? `: ${content}` : ''}`}</Container>
    );
};

export default SaleStatusBadge;
