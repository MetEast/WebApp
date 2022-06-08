import React, { useEffect, useState } from 'react';
import { Stack, Typography, Box, Link } from '@mui/material';
import { Icon } from '@iconify/react';
import ELAPrice from 'src/components/ELAPrice';
import ProductBadge from 'src/components/ProductBadge';
import { enumBadgeType, enumTransactionType, TypeNFTHisotry } from 'src/types/product-types';
import { useSignInContext } from 'src/context/SignInContext';
import Username from 'src/components/Username';
import { getESCExploreUrl } from 'src/services/wallet';

interface ComponentProps {
    historyList: Array<TypeNFTHisotry>;
}

const ProductTransHistory: React.FC<ComponentProps> = ({ historyList }): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [txHashUrl, setTxHashUrl] = useState<string>(getESCExploreUrl(signInDlgState.chainId, ''));

    useEffect(() => {
        setTxHashUrl(getESCExploreUrl(signInDlgState.chainId, ''));
    }, [signInDlgState.chainId]);

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
                                    <Link href={`${txHashUrl}${item.txHash}`} underline="none" target="_blank">
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
