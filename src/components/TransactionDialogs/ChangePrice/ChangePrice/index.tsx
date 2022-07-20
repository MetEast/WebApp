import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import ELAPriceInput from '../../components/ELAPriceInput';
import { useSignInContext } from 'src/context/SignInContext';
import { defaultDlgState, useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { callContractMethod } from 'src/components/ContractMethod';
import { blankContractMethodParam } from 'src/constants/init-constants';
import { enumMetEastContractType } from 'src/types/contract-types';
import { enumAuthType } from 'src/types/auth-types';

export interface ComponentProps {}

const ChangePrice: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [onProgress, setOnProgress] = useState<boolean>(false);
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const { library } = useWeb3React<Web3Provider>();
    const walletConnectWeb3 = new Web3(
        signInDlgState.loginType === enumAuthType.ElastosEssentials
            ? (walletConnectProvider as any)
            : (library?.provider as any),
    );
    const [bidAmount, setBidAmount] = useState<number>(0);
    const [newPriceError, setNewPriceError] = useState<boolean>(false);

    const handleChangePrice = () => {
        setNewPriceError(isNaN(bidAmount) || bidAmount === 0);
        if (isNaN(bidAmount) || bidAmount === 0) return;
        if (dialogState.changePriceTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'error',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }

        setOnProgress(true);
        let unmounted = false;
        const updatedState = { ...dialogState };
        updatedState.waitingConfirmDlgOpened = true;
        updatedState.waitingConfirmDlgTimer = setTimeout(() => {
            setDialogState({
                ...defaultDlgState,
                errorMessageDlgOpened: true,
            });
        }, 120000);
        if (!unmounted) setDialogState(updatedState);

        callContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: enumMetEastContractType.METEAST_MARKET,
            method: 'changeOrderPrice',
            price: '0',
            orderId: dialogState.changePriceOrderId,
            _price: BigInt(bidAmount * 1e18).toString(),
        })
            .then((txHash: string) => {
                enqueueSnackbar('Change place succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                if (!unmounted) {
                    setDialogState({
                        ...updatedState,
                        changePriceDlgOpened: true,
                        changePriceDlgStep: 1,
                        changePriceTxHash: txHash,
                        waitingConfirmDlgOpened: false,
                    });
                }
            })
            .catch((error) => {
                enqueueSnackbar(`Change place error.`, {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                if (!unmounted) {
                    setDialogState({
                        ...updatedState,
                        changePriceDlgOpened: false,
                        waitingConfirmDlgOpened: false,
                        errorMessageDlgOpened: true,
                    });
                }
            })
            .finally(() => {
                setOnProgress(false);
            });
        return () => {
            unmounted = true;
        };
    };

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Change Price</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400} marginTop={1}>
                    Current Price: {dialogState.changePriceCurPrice} ELA
                </Typography>
            </Stack>
            <Stack spacing={2.5}>
                <ELAPriceInput
                    title="New Price"
                    inputValue={bidAmount.toString()}
                    error={newPriceError}
                    errorText="The price is invalid."
                    handleChange={(value: number) => {
                        setBidAmount(value);
                    }}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <SecondaryButton
                    fullWidth
                    onClick={() => {
                        setDialogState({
                            ...dialogState,
                            changePriceCurPrice: 0,
                            // changePriceTxFee: 0,
                            changePriceOrderId: '',
                            changePriceTxHash: '',
                            changePriceDlgOpened: false,
                            changePriceDlgStep: 0,
                        });
                    }}
                >
                    close
                </SecondaryButton>
                <PrimaryButton fullWidth disabled={onProgress} onClick={handleChangePrice}>
                    Confirm
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default ChangePrice;
