import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { create } from 'ipfs-http-client';
import axios from 'axios';
import { apiConfig, ipfsConfig, chainConfig } from 'src/config';

const client = create({ url: ipfsConfig.ipfsUploadUrl });

declare global {
    interface Window {
        ethereum: any;
        web3: any;
        elastos: any;
        client: any;
    }
}

export const addressZero = '0x0000000000000000000000000000000000000000';

export const isSupportedNetwork = (chainId: number) => chainId === parseInt(chainConfig.id);

export const getEssentialsWalletAddress = () => {
    if (isInAppBrowser()) {
        const inAppProvider: any = window.elastos.getWeb3Provider();
        return [inAppProvider.address];
    } else {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        return walletConnectProvider.wc.accounts;
    }
};

export const getEssentialsWalletBalance = async () => {
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);
    const accounts = await walletConnectWeb3.eth.getAccounts();
    if (accounts.length === 0) return '0';
    const balance = await walletConnectWeb3.eth.getBalance(accounts[0]);
    return balance;
};

export const getEssentialsChainId = async () => {
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);
    const chainId = await walletConnectWeb3.eth.getChainId();
    return chainId;
};

export const getDidUri = async (_did: string, _description: string, _name: string) => {
    // create the metadata object we'll be storing
    if (!_did) return '';
    const didObj = {
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
    const walletAddresses = await walletConnectWeb3.eth.getAccounts();
    const checkSumAddresses: string[] = [];
    walletAddresses.forEach((address: string) => {
        checkSumAddresses.push(walletConnectWeb3.utils.toChecksumAddress(address));
    });
    return checkSumAddresses;
};

export const getWalletBalance = async (library: any, account: string) => {
    if (!library) return '0';
    const walletConnectWeb3 = new Web3(library.provider as any);
    const balance = await walletConnectWeb3.eth.getBalance(account);
    return balance;
};

export const isInAppBrowser = () => {
    return window.elastos !== undefined && window.elastos.name === 'essentialsiab';
};

export const getChainGasPrice = async (walletConnectWeb3: Web3, gas: number) => {
    const gasPriceUnit = await walletConnectWeb3.eth.getGasPrice();
    return (parseInt(gasPriceUnit) * gas) / 1e18;
};

export const getELA2USDRate = async () => {
    try {
        const result: any = await getERC20TokenPrice(addressZero);
        return result.bundle.elaPrice ? parseFloat(result.bundle.elaPrice) : 0;
    } catch (error) {
        return 0;
    }
    // try {
    //     const resCoinPrice = await fetch('https://esc.elastos.io/api?module=stats&action=coinprice');
    //     const jsonData = await resCoinPrice.json();
    //     if (jsonData && jsonData.result.coin_usd) return jsonData.result.coin_usd;
    //     return 0;
    // } catch (error) {
    //     return 0;
    // }
};

export const getERC20TokenPrice = async (tokenAddress: string, connectProvider = null) => {
    let walletConnectWeb3;
    const rpcUrl = chainConfig.rpcUrl || '';
    if (connectProvider) walletConnectWeb3 = new Web3(connectProvider);
    else if (Web3.givenProvider || window.ethereum) walletConnectWeb3 = new Web3(Web3.givenProvider || window.ethereum);
    else walletConnectWeb3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

    try {
        const blockNumber = await walletConnectWeb3.eth.getBlockNumber();
        const graphQLParams = {
            query: `query tokenPriceData { token(id: "${tokenAddress.toLowerCase()}", block: {number: ${blockNumber}}) { derivedELA } bundle(id: "1", block: {number: ${blockNumber}}) { elaPrice } }`,
            variables: null,
            operationName: 'tokenPriceData',
        };
        const response: any = await axios({
            method: 'POST',
            url: apiConfig.glideELA2USDTUrl,
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            data: graphQLParams,
        });
        return response.data.data ? response.data.data : 0;
    } catch (error) {
        return 0;
    }
};
