import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { Icon } from '@iconify/react';
import ELAPrice from 'src/components/ELAPrice';
import ProductBadge from 'src/components/ProductBadge';
import { enumBadgeType } from 'src/types/product-types';

interface ComponentProps {
    sold?: boolean;
    bought?: boolean;
    created?: boolean;
}

const ProductTransHistory: React.FC<ComponentProps> = ({ sold = true, bought = true, created = true }): JSX.Element => {
    return (
        <Stack spacing={2}>
            <Typography fontSize={18} fontWeight={700}>
                History
            </Typography>
            {sold && (
                <Stack spacing={1}>
                    <Typography fontSize={12} fontWeight={500}>
                        2022/02/28 10:00
                    </Typography>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Icon icon="ph:sign-out" fontSize={20} />
                                <Typography fontSize={16} fontWeight={700}>
                                    Sold To
                                </Typography>
                            </Stack>
                            <Typography fontSize={16} fontWeight={400}>
                                Nickname
                            </Typography>
                        </Box>
                        <Stack alignItems="flex-end">
                            <ELAPrice price_ela={199} />
                            <ProductBadge badgeType={enumBadgeType.BuyNow} />
                        </Stack>
                    </Stack>
                </Stack>
            )}
            {bought && (
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
                            <ELAPrice price_ela={199} />
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
            )}
        </Stack>
    );
};

export default ProductTransHistory;
