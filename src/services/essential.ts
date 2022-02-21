import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { create } from 'ipfs-http-client';

const client = create({ url: process.env.REACT_APP_IPFS_UPLOAD_URL });

export const getEssentialsWalletAddress = () => {
    const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
    return walletConnectProvider.wc.accounts;
};

export const getEssentialsWalletBalance = async () => {
    const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);
    const accounts = await walletConnectWeb3.eth.getAccounts();
    const balance = await walletConnectWeb3.eth.getBalance(accounts[0]);
    return balance;
};

export const getDidUri = async (_did: string, _description: string, _name: string) => {
    // create the metadata object we'll be storing
    const didObj = {
        version: '1',
        did: _did,
    };
    const jsonDidObj = JSON.stringify(didObj);
    // add the metadata itself as well
    const didUri = await client.add(jsonDidObj);
    return `did:elastos:${didUri.path}`;
};
