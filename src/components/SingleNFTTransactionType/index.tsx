import React, { useEffect, useState } from 'react';
import { useSignInContext } from 'src/context/SignInContext';
import { enumTransactionType } from 'src/types/product-types';
import { Icon } from '@iconify/react';
import { Typography, Stack, Link } from '@mui/material';

interface ComponentProps {
    transactionType: enumTransactionType;
    transactionHash: string;
}

const SingleNFTTransactionType: React.FC<ComponentProps> = ({ transactionType, transactionHash }): JSX.Element => {
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
        [enumTransactionType.ChangeOrder]: {
            icon: <Icon icon="ph:lightning" fontSize={20} />,
        },
        [enumTransactionType.CancelOrder]: {
            icon: <Icon icon="ph:lightning" fontSize={20} />,
        },
        [enumTransactionType.Transfer]: {
            icon: <Icon icon="ph:lightning" fontSize={20} />,
        }
    };

    const [signInDlgState] = useSignInContext();
    let initUrl = '';
    if (signInDlgState.chainId === 20) initUrl = `${process.env.REACT_APP_ELASTOS_ESC_MAIN_NET}/tx/${transactionHash}`;
    else if (signInDlgState.chainId === 21) initUrl = `${process.env.REACT_APP_ELASTOS_ESC_TEST_NET}/tx/${transactionHash}`; 
    const [txHashUrl, setTxHashUrl] = useState<string>(initUrl);
    useEffect(() => {
        let _url = '';
        if (signInDlgState.chainId === 20) _url = `${process.env.REACT_APP_ELASTOS_ESC_MAIN_NET}/tx/${transactionHash}`;
        else if (signInDlgState.chainId === 21) _url = `${process.env.REACT_APP_ELASTOS_ESC_TEST_NET}/tx/${transactionHash}`; 
        setTxHashUrl(_url);
    }, [signInDlgState.chainId]);

    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            {styles[transactionType].icon}
            <Typography fontSize={16} fontWeight={700}>
                {transactionType}
            </Typography>
            <Link href={txHashUrl} underline="none" target="_blank">
                <Icon
                    icon="ph:arrow-square-out-bold"
                    fontSize={16}
                    color="#1890FF"
                    style={{ marginLeft: 4, marginBottom: 4 }}
                />
            </Link>
        </Stack>
    );
};

export default SingleNFTTransactionType;
