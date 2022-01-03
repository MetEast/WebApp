import React from 'react';
import { Container } from './styles';
import { enmSaleStatus, enumSingleNFTType } from 'src/types/product-types';
import { SpacingProps } from '@mui/system';
import { Icon } from '@iconify/react';
import { Typography } from '@mui/material';

interface ProductBadgeProps extends SpacingProps {
    saleStatus: enmSaleStatus | enumSingleNFTType;
    content?: string;
}

const ProductBadge: React.FC<ProductBadgeProps> = ({ saleStatus, content, ...otherProps }): JSX.Element => {
    const styles = {
        [enmSaleStatus.ComingSoon]: {
            background: '#C9F5DC',
            color: '#1EA557',
            icon: '',
        },
        [enmSaleStatus.SaleEnds]: {
            background: '#FFEAD8',
            color: '#E0822C',
            icon: '',
        },
        [enmSaleStatus.SaleEnded]: {
            background: '#FDEEEE',
            color: '#EB5757',
            icon: '',
        },
        [enumSingleNFTType.BuyNow]: {
            background: '#E8F4FF',
            color: '#1890FF',
            icon: <Icon icon="ph:lightning" />,
        },
        [enumSingleNFTType.OnAuction]: {
            background: '#E8F4FF',
            color: '#1890FF',
            icon: <Icon icon="ph:scales" />,
        },
    };

    return (
        <Container
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ background: styles[saleStatus].background, color: styles[saleStatus].color }}
            {...otherProps}
        >
            {styles[saleStatus].icon !== '' && styles[saleStatus].icon}
            <Typography fontSize={14} fontWeight={500} color={styles[saleStatus].color}>
                {`${saleStatus}${content ? `: ${content}` : ''}`}
            </Typography>
        </Container>
    );
};

export default ProductBadge;
