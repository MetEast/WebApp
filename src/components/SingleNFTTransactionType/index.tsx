import React from 'react';
import { enumTransactionType } from 'src/types/product-types';
import { Icon } from '@iconify/react';
import { Typography, Stack } from '@mui/material';

interface ComponentProps {
    transactionType: enumTransactionType;
}

const SingleNFTTransactionType: React.FC<ComponentProps> = ({ transactionType }): JSX.Element => {
    const styles = {
        [enumTransactionType.Bid]: {
            icon: <Icon icon="ph:ticket" fontSize={20} />,
        },
        [enumTransactionType.OnAuction]: {
            icon: <Icon icon="ph:scales" fontSize={20} />,
        },
        [enumTransactionType.SoldTo]: {
            icon: <Icon icon="ph:handshake" fontSize={20} />,
        },
        [enumTransactionType.ForSale]: {
            icon: <Icon icon="ph:lightning" fontSize={20} />,
        },
        [enumTransactionType.CreatedBy]: {
            icon: <Icon icon="ph:palette" fontSize={20} />,
        },
    };

    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            {styles[transactionType].icon}
            <Typography fontSize={16} fontWeight={700}>
                {transactionType}
            </Typography>
        </Stack>
    );
};

export default SingleNFTTransactionType;
