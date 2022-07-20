import React, { useState } from 'react';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useSignInContext } from 'src/context/SignInContext';
import { defaultDlgState, useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import { addressZero, isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { callContractMethod } from 'src/components/ContractMethod';
import { blankContractMethodParam } from 'src/constants/init-constants';
import { getTime } from 'src/services/common';
import { enumMetEastContractType } from 'src/types/contract-types';
import { enumAuthType } from 'src/types/auth-types';
import { contractConfig } from 'src/config';

export interface ComponentProps {}

const CheckSaleDetails: React.FC<ComponentProps> = (): JSX.Element => {
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
    const handleSell = () => {
        if (dialogState.sellTxFee > signInDlgState.walletBalance) {
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

        const _quoteToken = addressZero; // ELA

        callContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: enumMetEastContractType.METEAST,
            method: 'setApprovalForAll',
            price: '0',
            operator: contractConfig.METEAST_MARKET_CONTRACT,
            approved: true,
        })
            .then((result: string) => {
                if (result === 'success') {
                    enqueueSnackbar(`Set approval succeed!`, {
                        variant: 'success',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                }
                callContractMethod(
                    walletConnectWeb3,
                    dialogState.sellSaleType === 'buynow'
                        ? {
                              ...blankContractMethodParam,
                              contractType: enumMetEastContractType.METEAST_MARKET,
                              method: 'createOrderForSale',
                              price: '0',
                              tokenId: dialogState.mintTokenId,
                              quoteToken: _quoteToken,
                              _price: BigInt(dialogState.sellPrice * 1e18).toString(),
                              didUri: signInDlgState.didUri,
                              isBlindBox: false,
                          }
                        : {
                              ...blankContractMethodParam,
                              contractType: enumMetEastContractType.METEAST_MARKET,
                              method: 'createOrderForAuction',
                              price: '0',
                              tokenId: dialogState.mintTokenId,
                              quoteToken: _quoteToken,
                              _price: BigInt(dialogState.sellMinPrice * 1e18).toString(),
                              endTime: dialogState.sellSaleEnds.toString(),
                              didUri: signInDlgState.didUri,
                          },
                )
                    .then((txHash: string) => {
                        enqueueSnackbar(
                            `Order for ${dialogState.sellSaleType === 'buynow' ? 'sale' : 'auction'} succeed!`,
                            {
                                variant: 'success',
                                anchorOrigin: { horizontal: 'right', vertical: 'top' },
                            },
                        );
                        if (!unmounted) {
                            setDialogState({
                                ...updatedState,
                                createNFTDlgOpened: true,
                                createNFTDlgStep: 5,
                                sellTxHash: txHash,
                                waitingConfirmDlgOpened: false,
                            });
                        }
                    })
                    .catch((error) => {
                        enqueueSnackbar(
                            `Order for ${dialogState.sellSaleType === 'buynow' ? 'sale' : 'auction'} error.`,
                            {
                                variant: 'error',
                                anchorOrigin: { horizontal: 'right', vertical: 'top' },
                            },
                        );
                        if (!unmounted) {
                            setDialogState({
                                ...updatedState,
                                createNFTDlgOpened: false,
                                waitingConfirmDlgOpened: false,
                                errorMessageDlgOpened: true,
                            });
                        }
                    });
            })
            .catch((error) => {
                enqueueSnackbar(`Set approval error.`, {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                if (!unmounted) {
                    setDialogState({
                        ...updatedState,
                        createNFTDlgOpened: false,
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
        <Stack spacing={5} width={340}>
            <Stack alignItems="center">
                <PageNumberTypo>2 of 2</PageNumberTypo>
                <DialogTitleTypo>Check Sale Details</DialogTitleTypo>
            </Stack>
            <Stack alignItems="center" paddingX={6} paddingY={4} borderRadius={4} sx={{ background: '#F0F1F2' }}>
                <Grid container rowSpacing={0.5}>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Sale type</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{dialogState.sellSaleType}</DetailedInfoLabelTypo>
                    </Grid>
                    {dialogState.sellSaleType === 'auction' && (
                        <>
                            <Grid item xs={6}>
                                <DetailedInfoTitleTypo>Min Bid</DetailedInfoTitleTypo>
                            </Grid>
                            <Grid item xs={6}>
                                <DetailedInfoLabelTypo>{dialogState.sellMinPrice} ELA</DetailedInfoLabelTypo>
                            </Grid>
                            <Grid item xs={6}>
                                <DetailedInfoTitleTypo>Sale Ends</DetailedInfoTitleTypo>
                            </Grid>
                            <Grid item xs={6}>
                                <DetailedInfoLabelTypo>
                                    in{' '}
                                    {getTime(dialogState.sellSaleEnds.toString()).date +
                                        ' ' +
                                        getTime(dialogState.sellSaleEnds.toString()).time}
                                </DetailedInfoLabelTypo>
                            </Grid>
                        </>
                    )}
                    {dialogState.sellSaleType === 'buynow' && (
                        <>
                            <Grid item xs={6}>
                                <DetailedInfoTitleTypo>Price</DetailedInfoTitleTypo>
                            </Grid>
                            <Grid item xs={6}>
                                <DetailedInfoLabelTypo>{dialogState.sellPrice} ELA</DetailedInfoLabelTypo>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Stack>
            <Stack alignItems="center" spacing={1}>
                <Typography fontSize={14} fontWeight={600}>
                    Available: {signInDlgState.walletBalance} ELA
                </Typography>
                <Stack direction="row" width="100%" spacing={2}>
                    <SecondaryButton
                        fullWidth
                        onClick={() => {
                            setDialogState({ ...dialogState, createNFTDlgOpened: true, createNFTDlgStep: 3 });
                        }}
                    >
                        Back
                    </SecondaryButton>
                    <PrimaryButton fullWidth disabled={onProgress} onClick={handleSell}>
                        Confirm
                    </PrimaryButton>
                </Stack>
                <WarningTypo width={240}>
                    In case of payment problems, please contact the official customer service
                </WarningTypo>
            </Stack>
        </Stack>
    );
};

export default CheckSaleDetails;
