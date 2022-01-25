import { EssentialsConnector } from "@elastosfoundation/essentials-connector-client-browser";
import { connectivity } from "@elastosfoundation/elastos-connectivity-sdk-js";
import { useConnectivityContext } from "src/context/ConnectivityContext";
import WalletConnectProvider from "@walletconnect/web3-provider";


export const essentialsConnector = new EssentialsConnector();

let connectivityInitialized = false;

export function useConnectivitySDK() {
  const [isLinkedToEssentials, setIsLinkedToEssentials] = useConnectivityContext();

  if (connectivityInitialized)
    return;

  console.log("Preparing the Elastos connectivity SDK");
  
  connectivity.registerConnector(essentialsConnector).then(() => {
    connectivityInitialized = true;

    console.log("essentialsConnector", essentialsConnector)
    console.log("Wallet connect provider", essentialsConnector.getWalletConnectProvider());
    // essentialsConnector.getWalletConnectProvider().updateRpcUrl(21, 'https://api-testnet.elastos.io/eth')
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