import React from 'react';
import { Stack, Typography, Box, Link } from '@mui/material';
import { Icon } from '@iconify/react';
import ELAPrice from 'src/components/ELAPrice';
import ProductBadge from 'src/components/ProductBadge';
import { enumBadgeType, enumTransactionType, TypeNFTHisotry } from 'src/types/product-types';
import Username from 'src/components/Username';
import { chainConfig } from 'src/config';

interface ComponentProps {
    historyList: Array<TypeNFTHisotry>;
}

const ProductTransHistory: React.FC<ComponentProps> = ({ historyList }): JSX.Element => {
    return (
        <Stack spacing={2}>
            <Typography fontSize={22} fontWeight={700}>
                History
            </Typography>
            {historyList.map((item, index) => (
                <Stack key={`product-hisotry-${index}`}>
                    <Stack spacing={1}>
                        <Typography fontSize={12} fontWeight={500}>
                            {item.time}
                        </Typography>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Box>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <Icon
                                        icon={
                                            item.type === enumTransactionType.CreatedBy
                                                ? 'ph:palette'
                                                : item.type === enumTransactionType.SoldTo
                                                ? 'ph:sign-out'
                                                : 'ph:sign-in'
                                        }
                                        fontSize={20}
                                    />
                                    <Typography fontSize={16} fontWeight={700}>
                                        {item.type}
                                    </Typography>
                                    <Link
                                        href={`${chainConfig.exploreUrl}/tx/${item.txHash}`}
                                        underline="none"
                                        target="_blank"
                                    >
                                        <Icon
                                            icon="ph:arrow-square-out-bold"
                                            fontSize={16}
                                            color="#1890FF"
                                            style={{ marginLeft: 4, marginBottom: 4 }}
                                        />
                                    </Link>
                                </Stack>
                                <Username username={item.user} fontSize={16} fontWeight={400} />
                            </Box>
                            <Stack alignItems="flex-end">
                                <ELAPrice price_ela={item.price} price_ela_fontsize={14} />
                                <ProductBadge
                                    badgeType={
                                        item.saleType === enumTransactionType.CreatedBy
                                            ? enumBadgeType.Created
                                            : item.saleType === enumTransactionType.ForSale
                                            ? enumBadgeType.BuyNow
                                            : enumBadgeType.OnAuction
                                    }
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            ))}
        </Stack>
    );
};

export default ProductTransHistory;
