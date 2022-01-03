import React from 'react';
import { Container } from './styles';
import { enmSaleStatus, enumSingleNFTType, enumBadgeType } from 'src/types/product-types';
import ProductBadge from 'src/components/ProductBadge';
import { SpacingProps } from '@mui/system';

interface ProductBadgeContainerProps extends SpacingProps {
    saleStatus: enmSaleStatus | enumSingleNFTType;
    content?: string;
}

const ProductBadgeContainer: React.FC<ProductBadgeContainerProps> = ({
    saleStatus,
    content,
    ...otherProps
}): JSX.Element => {
    const badgeComingSoon = <ProductBadge badgeType={enumBadgeType.ComingSoon} content={content} />;
    const badgeSaleEnds = <ProductBadge badgeType={enumBadgeType.SaleEnds} content={content} />;
    const badgeSaleEnded = <ProductBadge badgeType={enumBadgeType.SaleEnded} content={content} />;
    const badgeBuyNow = <ProductBadge badgeType={enumBadgeType.BuyNow} />;
    const badgeOnAuction = (
        <>
            <ProductBadge badgeType={enumBadgeType.OnAuction} />
            <ProductBadge badgeType={enumBadgeType.ReservePriceNotMet} />
        </>
    );

    const child = {
        [enmSaleStatus.ComingSoon]: {
            element: badgeComingSoon,
        },
        [enmSaleStatus.SaleEnds]: {
            element: badgeSaleEnds,
        },
        [enmSaleStatus.SaleEnded]: {
            element: badgeSaleEnded,
        },
        [enumSingleNFTType.BuyNow]: {
            element: badgeBuyNow,
        },
        [enumSingleNFTType.OnAuction]: {
            element: badgeOnAuction,
        },
    };
    return (
        <Container direction="row" alignItems="center" spacing={1} {...otherProps}>
            {child[saleStatus].element}
        </Container>
    );
};

export default ProductBadgeContainer;
