import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { METEAST_CONTRACT_ABI, METEAST_CONTRACT_ADDRESS } from 'src/contracts/MET';
import { METEAST_MARKET_CONTRACT_ABI, METEAST_MARKET_CONTRACT_ADDRESS } from 'src/contracts/METMarket';
import { TypeContractMethodPram } from 'src/types/mint-types';

export const callContractMethod = (walletConnectWeb3: Web3, param: TypeContractMethodPram) =>
    new Promise((resolve: (value: string) => void, reject: (error: string) => void) => {
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

                if (param.method === 'setApprovalForAll') {
                    smartContract.methods
                        .isApprovedForAll(accounts[0], param.operator)
                        .call()
                        .then((success: boolean) => {
                            if (success) resolve('success');
                            else {
                                smartContract.methods
                                    .setApprovalForAll(param.operator, param.approved)
                                    .send(transactionParams)
                                    .once('transactionHash', handleTxEvent)
                                    .once('receipt', handleReceiptEvent)
                                    .on('error', handleErrorEvent);
                            }
                        });
                } else {
                    let contractMethod = null;
                    switch (param.method) {
                        case 'mint':
                            contractMethod = smartContract.methods.mint(
                                param.tokenId,
                                param.tokenUri,
                                param.royaltyFee,
                            );
                            break;
                        case 'burn':
                            contractMethod = smartContract.methods.burn(param.tokenId);
                            break;
                        case 'createOrderForSale':
                            contractMethod = smartContract.methods.createOrderForSale(
                                param.tokenId,
                                param.quoteToken,
                                param._price,
                                param.didUri,
                                param.isBlindBox,
                            );
                            break;
                        case 'createOrderForSaleBatch':
                            contractMethod = smartContract.methods.createOrderForSaleBatch(
                                param.tokenIds,
                                param.quoteTokens,
                                param._prices,
                                param.didUri,
                                param.isBlindBox,
                            );
                            break;
                        case 'createOrderForAuction':
                            contractMethod = smartContract.methods.createOrderForAuction(
                                param.tokenId,
                                param.quoteToken,
                                param._price,
                                param.endTime,
                                param.didUri,
                            );
                            break;
                        case 'bidForOrder':
                            contractMethod = smartContract.methods.bidForOrder(
                                param.orderId,
                                param._price,
                                param.didUri,
                            );
                            break;
                        case 'changeOrderPrice':
                            contractMethod = smartContract.methods.changeOrderPrice(param.orderId, param._price);
                            break;
                        case 'cancelOrder':
                            contractMethod = smartContract.methods.cancelOrder(param.orderId);
                            break;
                        case 'buyOrder':
                            contractMethod = smartContract.methods.buyOrder(param.orderId, param.didUri);
                            break;
                        case 'buyOrderBatch':
                            contractMethod = smartContract.methods.buyOrderBatch(param.orderIds, param.didUri);
                            break;
                        case 'settleAuctionOrder':
                            contractMethod = smartContract.methods.settleAuctionOrder(param.orderId);
                            break;
                        case 'takeDownOrder':
                            contractMethod = smartContract.methods.takeDownOrder(param.orderId);
                            break;
                        case 'addManager':
                            contractMethod = smartContract.methods.addManager(param.address);
                            break;
                        case 'removeManager':
                            contractMethod = smartContract.methods.removeManager(param.address);
                            break;
                        case 'setBlacklist':
                            contractMethod = smartContract.methods.setBlacklist(param.address, param.approved);
                            break;
                        default:
                            resolve('no action');
                            break;
                    }
                    contractMethod
                        .send(transactionParams)
                        .once('transactionHash', handleTxEvent)
                        .once('receipt', handleReceiptEvent)
                        .on('error', handleErrorEvent);
                }
            });
    });
