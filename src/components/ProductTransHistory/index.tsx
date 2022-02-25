import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { Icon } from '@iconify/react';
import ELAPrice from 'src/components/ELAPrice';
import ProductBadge from 'src/components/ProductBadge';
import { enumBadgeType, enumTransactionType, TypeNFTHisotry } from 'src/types/product-types';

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
                                            item.type === 'Sold To'
                                                ? 'ph:sign-out'
                                                : item.type === 'Bought From'
                                                ? 'ph:sign-in'
                                                : 'ph:palette'
                                        }
                                        fontSize={20}
                                    />
                                    <Typography fontSize={16} fontWeight={700}>
                                        {item.type}
                                    </Typography>
                                </Stack>
                                <Typography fontSize={16} fontWeight={400}>
                                    {item.user}
                                </Typography>
                            </Box>
                            <Stack alignItems="flex-end">
                                <ELAPrice price_ela={item.price} price_ela_fontsize={14} />
                                <ProductBadge
                                    badgeType={
                                        item.type === 'Created'
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

{
    /* {item.type === 'Sold To' && (
                        <Stack spacing={1}>
                            <Typography fontSize={12} fontWeight={500}>
                                {item.time}
                            </Typography>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <Icon
                                            icon={
                                                item.type === 'Sold To'
                                                    ? 'ph:sign-out'
                                                    : item.type === 'Bought From'
                                                    ? 'ph:sign-in'
                                                    : 'ph:palette'
                                            }
                                            fontSize={20}
                                        />
                                        <Typography fontSize={16} fontWeight={700}>
                                            {item.type}
                                        </Typography>
                                    </Stack>
                                    <Typography fontSize={16} fontWeight={400}>
                                        {item.user}
                                    </Typography>
                                </Box>
                                <Stack alignItems="flex-end">
                                    <ELAPrice price_ela={item.price} price_ela_fontsize={14} />
                                    <ProductBadge
                                        badgeType={
                                            item.type === 'Created'
                                                ? enumBadgeType.Created
                                                : item.saleType === 'Buy Now'
                                                ? enumBadgeType.BuyNow
                                                : enumBadgeType.OnAuction
                                        }
                                    />
                                </Stack>
                            </Stack>
                        </Stack>
                    )}
                    {item.type === 'Bought From' && (
                        <Stack spacing={1}>
                            <Typography fontSize={12} fontWeight={500}>
                                2022/02/28 10:00
                            </Typography>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <Icon icon="ph:sign-in" fontSize={20} />
                                        <Typography fontSize={16} fontWeight={700}>
                                            Bought From
                                        </Typography>
                                    </Stack>
                                    <Typography fontSize={16} fontWeight={400}>
                                        Nickname
                                    </Typography>
                                </Box>
                                <Stack alignItems="flex-end">
                                    <ELAPrice price_ela={199} price_ela_fontsize={14} />
                                    <ProductBadge badgeType={enumBadgeType.BuyNow} />
                                </Stack>
                            </Stack>
                        </Stack>
                    )}
                    {created && (
                        <Stack spacing={1}>
                            <Typography fontSize={12} fontWeight={500}>
                                2022/02/28 10:00
                            </Typography>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <Icon icon="ph:palette" fontSize={20} />
                                        <Typography fontSize={16} fontWeight={700}>
                                            Created
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Stack>
                        </Stack>
                    )} */
}
