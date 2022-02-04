import { essentialsConnector } from 'src/components/ConnectWallet/EssentialConnectivity';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3';

export const getEssentialWalletAddress = () => {
    const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
    return walletConnectProvider.wc.accounts;
};

export const getEssentialWalletBalance = async () => {
    const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
    console.log("walletConnectProvider", walletConnectProvider);
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);
    const accounts = await walletConnectWeb3.eth.getAccounts();
    const balance = await walletConnectWeb3.eth.getBalance(accounts[0]);
    return balance;
};
  