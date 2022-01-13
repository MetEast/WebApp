import { FC, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { injected, walletconnect, walletlink } from "./connectors";
import { useEagerConnect, useInactiveListener } from "./hook";

import coinbaseLogo from "./coinbase.webp";
import metamaskLogo from "./metamask.webp";
import walletConnectLogo from "./walletconnect.svg";
import { Modal, Box, Button, TextField, Grid, Stack } from '@mui/material';
import { H2Typography, H5Typography } from 'src/core/typographies';

import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect, WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { UnsupportedChainIdError } from "@web3-react/core";

// Modal.setAppElement("#root");

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
  WalletConnect = "Pay with Essentials",
  Injected = "Pay with MetaMask",
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

const ConnectWallet: FC = () => {
  const context = useWeb3React<Web3Provider>();
  const [errors, setErrors] = useState<string[] | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { activate, active, error, library, chainId } = context;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activatingConnector, setActivatingConnector] = useState<any>();

  useEffect(() => {
    console.log(active, library, chainId);
    setActivatingConnector(undefined);
    if (active) {
      setShowModal(false);
    }
    if (error) {
      setErrors([getErrorMessage(error)]);
    }
  }, [active, error, library, chainId]);

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager || !!activatingConnector);
  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        Connect Wallet
      </Button>
        {/* {errors && <Errors errors={errors} />} */}
        <Modal open={showModal}>
            <Box
                sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: 500,
                    bgcolor: 'white',
                    boxShadow: 24,
                    pl: 8,
                    pr: 8,
                    pt: 4,
                    pb: 4,
                }}
            >
                <Button variant="outlined" onClick={() => setShowModal(false)}>
                    Back
                </Button>
                <H2Typography mt={3} mb={5.5} textAlign={"center"}>
                    Connect Wallet
                </H2Typography>
                <Stack direction="column" spacing={1}>
                  {Object.entries(connectorsByName).map(([name, value]) => {
                    const currentConnector = value;
                    const activating = currentConnector === activatingConnector;
                    return (
                      <Button
                        key={name}
                        onClick={() => {
                          console.log(name);
                          setActivatingConnector(currentConnector);
                          activate(value);
                        }}
                        sx={{
                          bgcolor: '#FFEAD8',
                          color: 'text',
                        }}
                      >
                        {activating && <>Loading</>}
                        {name}
                      </Button>
                    );
                  })}
                </Stack>
                
            </Box>
        </Modal>
          
    </>
  );
};

export default ConnectWallet;
