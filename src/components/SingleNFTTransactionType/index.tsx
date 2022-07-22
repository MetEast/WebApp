import React from 'react';
import { enumTransactionType } from 'src/types/product-types';
import { Icon } from '@iconify/react';
import { Typography, Stack, Link } from '@mui/material';
import { chainConfig } from 'src/config';

interface ComponentProps {
    transactionType: enumTransactionType;
    transactionHash: string;
}

const SingleNFTTransactionType: React.FC<ComponentProps> = ({ transactionType, transactionHash }): JSX.Element => {
    const styles = {
        [enumTransactionType.Bid]: {
            icon: <Icon icon="ph:ticket" fontSize={20} />,
        },
        [enumTransactionType.CreatedBy]: {
            icon: <Icon icon="ph:palette" fontSize={20} />,
        },
        [enumTransactionType.ForSale]: {
            icon: <Icon icon="ph:lightning" fontSize={20} />,
        },
        [enumTransactionType.OnAuction]: {
            icon: <Icon icon="ph:scales" fontSize={20} />,
        },
        [enumTransactionType.SoldTo]: {
            icon: <Icon icon="ph:handshake" fontSize={20} />,
        },
        // [enumTransactionType.ChangeOrder]: {
        //     icon: <Icon icon="ph:lightning" fontSize={20} />,
        // },
        // [enumTransactionType.CancelOrder]: {
        //     icon: <Icon icon="ph:lightning" fontSize={20} />,
        // },
        [enumTransactionType.SettleBidOrder]: {
            icon: <Icon icon="ph:lightning" fontSize={20} />,
        },
        [enumTransactionType.PriceChanged]: {
            icon: <Icon icon="ph:pencil-simple" fontSize={20} />,
        },
        [enumTransactionType.SaleCanceled]: {
            icon: <Icon icon="ph:x" fontSize={20} />,
        },
    };

    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            {styles[transactionType].icon}
            <Typography fontSize={16} fontWeight={700}>
                {transactionType}
            </Typography>
            <Link href={`${chainConfig.exploreUrl}/tx/${transactionHash}`} underline="none" target="_blank">
                <Icon
                    icon="ph:arrow-square-out-bold"
                    fontSize={16}
                    color="#1890FF"
                    // style={{ marginLeft: 4, marginBottom: 4 }}
                />
            </Link>
        </Stack>
    );
};

export default SingleNFTTransactionType;
