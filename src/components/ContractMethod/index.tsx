import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { METEAST_CONTRACT_ABI } from 'src/contracts/MET';
import { METEAST_MARKET_CONTRACT_ABI } from 'src/contracts/METMarket';
import { TypeContractMethodPram } from 'src/types/mint-types';
import { METEAST_MINING_REWARD_TOKEN_CONTRACT_ABI } from 'src/contracts/METokenMiningReward';
import { METEAST_STAKING_TOKEN_CONTRACT_ABI } from 'src/contracts/METokenStaking';
import { METEAST_BASE_TOKEN_CONTRACT_ABI } from 'src/contracts/METokenBase';
import { METEAST_VESTING_TOKEN_CONTRACT_ABI } from 'src/contracts/METokenVesting';
import { enumCallMethodType, enumMetEastContractType, enumMETokenContractType } from 'src/types/contract-types';
import { contractConfig } from 'src/config';

export const callContractMethod = (walletConnectWeb3: Web3, param: TypeContractMethodPram) =>
    new Promise((resolve: (value: string) => void, reject: (error: string) => void) => {
        const contractAbi =
            param.contractType === enumMetEastContractType.METEAST ? METEAST_CONTRACT_ABI : METEAST_MARKET_CONTRACT_ABI;
        const contractAddress =
            param.contractType === enumMetEastContractType.METEAST
                ? contractConfig.METEAST_CONTRACT
                : contractConfig.METEAST_MARKET_CONTRACT;
        const smartContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);
        let accounts: string[] = [];
        let gasPrice: string = '';
        let txHash: string = '';
        let contractMethod: any = null;

        switch (param.method) {
            case 'mint':
                contractMethod = smartContract.methods.mint(param.tokenId, param.tokenUri, param.royaltyFee);
                break;
            case 'burn':
                contractMethod = smartContract.methods.burn(param.tokenId);
                break;
            case 'setApprovalForAll':
                contractMethod = smartContract.methods.setApprovalForAll(param.operator, param.approved);
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
                contractMethod = smartContract.methods.bidForOrder(param.orderId, param._price, param.didUri);
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
            .then(async (_gasPrice: string) => {
                gasPrice = parseInt(_gasPrice) > 20 * 1e9 ? (20 * 1e9).toString() : _gasPrice;
                if (param.method === 'createOrderForSaleBatch')
                    return await contractMethod.estimateGas({ from: accounts[0], gas: 8000000, value: param.price });
                else return 3231451;
            })
            .then((_estimatedGas: number) => {
                const transactionParams = {
                    from: accounts[0],
                    gasPrice: gasPrice,
                    gas: _estimatedGas,
                    value: param.price,
                };

                if (param.method === 'setApprovalForAll') {
                    smartContract.methods
                        .isApprovedForAll(accounts[0], param.operator)
                        .call()
                        .then((success: boolean) => {
                            if (success) resolve('success');
                            else {
                                contractMethod
                                    .send(transactionParams)
                                    .once('transactionHash', handleTxEvent)
                                    .once('receipt', handleReceiptEvent)
                                    .on('error', handleErrorEvent);
                            }
                        });
                } else {
                    contractMethod
                        .send(transactionParams)
                        .once('transactionHash', handleTxEvent)
                        .once('receipt', handleReceiptEvent)
                        .on('error', handleErrorEvent);
                }
            })
            .catch((error: any) => {
                console.error(error);
                reject(error);
            });
    });

export const callTokenomicsContractMethod = (walletConnectWeb3: Web3, param: TypeContractMethodPram) =>
    new Promise((resolve: (value: string) => void, reject: (error: string) => void) => {
        let contractAbi: any = METEAST_BASE_TOKEN_CONTRACT_ABI;
        let contractAddress = contractConfig.MET_BASE_CONTRACT;
        if (param.contractType === enumMETokenContractType.MET_VESTING) {
            contractAbi = METEAST_VESTING_TOKEN_CONTRACT_ABI;
            contractAddress = contractConfig.MET_VESTING_CONTRACT;
        } else if (param.contractType === enumMETokenContractType.MET_STAKING) {
            contractAbi = METEAST_STAKING_TOKEN_CONTRACT_ABI;
            contractAddress = contractConfig.MET_STAKING_CONTRACT;
        } else if (param.contractType === enumMETokenContractType.MET_MINING_REWARD) {
            contractAbi = METEAST_MINING_REWARD_TOKEN_CONTRACT_ABI;
            contractAddress = contractConfig.MET_MINING_REWARD_CONTRACT;
        }
        const smartContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);
        let accounts: string[] = [];
        let gasPrice: string = '';
        let txHash: string = '';
        let contractMethod: any = null;

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
                gasPrice = parseInt(_gasPrice) > 20 * 1e9 ? (20 * 1e9).toString() : gasPrice;

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
                    case 'stakedAmount':
                        contractMethod = smartContract.methods.stakedAmount(accounts[0]);
                        break;
                    case 'stake':
                        contractMethod = smartContract.methods.stake(param._price);
                        break;
                    case 'withdraw':
                        contractMethod = smartContract.methods.withdraw();
                        break;
                    case 'getAvailableRewardAsBuyer':
                        contractMethod = smartContract.methods.getAvailableRewardAsBuyer(accounts[0]);
                        break;
                    case 'getAvailableRewardAsCreator':
                        contractMethod = smartContract.methods.getAvailableRewardAsCreator(accounts[0]);
                        break;
                    case 'getAvailableRewardAsStaker':
                        contractMethod = smartContract.methods.getAvailableRewardAsStaker(accounts[0]);
                        break;
                    case 'getReceivedRewardAsBuyer':
                        contractMethod = smartContract.methods.getReceivedRewardAsBuyer(accounts[0]);
                        break;
                    case 'getReceivedRewardAsCreator':
                        contractMethod = smartContract.methods.getReceivedRewardAsCreator(accounts[0]);
                        break;
                    case 'getReceivedRewardAsStaker':
                        contractMethod = smartContract.methods.getReceivedRewardAsStaker(accounts[0]);
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

                return contractMethod.estimateGas({ from: accounts[0], gas: 8000000, value: param.price });
            })
            .then((_estimatedGas: number) => {
                const gasLimit = parseInt((_estimatedGas * 1.5).toString());
                const transactionParams = {
                    from: accounts[0],
                    gasPrice: gasPrice,
                    gas: gasLimit > 8000000 ? 8000000 : gasLimit,
                    value: param.price,
                };

                if (param.callType === enumCallMethodType.SEND) {
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
            })
            .catch((error: any) => {
                console.error(error);
                reject(error);
            });
    });
