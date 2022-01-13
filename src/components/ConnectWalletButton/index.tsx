import { FC, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { injected, walletconnect, walletlink } from "./connectors";
import { useEagerConnect, useInactiveListener } from "./hook";

import coinbaseLogo from "./coinbase.webp";
import metamaskLogo from "./metamask.webp";
import walletConnectLogo from "./walletconnect.svg";
import ModalDialog from 'src/components/ModalDialog';
import ConnectDID from 'src/components/profile/ConnectDID';
import ChooseWallet from 'src/components/profile/ChooseWallet';
import { SxProps } from '@mui/system';
import { PrimaryButton } from 'src/components/Buttons/styles'

import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect, WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { UnsupportedChainIdError } from "@web3-react/core";

import { ethers } from "ethers";


function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    return "An unknown error occurred. Check the console for more details.";
  }
}

enum ConnectorNames {
  WalletConnect = "Essentials",
  Injected = "MetaMask",
  // WalletLink = "Coinbase"
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.Injected]: injected,
  // [ConnectorNames.WalletLink]: walletlink,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logosByName: { [connectorsByName in ConnectorNames]: any } = {
  [ConnectorNames.WalletConnect]: walletConnectLogo,
  [ConnectorNames.Injected]: metamaskLogo,
  // [ConnectorNames.WalletLink]: coinbaseLogo
};

export interface ComponentProps {
    sx?: SxProps;
    children?: JSX.Element | string;
    toAddress: string;
    value?: string;
}

const ConnectWalletButton: React.FC<ComponentProps> = ({sx, children, toAddress, value = "0", ...otherProps}): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const [errors, setErrors] = useState<string[] | undefined>(undefined);
  const { activate, active, error, library, chainId } = context;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activatingConnector, setActivatingConnector] = useState<any>();
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    console.log(active, library, chainId);
    setActivatingConnector(undefined);
    if (active) {
      setShowModal(false);
      handleTransaction(toAddress, value);
    }
    if (error) {
      setErrors([getErrorMessage(error)]);
    }
  }, [active, error, library, chainId]);

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager || !!activatingConnector);

  const handleConnectWallet = () => {
    if(active) setShowModal(false);
    else setShowModal(true);
  };

  const handleClick = async (wallet: 'walletconnect' | 'elastos' | 'metamask') => {
    // alert(wallet);
    let currentConnector: any = null;
    if(wallet === 'metamask') currentConnector = injected;
    else if(wallet === 'elastos') currentConnector = walletlink;
    else if(wallet === 'walletconnect') currentConnector = walletconnect;
    setIsActivating(true);
    await setActivatingConnector(currentConnector);
    await activate(currentConnector);
    setIsActivating(false);
  };

  // transaction
  const handleTransaction = async (to: string, value: string) => {
    if (library) {
      const accounts = await library.listAccounts();
      const params = [
        {
          from: accounts[0],
          to: to, // "0x686c626E48bfC5DC98a30a9992897766fed4Abd3",
          value: ethers.utils.parseUnits(value).toHexString(),
          chainId: chainId,
        },
      ];
      await library
        .send("eth_sendTransaction", params)
        .then()
        .catch((err) => {
          console.log(err);
        });
    }
  };


  return (
    <>
      <PrimaryButton sx={sx} onClick={handleConnectWallet} {...otherProps}>
        {children}
      </PrimaryButton>
      <ModalDialog open={showModal} onClose={() => {}}>
          <ChooseWallet onConnect={handleClick} isWorking={isActivating} />
      </ModalDialog>          
    </>
  );
};

export default ConnectWalletButton;