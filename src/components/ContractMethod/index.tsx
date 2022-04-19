import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { METEAST_CONTRACT_ABI, METEAST_CONTRACT_ADDRESS } from 'src/contracts/MET';
import { METEAST_MARKET_CONTRACT_ABI, METEAST_MARKET_CONTRACT_ADDRESS } from 'src/contracts/METMarket';
import { TypeContractMethodPram } from 'src/types/mint-types';
import {
    METEAST_MINING_REWARD_TOKEN_CONTRACT_ABI,
    METEAST_MINING_REWARD_TOKEN_CONTRACT_ADDRESS,
} from 'src/contracts/METokenMiningReward';
import {
    METEAST_STAKING_TOKEN_CONTRACT_ABI,
    METEAST_STAKING_TOKEN_CONTRACT_ADDRESS,
} from 'src/contracts/METokenStaking';
import { METEAST_BASE_TOKEN_CONTRACT_ABI, METEAST_BASE_TOKEN_CONTRACT_ADDRESS } from 'src/contracts/METokenBase';
import {
    METEAST_VESTING_TOKEN_CONTRACT_ABI,
    METEAST_VESTING_TOKEN_CONTRACT_ADDRESS,
} from 'src/contracts/METokenVesting';

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

export const callTokenomicsContractMethod = (walletConnectWeb3: Web3, param: TypeContractMethodPram) =>
    new Promise((resolve: (value: string) => void, reject: (error: string) => void) => {
        let contractAbi: any = METEAST_BASE_TOKEN_CONTRACT_ABI;
        let contractAddress = METEAST_BASE_TOKEN_CONTRACT_ADDRESS;
        if (param.contractType === 2) {
            contractAbi = METEAST_VESTING_TOKEN_CONTRACT_ABI;
            contractAddress = METEAST_VESTING_TOKEN_CONTRACT_ADDRESS;
        } else if (param.contractType === 3) {
            contractAbi = METEAST_STAKING_TOKEN_CONTRACT_ABI;
            contractAddress = METEAST_STAKING_TOKEN_CONTRACT_ADDRESS;
        } else if (param.contractType === 4) {
            contractAbi = METEAST_MINING_REWARD_TOKEN_CONTRACT_ABI;
            contractAddress = METEAST_MINING_REWARD_TOKEN_CONTRACT_ADDRESS;
        }
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
                    case 'balanceOf':
                        contractMethod = smartContract.methods.balanceOf(accounts[0]);
                        break;
                    case 'allowance':
                        contractMethod = smartContract.methods.allowance(accounts[0], param.address);
                        break;
                    case 'approve':
                        contractMethod = smartContract.methods.approve(param.address, param._price);
                        break;
                    case 'isStakeholder':
                        contractMethod = smartContract.methods.isStakeholder(accounts[0]);
                        break;
                    case 'stake':
                        contractMethod = smartContract.methods.stake();
                        break;
                    case 'withdraw':
                        contractMethod = smartContract.methods.withdraw();
                        break;
                    case 'getTotalRewardAsBuyer':
                        contractMethod = smartContract.methods.getTotalRewardAsBuyer(accounts[0]);
                        break;
                    case 'getTotalRewardAsCreator':
                        contractMethod = smartContract.methods.getTotalRewardAsCreator(accounts[0]);
                        break;
                    case 'getTotalRewardAsStaker':
                        contractMethod = smartContract.methods.getTotalRewardAsStaker(accounts[0]);
                        break;
                    case 'withdrawBuyerReward':
                        contractMethod = smartContract.methods.withdrawBuyerReward();
                        break;
                    case 'withdrawCreatorReward':
                        contractMethod = smartContract.methods.withdrawCreatorReward();
                        break;
                    case 'withdrawStakerReward':
                        contractMethod = smartContract.methods.withdrawStakerReward();
                        break;
                    default:
                        resolve('no action');
                        break;
                }
                if (param.callType === 1) {
                    contractMethod
                        .send(transactionParams)
                        .once('transactionHash', handleTxEvent)
                        .once('receipt', handleReceiptEvent)
                        .on('error', handleErrorEvent);
                } else {
                    contractMethod.call().then((res: string) => {
                        resolve(res);
                    });
                }
            });
    });
