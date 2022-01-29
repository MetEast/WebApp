import { essentialsConnector } from 'src/components/ConnectWallet/EssentialConnectivity';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3';

export const getEssentialWalletAddress = () => {
    const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
    console.log("walletConnectProvider", walletConnectProvider);
    return walletConnectProvider.accounts;
};

export const getEssentialWalletBalance = async () => {
    const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
    console.log("walletConnectProvider", walletConnectProvider);
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);
    const accounts = await walletConnectWeb3.eth.getAccounts();
    console.log("accounts", accounts);
    const balance = await walletConnectWeb3.eth.getBalance(accounts[0]);
    console.log("balance", balance);
    return balance;
};
  