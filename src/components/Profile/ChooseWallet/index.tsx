import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { ConnectButton } from './styles';
import { PrimaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {
    onConnect: (wallet: 'walletconnect' | 'essential' | 'metamask' | 'walletlink') => void;
    isWorking?: boolean; 
}

const ChooseWallet: React.FC<ComponentProps> = ({ onConnect, isWorking = false }): JSX.Element => {
    const [wallet, setWallet] = useState<'walletconnect' | 'essential' | 'metamask' | 'walletlink'>('metamask');

    return (
        <Stack alignItems="center" width={280} spacing={3}>
            <Typography fontSize={32} fontWeight={700}>
                Choose Wallet
            </Typography>
            <ConnectButton
                onClick={() => {
                    if(!isWorking) setWallet('metamask');
                }}
                selected={wallet === 'metamask'}
            >
                <img src="/assets/icons/metamask-alt.svg" alt="" />
                <Typography fontSize={14} fontWeight={600}>
                    MetaMask Wallet
                </Typography>
            </ConnectButton>
            <ConnectButton
                onClick={() => {
                    if(!isWorking) setWallet('walletconnect');
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
                    if(!isWorking) setWallet('walletlink');
                }}
                selected={wallet === 'walletlink'}
            >
                <img src="/assets/icons/coinbase.webp" width={"20px"} alt="" />
                <Typography fontSize={14} fontWeight={600}>
                    Coinbase Wallet
                </Typography>
            </ConnectButton>
            <ConnectButton
                onClick={() => {
                    if(!isWorking) setWallet('essential');
                }}
                selected={wallet === 'essential'}
            >
                <img src="/assets/icons/elastos-essential.svg" alt="" />
                <Typography fontSize={14} fontWeight={600}>
                    Essential Wallet
                </Typography>
            </ConnectButton>
            <PrimaryButton fullWidth onClick={() => onConnect(wallet)}>
                {isWorking ? "Loading ..." : "Connect"}
            </PrimaryButton>
        </Stack>
    );
};

export default ChooseWallet;
