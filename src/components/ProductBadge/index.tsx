import React from 'react';
import { Container } from './styles';
import { enumBadgeType } from 'src/types/product-types';
import { Icon } from '@iconify/react';
import { Grid } from '@mui/material';

interface ProductBadgeProps {
    badgeType: enumBadgeType;
    content?: string;
}

const ProductBadge: React.FC<ProductBadgeProps> = ({ badgeType, content }): JSX.Element => {
    const styles = {
        [enumBadgeType.ComingSoon]: {
            background: '#C9F5DC',
            color: '#1EA557',
            icon: '',
        },
        [enumBadgeType.SaleEnds]: {
            background: '#FFEAD8',
            color: '#E0822C',
            icon: '',
        },
        [enumBadgeType.SaleEnded]: {
            background: '#FDEEEE',
            color: '#EB5757',
            icon: '',
        },
        [enumBadgeType.BuyNow]: {
            background: '#E8F4FF',
            color: '#1890FF',
            icon: <Icon icon="ph:lightning" />,
        },
        [enumBadgeType.ForSale]: {
            background: '#E8F4FF',
            color: '#1890FF',
            icon: <Icon icon="ph:lightning" />,
        },
        [enumBadgeType.OnAuction]: {
            background: '#E8F4FF',
            color: '#1890FF',
            icon: <Icon icon="ph:scales" />,
        },
        [enumBadgeType.ReservePriceNotMet]: {
            background: '#BF21F11A',
            color: '#BF21F1',
            icon: '',
        },
        [enumBadgeType.Museum]: {
            background: '#24AECC1A',
            color: '#24AECC',
            icon: <Icon icon="ph:bank" />,
        },
        [enumBadgeType.Created]: {
            background: '#FFEAD8',
            color: '#E0822C',
            icon: <Icon icon="ph:palette" />,
        },
        [enumBadgeType.Sold]: {
            background: '#BF21F11A',
            color: '#BF21F1',
            icon: <Icon icon="ph:handshake" />,
        },
    };

    return (
        <Container
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ background: styles[badgeType].background, color: styles[badgeType].color }}
        >
            {styles[badgeType].icon !== '' && styles[badgeType].icon}
            {/* <Typography fontSize={14} fontWeight={500} color={styles[badgeType].color}>
                
                {`${badgeType}${content ? `: ${content}` : ''}`}
            </Typography> */}
            <Grid container justifyContent={"space-between"} fontSize={14} fontWeight={500} color={styles[badgeType].color}>
                <Grid item>
                    {`${badgeType}${content ? ': ' : ''}`}
                </Grid>
                <Grid item>
                    {content ? content : ''}
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductBadge;
