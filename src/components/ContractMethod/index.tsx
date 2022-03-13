import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { METEAST_CONTRACT_ABI, METEAST_CONTRACT_ADDRESS } from 'src/contracts/MET';
import { METEAST_MARKET_CONTRACT_ABI, METEAST_MARKET_CONTRACT_ADDRESS } from 'src/contracts/METMarket';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

export const callContractMethod = (loginType: string, contractType: number, _orderId: string) =>
    new Promise((resolve, reject) => {
        const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
            ? window.elastos.getWeb3Provider()
            : essentialsConnector.getWalletConnectProvider();
        const { library } = useWeb3React<Web3Provider>();
        const walletConnectWeb3 = new Web3(
            loginType === '1' ? (walletConnectProvider as any) : (library?.provider as any),
        );
        const contractAbi = contractType === 1 ? METEAST_CONTRACT_ABI : METEAST_MARKET_CONTRACT_ABI;
        const contractAddress = contractType === 1 ? METEAST_CONTRACT_ADDRESS : METEAST_MARKET_CONTRACT_ADDRESS;
        const smartContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);
        let accounts: string[] = [];
        let gasPrice: string = '';
        walletConnectWeb3.eth
            .getAccounts()
            .then((_accounts: string[]) => {
                accounts = _accounts;
                return walletConnectWeb3.eth.getGasPrice();
            })
            .then((_gasPrice: string) => {
                gasPrice = _gasPrice;
            });
        const transactionParams = {
            from: accounts[0],
            gasPrice: gasPrice,
            gas: 5000000,
            value: 0,
        };

        let txHash: string = '';
        const handleTxEvent = (hash: string) => {
            console.log('transactionHash', hash);
            txHash = hash;
        };
        const handleReceiptEvent = (receipt: any) => {
            console.log('receipt', receipt);
            resolve(txHash);
        };
        const handleErrorEvent = (error: any) => {
            console.error('error', error);
            reject(error);
        };
        // smartContract.methods
        //     .settleAuctionOrder(_orderId)
        //     .send(transactionParams)
        //     .on('transactionHash', handleTxEvent)
        //     .on('receipt', handleReceiptEvent)
        //     .on('error', handleErrorEvent);
        resolve('11')
    });
