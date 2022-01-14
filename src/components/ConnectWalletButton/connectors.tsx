import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const RPC_URL_1 =
  "https://mainnet.infura.io/v3/e2d4593179fa4120a217d136a0518efc";
const RPC_URL_4 =
  "https://ropsten.infura.io/v3/e2d4593179fa4120a217d136a0518efc";

const RPC_URLS: { [chainId: number]: string } = {
  1: RPC_URL_1,
  4: RPC_URL_4,
};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
});

// console.log(RPC_URLS[1]);

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  qrcode: true,
});

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: "Global Income Coin",
  supportedChainIds: [1, 3, 4, 5, 42, 10, 137, 69, 420, 80001],
});
