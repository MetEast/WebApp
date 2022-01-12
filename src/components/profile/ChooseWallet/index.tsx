import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { ConnectButton } from './styles';
import { PrimaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {
    onClickClose: () => void;
}

const ChooseWallet: React.FC<ComponentProps> = ({ onClickClose }): JSX.Element => {
    const [wallet, setWallet] = useState<'walletconnect' | 'elastos'>('walletconnect');

    return (
        <Stack alignItems="center" width={280} spacing={3}>
            <Typography fontSize={32} fontWeight={700}>
                Choose Wallet
            </Typography>
            <ConnectButton
                onClick={() => {
                    setWallet('walletconnect');
                }}
                selected={wallet === 'walletconnect'}
            >
                <img src="/assets/icons/walletconnect.svg" alt="" />
                <Typography fontSize={14} fontWeight={600}>
                    Wallet Connect
                </Typography>
            </ConnectButton>
            <ConnectButton
                onClick={() => {
                    setWallet('elastos');
                }}
                selected={wallet === 'elastos'}
            >
                <img src="/assets/icons/elastos-essential.svg" alt="" />
                <Typography fontSize={14} fontWeight={600}>
                    Elastos Essential
                </Typography>
            </ConnectButton>
            <PrimaryButton fullWidth>Connect</PrimaryButton>
        </Stack>
    );
};

export default ChooseWallet;
