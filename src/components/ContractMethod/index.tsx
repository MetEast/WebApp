import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { METEAST_CONTRACT_ABI, METEAST_CONTRACT_ADDRESS } from 'src/contracts/MET';
import { METEAST_MARKET_CONTRACT_ABI, METEAST_MARKET_CONTRACT_ADDRESS } from 'src/contracts/METMarket';
import { TypeContractMethodPram } from 'src/types/mint-types';

export const callContractMethod = (walletConnectWeb3: Web3, param: TypeContractMethodPram) =>
    new Promise((resolve, reject) => {
        const contractAbi = param.contractType === 1 ? METEAST_CONTRACT_ABI : METEAST_MARKET_CONTRACT_ABI;
        const contractAddress = param.contractType === 1 ? METEAST_CONTRACT_ADDRESS : METEAST_MARKET_CONTRACT_ADDRESS;
        const smartContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);
        let accounts: string[] = [];
        let gasPrice: string = '';
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
        walletConnectWeb3.eth
            .getAccounts()
            .then((_accounts: string[]) => {
                accounts = _accounts;
                return walletConnectWeb3.eth.getGasPrice();
            })
            .then((_gasPrice: string) => {
                gasPrice = _gasPrice;
                const transactionParams = {
                    from: accounts[0],
                    gasPrice: gasPrice,
                    gas: 5000000,
                    value: param.price,
                };
                let contractMethod = null;
                switch (param.method) {
                    case 'buyOrder':
                        contractMethod = smartContract.methods.buyOrder(param.orderId, param.didUri);
                        break;
                    case 'buyOrderBatch':
                        contractMethod = smartContract.methods.buyOrderBatch(param.orderIds, param.didUri);
                        break;
                    case 'settleAuctionOrder':
                        contractMethod = smartContract.methods.settleAuctionOrder(param.orderId);
                        break;
                }
                contractMethod
                    .send(transactionParams)
                    .once('transactionHash', handleTxEvent)
                    .once('receipt', handleReceiptEvent)
                    .on('error', handleErrorEvent);
            });
    });
