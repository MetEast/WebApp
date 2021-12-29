import { styled, Box } from '@mui/material';
import { enmSaleStatus } from 'src/types/product-types';

export const Container = styled(Box)<{ saleStatus: string }>`
    width: fit-content;
    background: ${({ saleStatus }) =>
        saleStatus === enmSaleStatus.ComingSoon
            ? 'var(--color-badge-comingsoon-bg)'
            : saleStatus === enmSaleStatus.SaleEnds
            ? 'var(--color-badge-saleends-bg)'
            : saleStatus === enmSaleStatus.SaleEnded
            ? 'var(--color-badge-saleended-bg)'
            : ''};
    color: ${({ saleStatus }) =>
        saleStatus === enmSaleStatus.ComingSoon
            ? 'var(--color-badge-comingsoon-text)'
            : saleStatus === enmSaleStatus.SaleEnds
            ? 'var(--color-badge-saleends-text)'
            : saleStatus === enmSaleStatus.SaleEnded
            ? 'var(--color-badge-saleended-text)'
            : ''};
    border-radius: 8px;
    padding: 6px 8px;
    font-size: 14px;
    font-weight: 500;
`;
