import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { injected, walletconnect, walletlink } from "./connectors";
import { useEagerConnect, useInactiveListener } from "./hook";
import { mint, mintEther } from "../ContractMethod";

// import coinbaseLogo from "./coinbase.webp";
import metamaskLogo from "./metamask.webp";
import walletConnectLogo from "./walletconnect.svg";
import ModalDialog from 'src/components/ModalDialog';
import ChooseWallet from 'src/components/profile/ChooseWallet';
import { SxProps } from '@mui/system';
import { PrimaryButton } from 'src/components/Buttons/styles'

import {
  // InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect /* , WalletConnectConnector */ } from "@web3-react/walletconnect-connector";
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
    toAddress?: string;
    value?: string;
    method?: string;
}

const ConnectWalletButton: React.FC<ComponentProps> = ({sx, children, toAddress, value = "0", method, ...otherProps}): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { activate, active, error, library, chainId } = context;
  const [errors, setErrors] = useState<string[] | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activatingConnector, setActivatingConnector] = useState<any>();
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    console.log(active, library, chainId);
    setActivatingConnector(undefined);
    if (active) {
      setShowModal(false);
      // settle transaction
      // handleTransaction(toAddress, value);
    }
    if (error) {
      setErrors([getErrorMessage(error)]);
    }
  }, [active, error, library, chainId]);

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager || !!activatingConnector);

  //////////////////////// Select Wallet ////////////////////////
  const handleChooseWallet = async (wallet: 'walletconnect' | 'elastos' | 'metamask') => {
    // alert(wallet);
    let currentConnector: any = null;
    if(wallet === 'metamask') currentConnector = injected;
    else if(wallet === 'elastos') currentConnector = walletlink;
    else if(wallet === 'walletconnect') currentConnector = walletconnect;
    setIsActivating(true);
    setActivatingConnector(currentConnector);
    await activate(currentConnector);
    setIsActivating(false);
    setShowModal(false);
  };

  //////////////////////// Connect Wallet ////////////////////////
  const handleConnectWallet = () => {
    if(active) {
      setShowModal(false);      
      // handleTransaction(toAddress, value);
      handleMint(2794, "feeds:image:QmYNwHo2vuLYTeJMA8BPAesW7uufRAX31o6mjaE4zQMRzQ", 100000);
    }
    else setShowModal(true);
  };

  //////////////////////// Handle Transaction ////////////////////////
  const handleTransaction = async (to: string, value: string) => {
    console.log(active, library, chainId);
    if (library) {
      const accounts = await library.listAccounts();
      if(to.length !== 42) alert("Invalid recipient address.");
      const params = [
        {
          from: accounts[0],
          to: to, //"0x24e16f04e84d435F0Bb0380801a6f8C1a543618A",
          value: ethers.utils.parseUnits(value).toHexString(),
          chainId: 21, // 20
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

  const handleMint = async (tokenId: number, uri: string, royaltyFee: number) => {
    console.log(active, library, chainId);
    if (library) {
      // const accounts = await library.listAccounts();
      await mintEther(tokenId, uri, royaltyFee)
        .catch((err) => {
          console.log(err);
        });
    }
  }


  return (
    <>
      <PrimaryButton sx={sx} onClick={handleConnectWallet} {...otherProps}>
        {children}
      </PrimaryButton>
      <ModalDialog open={showModal} onClose={() => {}}>
          <ChooseWallet onConnect={handleChooseWallet} isWorking={isActivating} />
      </ModalDialog>          
    </>
  );
};

export default ConnectWalletButton;
