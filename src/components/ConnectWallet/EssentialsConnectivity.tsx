import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';
import { connectivity } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { IConnector } from '@elastosfoundation/elastos-connectivity-sdk-js/typings/interfaces/connectors';

export const essentialsConnector = new EssentialsConnector();

let connectivityInitialized = false;

export const initConnectivitySDK = async () => {
    if (connectivityInitialized) {
        return;
    }

    // unregistear if already registerd
    const arrIConnectors: IConnector[] = connectivity.getAvailableConnectors();
    if (arrIConnectors.findIndex((option) => option.name === essentialsConnector.name) !== -1) {
        connectivity.unregisterConnector(essentialsConnector.name);
    }

    connectivity.registerConnector(essentialsConnector).then(() => {
        connectivityInitialized = true;
        const hasLink = isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession();

        if (hasLink && !essentialsConnector.getWalletConnectProvider().connected)
            essentialsConnector.getWalletConnectProvider().enable();
    });
};

export function isUsingEssentialsConnector() {
    const activeConnector = connectivity.getActiveConnector();
    if (!activeConnector) return false;
    return activeConnector && activeConnector.name === essentialsConnector.name;
}
