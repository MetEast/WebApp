import { essentialsConnector } from 'src/components/ConnectWallet/EssentialConnectivity';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3';

export const getEssentialWalletAddress = () => {
    const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
    return walletConnectProvider.accounts;
};

export const getWalletBalance = async () => {
    const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);
  
    const accounts = await walletConnectWeb3.eth.getAccounts();
    const balance = await walletConnectWeb3.eth.getBalance(accounts[0]);
    return balance;
};
  