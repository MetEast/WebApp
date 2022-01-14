import React, { useState, useEffect } from 'react';
import ModalDialog from 'src/components/ModalDialog';
import ConnectDID from 'src/components/profile/ConnectDID';
import ChooseWallet from 'src/components/profile/ChooseWallet';
import PrivateProfilePage from './profile';

import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
  } from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { UnsupportedChainIdError } from "@web3-react/core";
import { injected, walletconnect, walletlink } from "src/components/ConnectWalletButton/connectors";
import { useEagerConnect, useInactiveListener } from "src/components/ConnectWalletButton/hook";

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

const ProfilePage: React.FC = (): JSX.Element => {
    const context = useWeb3React<Web3Provider>();
    const [errors, setErrors] = useState<string[] | undefined>(undefined);
    const { activate, active, error, library, chainId } = context;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [activatingConnector, setActivatingConnector] = useState<any>();
    const [showModal, setShowModal] = useState<boolean>(true);
    //
    const [step, setStep] = useState<number>(0);
    const handleClick = (newStep: number) => () => {
        setStep(newStep);
    };
    //
    useEffect(() => {
        console.log(active, library, chainId);
        setActivatingConnector(undefined);
        if (active) {
          setShowModal(false);
          setStep(2);
        }
        if (error) {
          setErrors([getErrorMessage(error)]);
        }
      }, [active, error, library, chainId]);
    
      const triedEager = useEagerConnect();
    
      useInactiveListener(!triedEager || !!activatingConnector);
    
      const handleClickConnect = async (wallet: 'walletconnect' | 'elastos' | 'metamask') => {
        let currentConnector: any = null;
        if(wallet === 'metamask') currentConnector = injected;
        else if(wallet === 'elastos') currentConnector = walletlink;
        else if(wallet === 'walletconnect') currentConnector = walletconnect;
        setActivatingConnector(currentConnector);
        await activate(currentConnector);
      };

    return (
        <>
            {(step === 0 || step === 1) && (
                <ModalDialog open={showModal} onClose={() => {}}>
                    {step === 0 && <ConnectDID onConnect={handleClick(1)} />}
                    {step === 1 && <ChooseWallet onConnect={handleClickConnect} />}
                </ModalDialog>
            )}
            {step === 2 && <PrivateProfilePage />}
        </>
    );
};

export default ProfilePage;
