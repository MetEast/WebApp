import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';
import { connectivity } from '@elastosfoundation/elastos-connectivity-sdk-js';
// import WalletConnectProvider from '@walletconnect/web3-provider';
import { IConnector } from '@elastosfoundation/elastos-connectivity-sdk-js/typings/interfaces/connectors';

export const essentialsConnector = new EssentialsConnector();

let connectivityInitialized = false;

export const initConnectivitySDK = async () => {
    if (connectivityInitialized) {
        // console.log('EssentialsConnector has already initialized.');
        return;
    }

    // console.log('Preparing the Elastos connectivity SDK');
    // unregistear if already registerd
    const arrIConnectors: IConnector[] = connectivity.getAvailableConnectors();
    if (arrIConnectors.findIndex((option) => option.name === essentialsConnector.name) !== -1) {
        connectivity.unregisterConnector(essentialsConnector.name);
        // console.log('unregister connector succeed.');
    }

    connectivity.registerConnector(essentialsConnector).then(() => {
        connectivityInitialized = true;
        // const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();

        // console.log('essentialsConnector', essentialsConnector);
        // console.log('Wallet connect provider', walletConnectProvider);

        const hasLink = isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession();
        // console.log('Has link to essentials?', hasLink);

        // Restore the wallet connect session - TODO: should be done by the connector itself?
        if (hasLink && !essentialsConnector.getWalletConnectProvider().connected)
            essentialsConnector.getWalletConnectProvider().enable();
    });
};

export function isUsingEssentialsConnector() {
    const activeConnector = connectivity.getActiveConnector();
    if (!activeConnector) return false;
    return activeConnector && activeConnector.name === essentialsConnector.name;
}
