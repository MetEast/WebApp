import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { create } from 'ipfs-http-client';

const client = create({ url: process.env.REACT_APP_IPFS_UPLOAD_URL });

declare global {
    interface Window {
        ethereum: any;
        web3: any;
        elastos: any;
    }
}

export const getEssentialsWalletAddress = () => {
    if (isInAppBrowser()) {
        const inAppProvider: any = window.elastos.getWeb3Provider();
        return [inAppProvider.address];
    }
    else {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        return walletConnectProvider.wc.accounts;
    }
};

export const getEssentialsWalletBalance = async () => {
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);
    const accounts = await walletConnectWeb3.eth.getAccounts();
    if (accounts.length === 0) return '0';
    const balance = await walletConnectWeb3.eth.getBalance(accounts[0]);
    return balance;
};

export const getEssentialsChainId = async () => {
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);
    const chainId = await walletConnectWeb3.eth.getChainId();
    return chainId;
};

export const getDidUri = async (_did: string, _description: string, _name: string) => {
    // create the metadata object we'll be storing
    const didObj = {
        // version: '1',
        did: _did,
        description: _description,
        name: _name,
    };
    const jsonDidObj = JSON.stringify(didObj);
    // add the metadata itself as well
    const didUri = await client.add(jsonDidObj);
    return `did:elastos:${didUri.path}`;
};

export const resetWalletConnector = (connector: any) => {
    if (connector && connector instanceof WalletConnectConnector) {
        connector.walletConnectProvider = undefined;
    }
};

export const getWalletChainId = async (library: any) => {
    if (!library) return 0;
    const walletConnectWeb3 = new Web3(library.provider as any);
    return await walletConnectWeb3.eth.getChainId();
};

export const getWalletAccounts = async (library: any) => {
    if (!library) return [];
    const walletConnectWeb3 = new Web3(library.provider as any);
    return await walletConnectWeb3.eth.getAccounts();
};

export const getWalletBalance = async (library: any, account: string) => {
    if (!library) return '0';
    const walletConnectWeb3 = new Web3(library.provider as any);
    const balance = await walletConnectWeb3.eth.getBalance(account);
    // const { data: balance } = useSWR(['getBalance', account, 'latest'], {
    //   fetcher: fetcher(library),
    // })
    // if(!balance) {
    //   return '0';
    // }
    return balance;
};

export const isInAppBrowser = () => {
    return window.elastos !== undefined && window.elastos.name === 'essentialsiab';
};

