import React, { useEffect, useState } from 'react';
import { useSignInContext } from 'src/context/SignInContext';
import { Button } from './styles';
import { Icon } from '@iconify/react';
import { Link } from '@mui/material';

export interface ComponentProps {
    txHash: string;
}

const ViewOnExplorerButton: React.FC<ComponentProps> = ({txHash}): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    let initUrl = '';
    if (signInDlgState.chainId === 20) initUrl = `${process.env.REACT_APP_ELASTOS_ESC_MAIN_NET}/tx/${txHash}`;
    else if (signInDlgState.chainId === 21) initUrl = `${process.env.REACT_APP_ELASTOS_ESC_TEST_NET}/tx/${txHash}`; 
    const [txHashUrl, setTxHashUrl] = useState<string>(initUrl);
    useEffect(() => {
        let _url = '';
        if (signInDlgState.chainId === 20) _url = `${process.env.REACT_APP_ELASTOS_ESC_MAIN_NET}/tx/${txHash}`;
        else if (signInDlgState.chainId === 21) _url = `${process.env.REACT_APP_ELASTOS_ESC_TEST_NET}/tx/${txHash}`; 
        setTxHashUrl(_url);
    }, [signInDlgState.chainId, txHash]);

    return (
        <Link href={txHashUrl} underline="none" target="_blank">
            <Button>
                {`View on explorer`}
                <Icon
                    icon="ph:arrow-square-out-bold"
                    fontSize={16}
                    color="#1890FF"
                    style={{ marginLeft: 4, marginBottom: 4 }}
                />
            </Button>
        </Link>
    );
};

export default ViewOnExplorerButton;
