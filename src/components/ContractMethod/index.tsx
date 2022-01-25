import { Bytes } from 'ethers';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { AbiItem } from 'web3-utils'
import { METEAST_CONTRACT_ABI, METEAST_CONTRACT_ADDRESS, STICKER_CONTRACT_ABI, STICKER_CONTRACT_ADDRESS } from './config';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialConnectivity';
import WalletConnectProvider from "@walletconnect/web3-provider";


export const getABI = (contractAddress: string) => {
    fetch(`${process.env.ETHERSCAN_API_URL}?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.ETHERSACN_API_KEY_TOKEN}`).then(response => {
        response.json().then(res => {
            return res.result;            
        });
    }).catch(err => {
        console.log(err);
    });
};


export const mintEther = async (tokenId: number, uri: string, royaltyFee: number) => {
    try {
        const { ethereum } = window;
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const meteastContract = new ethers.Contract(METEAST_CONTRACT_ADDRESS, METEAST_CONTRACT_ABI, signer);
  
          console.log("Initialize payment");
          let nftTxn = await meteastContract.mint(tokenId, uri, royaltyFee);
  
          console.log("Mining... please wait");
          await nftTxn.wait();
  
          console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
  
        } else {
          console.log("Ethereum object does not exist");
        }
    } catch (err) {
        console.log(err);
    }
}

export const mint = async (tokenId: number, uri: string, royaltyFee: number) => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    const meteast_contract = new web3.eth.Contract(METEAST_CONTRACT_ABI as AbiItem[], METEAST_CONTRACT_ADDRESS);
    return await meteast_contract.methods.mint(tokenId, uri, royaltyFee).call();
}

export const mintBatch = async (tokenIds: number[], uris: string[], royaltyFees: number[]) => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    const meteast_contract = new web3.eth.Contract(METEAST_CONTRACT_ABI as AbiItem[], METEAST_CONTRACT_ADDRESS);
    return await meteast_contract.methods.mintBatch(tokenIds, uris, royaltyFees).call();
}

export const safeMint = async (tokenId: number, uri: string, royaltyFee: number, data: Bytes) => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    const meteast_contract = new web3.eth.Contract(METEAST_CONTRACT_ABI as AbiItem[], METEAST_CONTRACT_ADDRESS);
    return await meteast_contract.methods.safeMint(tokenId, uri, royaltyFee, data).call();
}


export const testETHCall = async (tokenId: string, tokenUri: string, royaltyFee: number) => {
    const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider as any); // HACK


    const accounts = await walletConnectWeb3.eth.getAccounts();

    let contractAbi = METEAST_CONTRACT_ABI;
    let contractAddress = METEAST_CONTRACT_ADDRESS; // Elastos Testnet
    let contract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);

    let gasPrice = await walletConnectWeb3.eth.getGasPrice();
    console.log("Gas price:", gasPrice);

    console.log("Sending transaction with account address:", accounts[0]);
    let transactionParams = {
      from: accounts[0],
      gasPrice: gasPrice,
      gas: 5000000,
      value: 0
    };

    contract.methods.mint(tokenId, tokenUri, royaltyFee).send(transactionParams)
      .on('transactionHash', (hash: any) => {
        console.log("transactionHash", hash);
      })
      .on('receipt', (receipt: any) => {
        console.log("receipt", receipt);
      })
      .on('confirmation', (confirmationNumber: any, receipt: any) => {
        console.log("confirmation", confirmationNumber, receipt);
      })
      .on('error', (error: any, receipt: any) => {
        console.error("error", error);
      });
  }

