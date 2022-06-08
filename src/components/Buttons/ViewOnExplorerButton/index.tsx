import React, { useEffect, useState } from 'react';
import { useSignInContext } from 'src/context/SignInContext';
import { Button } from './styles';
import { Icon } from '@iconify/react';
import { Link } from '@mui/material';
import { getESCExploreUrl } from 'src/services/wallet';

export interface ComponentProps {
    txHash: string;
}

const ViewOnExplorerButton: React.FC<ComponentProps> = ({ txHash }): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [txHashUrl, setTxHashUrl] = useState<string>(getESCExploreUrl(signInDlgState.chainId, txHash));

    useEffect(() => {
        setTxHashUrl(getESCExploreUrl(signInDlgState.chainId, txHash));
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
