import React from 'react';
import { Container } from './styles';
import { enumBlindBoxNFTType, enumSingleNFTType, enumMyNFTType, enumBadgeType } from 'src/types/product-types';
import ProductBadge from 'src/components/ProductBadge';
import { SpacingProps } from '@mui/system';
import { Grid } from '@mui/material';

interface ProductBadgeContainerProps extends SpacingProps {
    nfttype: enumBlindBoxNFTType | enumSingleNFTType | enumMyNFTType;
    content?: string;
}

const ProductBadgeContainer: React.FC<ProductBadgeContainerProps> = ({
    nfttype,
    content,
    ...otherProps
}): JSX.Element => {
    const badgeComingSoon = <ProductBadge badgeType={enumBadgeType.ComingSoon} content={content} />;
    const badgeSaleEnds = <ProductBadge badgeType={enumBadgeType.SaleEnds} content={content} />;
    const badgeSaleEnded = <ProductBadge badgeType={enumBadgeType.SaleEnded} />;
    const badgeBuyNow = <ProductBadge badgeType={enumBadgeType.BuyNow} />;
    const badgeOnAuction = (
        <Grid container spacing={1}>
            <Grid item >
                <ProductBadge badgeType={enumBadgeType.OnAuction} />
            </Grid>
            <Grid item>
                <ProductBadge badgeType={enumBadgeType.ReservePriceNotMet} />
            </Grid>
        </Grid>
    );
    const badgeCreated = <ProductBadge badgeType={enumBadgeType.Created} />;
    const badgeSold = <ProductBadge badgeType={enumBadgeType.Sold} />;

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
    };
    return (
        <Container direction={"row"} alignItems="left" spacing={1} {...otherProps}>
            {child[nfttype].element}
        </Container>
    );
};

export default ProductBadgeContainer;
