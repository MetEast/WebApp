import { EssentialsConnector } from "@elastosfoundation/essentials-connector-client-browser";
import { connectivity } from "@elastosfoundation/elastos-connectivity-sdk-js";
import { useConnectivityContext } from "src/context/ConnectivityContext";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { IConnector } from "@elastosfoundation/elastos-connectivity-sdk-js/typings/interfaces/connectors";


export const essentialsConnector = new EssentialsConnector();

let connectivityInitialized = false;

export const useConnectivitySDK = async() => {
  const [isLinkedToEssentials, setIsLinkedToEssentials] = useConnectivityContext();

  if (connectivityInitialized) {
    console.log("EssentialsConnector has already initialized.");
    return;
  }  

  console.log("Preparing the Elastos connectivity SDK");
  // essentialsConnector.disconnectWalletConnect();

  // unregistear if already registerd
  // console.log(connectivity.getAvailableConnectors());
  // console.log(essentialsConnector.name);
  // console.log(connectivityInitialized)
  const arrIConnectors: IConnector[] = connectivity.getAvailableConnectors();
  if (arrIConnectors.find((option) => option.name === essentialsConnector.name) !== undefined) {
    // console.log(arrIConnectors.find((option) => option.name === essentialsConnector.name));
    await connectivity.unregisterConnector(essentialsConnector.name);
  }
    
  connectivity.registerConnector(essentialsConnector).then(() => {
    connectivityInitialized = true;

    console.log("essentialsConnector", essentialsConnector)
    console.log("Wallet connect provider", essentialsConnector.getWalletConnectProvider());
    
    const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
    // walletConnectProvider.updateRpcUrl(21, 'https://api-testnet.elastos.io/eth')
    // const walletConnectProvider: WalletConnectProvider = new WalletConnectProvider({
    //     rpc: {
    //       20: "https://api.elastos.io/eth",
    //       21: "https://api-testnet.elastos.io/eth",
    //       128: "https://http-mainnet.hecochain.com" // Heco mainnet
    //     },
    //     //bridge: "https://walletconnect.elastos.net/v1", // Tokyo, server with the website
    //     //bridge: "https://walletconnect.elastos.net/v2", // Tokyo, server with the website, v2.0 "relay" server
    //     bridge: "https://wallet-connect.trinity-tech.io/v2", // China
    //     //bridge: "https://walletconnect.trinity-feeds.app/" // Tokyo, standalone server
    //     //bridge: "http://192.168.31.114:5001"
    //     //bridge: "http://192.168.1.6:5001"
    // });

    const hasLink = isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession();
    console.log("Has link to essentials?", hasLink);
    setIsLinkedToEssentials(hasLink);

    console.log("Connected?", walletConnectProvider.connected);

    // Subscribe to accounts change
    walletConnectProvider.on("accountsChanged", (accounts: string[]) => {
      console.log(accounts);
    });

    // Subscribe to chainId change
    walletConnectProvider.on("chainChanged", (chainId: number) => {
      console.log(chainId);
    });

    // Subscribe to session disconnection
    walletConnectProvider.on("disconnect", (code: number, reason: string) => {
      console.log(code, reason);
    });

    // Subscribe to session disconnection
    walletConnectProvider.on("error", (code: number, reason: string) => {
      console.error(code, reason);
    });

    // Restore the wallet connect session - TODO: should be done by the connector itself?
    if (hasLink && !essentialsConnector.getWalletConnectProvider().connected)
      essentialsConnector.getWalletConnectProvider().enable();
  });
}

export function isUsingEssentialsConnector() {
  const activeConnector = connectivity.getActiveConnector();
  if(!activeConnector) return false;
  return activeConnector && activeConnector.name === essentialsConnector.name;
}