import React from 'react';
import { Container } from './styles';
import { enumBlindBoxNFTType, enumSingleNFTType, enumMyNFTType, enumBadgeType } from 'src/types/product-types';
import ProductBadge from 'src/components/ProductBadge';
import { SpacingProps } from '@mui/system';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface ProductBadgeContainerProps extends SpacingProps {
    nfttype: enumBlindBoxNFTType | enumSingleNFTType | enumMyNFTType;
    content?: string;
    isReservedAuction: boolean;
}

const ProductBadgeContainer: React.FC<ProductBadgeContainerProps> = ({
    nfttype,
    content,
    isReservedAuction,
    ...otherProps
}): JSX.Element => {
    const theme = useTheme();
    const matchUpXl = useMediaQuery(theme.breakpoints.up('xl'));

    const badgeComingSoon = <ProductBadge badgeType={enumBadgeType.ComingSoon} content={content} />;
    const badgeSaleEnds = <ProductBadge badgeType={enumBadgeType.SaleEnds} content={content} />;
    const badgeSaleEnded = <ProductBadge badgeType={enumBadgeType.SaleEnded} />;
    const badgeSoldOut = <ProductBadge badgeType={enumBadgeType.SoldOut} />;
    const badgeBuyNow = <ProductBadge badgeType={enumBadgeType.BuyNow} />;
    const badgeOnAuction = (
        <Grid container spacing={1}>
            <Grid item>
                <ProductBadge badgeType={enumBadgeType.OnAuction} />
            </Grid>
            {matchUpXl && !isReservedAuction && (
                <Grid item>
                    <ProductBadge badgeType={enumBadgeType.ReservePriceNotMet} />
                </Grid>
            )}
        </Grid>
    );
    const badgeCreated = <ProductBadge badgeType={enumBadgeType.Created} />;
    const badgeSold = <ProductBadge badgeType={enumBadgeType.Sold} />;
    const badgePurchased = <ProductBadge badgeType={enumBadgeType.Purchased} />;

    const child = {
        [enumBlindBoxNFTType.ComingSoon]: {
            element: badgeComingSoon,
        },
        [enumBlindBoxNFTType.SaleEnds]: {
            element: badgeSaleEnds,
        },
        [enumBlindBoxNFTType.SaleEnded]: {
            element: badgeSaleEnded,
        },
        [enumBlindBoxNFTType.SoldOut]: {
            element: badgeSoldOut,
        },
        [enumSingleNFTType.BuyNow]: {
            element: badgeBuyNow,
        },
        [enumSingleNFTType.OnAuction]: {
            element: badgeOnAuction,
        },
        [enumMyNFTType.BuyNow]: {
            element: badgeBuyNow,
        },
        [enumMyNFTType.OnAuction]: {
            element: badgeOnAuction,
        },
        [enumMyNFTType.Created]: {
            element: badgeCreated,
        },
        [enumMyNFTType.Sold]: {
            element: badgeSold,
        },
        [enumMyNFTType.Purchased]: {
            element: badgePurchased,
        },
    };
    return (
        <Container direction={'row'} alignItems="left" spacing={1} {...otherProps}>
            {child[nfttype].element}
        </Container>
    );
};

export default ProductBadgeContainer;
