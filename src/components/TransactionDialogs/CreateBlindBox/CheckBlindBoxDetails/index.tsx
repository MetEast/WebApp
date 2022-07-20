import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import ELAPrice from 'src/components/ELAPrice';
import { useStyles, InfoItemWrapper } from './styles';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useSignInContext } from 'src/context/SignInContext';
import { defaultDlgState, useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { addressZero, isInAppBrowser } from 'src/services/wallet';
import { uploadImage2Ipfs } from 'src/services/ipfs';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { callContractMethod } from 'src/components/ContractMethod';
import { blankContractMethodParam } from 'src/constants/init-constants';
import { getTime } from 'src/services/common';
import { contractConfig, serverConfig } from 'src/config';
import { enumMetEastContractType } from 'src/types/contract-types';
import { enumAuthType } from 'src/types/auth-types';

export interface ComponentProps {}

const CheckBlindBoxDetails: React.FC<ComponentProps> = (): JSX.Element => {
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

    const uploadCreatedBlindBoxInfo = (asset: string, thumbnail: string) =>
        new Promise((resolve: (value: boolean) => void, reject: (value: string) => void) => {
            let body = {
                name: dialogState.crtBlindTitle,
                description: dialogState.crtBlindDescription,
                asset,
                thumbnail,
                tokenIds: dialogState.crtBlindTokenIds.split(';'),
                maxQuantity: dialogState.crtBlindQuantity,
                blindPrice: dialogState.crtBlindPrice,
                saleBegin: parseInt(dialogState.crtBlindSaleBegin),
                maxPurchase: dialogState.crtBlindPurchases,
            };

            const config = {
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${signInDlgState.token}`,
                },
            };
            axios
                .post(`${serverConfig.metServiceUrl}/api/v1/createBlindBox`, JSON.stringify(body), config)
                .then((response) => {
                    if (response.data.status === 200) {
                        resolve(true);
                    } else resolve(false);
                })
                .catch((e) => {
                    reject(e);
                });
        });

    const callCreateOrderForSaleBatch = () =>
        new Promise((resolve: (value: string) => void, reject: (error: string) => void) => {
            if (!dialogState.crtBlindImage) return;
            if (dialogState.crtBlindTxFee > signInDlgState.walletBalance) {
                enqueueSnackbar('Insufficient balance!', {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                reject('InsufficientBalance');
                return;
            }
            setOnProgress(true);
            let unmounted = false;
            const updatedState = { ...dialogState };
            updatedState.waitingConfirmDlgOpened = true;
            updatedState.progressBar = 20;
            updatedState.waitingConfirmDlgTimer = setTimeout(() => {
                setDialogState({
                    ...defaultDlgState,
                    errorMessageDlgOpened: true,
                });
            }, 120000);
            if (!unmounted) setDialogState(updatedState);

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
                    if (!unmounted) setDialogState({ ...updatedState, waitingConfirmDlgOpened: true, progressBar: 40 });
                    const _quoteToken = addressZero; // ELA
                    const _inTokenIds: string[] = dialogState.crtBlindTokenIds.split(';');
                    const _inQuoteTokens: string[] = Array(_inTokenIds.length);
                    const _inPrices: string[] = Array(_inTokenIds.length);
                    _inQuoteTokens.fill(_quoteToken);
                    _inPrices.fill(BigInt(dialogState.crtBlindPrice * 1e18).toString());

                    callContractMethod(walletConnectWeb3, {
                        ...blankContractMethodParam,
                        contractType: enumMetEastContractType.METEAST_MARKET,
                        method: 'createOrderForSaleBatch',
                        price: '0',
                        tokenIds: _inTokenIds,
                        quoteTokens: _inQuoteTokens,
                        _prices: _inPrices,
                        didUri: signInDlgState.didUri,
                        isBlindBox: true,
                    })
                        .then((txHash: string) => {
                            if (!unmounted) {
                                setDialogState({ ...updatedState, progressBar: 60, waitingConfirmDlgOpened: false });
                                resolve(txHash);
                            }
                        })
                        .catch((error) => {
                            enqueueSnackbar(`Create Mystery Box error.`, {
                                variant: 'error',
                                anchorOrigin: { horizontal: 'right', vertical: 'top' },
                            });
                            if (!unmounted) {
                                setDialogState({
                                    ...updatedState,
                                    createBlindBoxDlgOpened: false,
                                    waitingConfirmDlgOpened: false,
                                    errorMessageDlgOpened: true,
                                    progressBar: 0,
                                });
                                reject('createOrderForSaleBatchError');
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
                            createBlindBoxDlgOpened: false,
                            waitingConfirmDlgOpened: false,
                            errorMessageDlgOpened: true,
                            progressBar: 0,
                        });
                        reject('setApprovalError');
                    }
                });
            return () => {
                unmounted = true;
            };
        });

    const handleCreateBlindBox = () => {
        let unmounted = false;
        let transactionHash = '';
        callCreateOrderForSaleBatch()
            .then((txHash: string) => {
                transactionHash = txHash;
                return uploadImage2Ipfs(dialogState.crtBlindImage);
            })
            .then((added: any) => {
                if (!unmounted) setDialogState({ ...dialogState, progressBar: 80 });
                return uploadCreatedBlindBoxInfo(
                    `meteast:image:${added.origin.path}`,
                    `meteast:image:${added.thumbnail.path}`,
                );
            })
            .then((success: boolean) => {
                if (success) {
                    enqueueSnackbar(`Create Mystery Box succeed!`, {
                        variant: 'success',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                    if (!unmounted) {
                        setDialogState({
                            ...dialogState,
                            createBlindBoxDlgOpened: true,
                            createBlindBoxDlgStep: 2,
                            crtBlindTxHash: transactionHash,
                            progressBar: 100,
                        });
                    }
                } else {
                    enqueueSnackbar(`Create Mystery Box error.`, {
                        variant: 'error',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                }
            })
            .catch((error) => {
                enqueueSnackbar(`Create Mystery Box error.`, {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
            })
            .finally(() => {
                if (!unmounted) setOnProgress(false);
            });
        return () => {
            unmounted = true;
        };
    };

    const displayItemNames = (names: string) => {
        let ret: string = '';
        if (names !== undefined) {
            const itemNameList: string[] = names.split(';').filter((value: string) => value.length > 0);
            itemNameList.forEach((item: string) => {
                ret += `${item}, `;
            });
            return ret.slice(0, ret.length - 2);
        } else return ret;
    };

    const classes = useStyles();
    return (
        <Stack
            spacing={5}
            width={400}
            maxHeight={'80vh'}
            sx={{ overflowY: 'auto', overflowX: 'hidden' }}
            className={classes.container}
        >
            <Stack alignItems="center">
                <PageNumberTypo>2 of 2</PageNumberTypo>
                <DialogTitleTypo>Check Mystery Box Details</DialogTitleTypo>
            </Stack>
            <Stack paddingX={6} paddingY={4} spacing={1} borderRadius={5} sx={{ background: '#F0F1F2' }}>
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo>Title</DetailedInfoTitleTypo>
                    <Typography fontSize={20} fontWeight={500}>
                        {dialogState.crtBlindTitle}
                    </Typography>
                </InfoItemWrapper>
                {/* <InfoItemWrapper>
                    <DetailedInfoTitleTypo>Status</DetailedInfoTitleTypo>
                    <Typography
                        fontSize={14}
                        fontWeight={500}
                        color="#1EA557"
                        sx={{
                            display: 'inline-block',
                            background: '#C9F5DC',
                            paddingX: 1,
                            paddingY: 0.5,
                            borderRadius: 2,
                        }}
                    >
                        {dialogState.crtBlindStatus}
                    </Typography>
                </InfoItemWrapper> */}
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo># Of Nft</DetailedInfoTitleTypo>
                    <DetailedInfoLabelTypo>{dialogState.crtBlindQuantity}</DetailedInfoLabelTypo>
                </InfoItemWrapper>
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo>Price</DetailedInfoTitleTypo>
                    <ELAPrice price_ela={dialogState.crtBlindPrice} price_ela_fontsize={14} />
                </InfoItemWrapper>
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo>Sale Begins</DetailedInfoTitleTypo>
                    <DetailedInfoLabelTypo>
                        {`${getTime(dialogState.crtBlindSaleBegin).date} ${
                            getTime(dialogState.crtBlindSaleBegin).time
                        }`}
                    </DetailedInfoLabelTypo>
                </InfoItemWrapper>
                {/* <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Sale Ends</DetailedInfoTitleTypo>
                        <DetailedInfoLabelTypo>{dialogState.crtBlindSaleEnd.replace('T', ' ')}</DetailedInfoLabelTypo>
                    </InfoItemWrapper> */}
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo>Max num of purchases</DetailedInfoTitleTypo>
                    <DetailedInfoLabelTypo>{dialogState.crtBlindPurchases}</DetailedInfoLabelTypo>
                </InfoItemWrapper>
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo>Description</DetailedInfoTitleTypo>
                    <DetailedInfoLabelTypo textAlign="right">{dialogState.crtBlindDescription}</DetailedInfoLabelTypo>
                </InfoItemWrapper>
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo>Items</DetailedInfoTitleTypo>
                    <DetailedInfoLabelTypo textAlign="right">
                        {displayItemNames(dialogState.crtBlindTokenNames)}
                    </DetailedInfoLabelTypo>
                </InfoItemWrapper>
            </Stack>
            <Stack alignItems="center" spacing={1}>
                <Typography fontSize={14} fontWeight={600}>
                    Available: {signInDlgState.walletBalance} ELA
                </Typography>
                <Stack direction="row" width="100%" spacing={2}>
                    <SecondaryButton
                        fullWidth
                        onClick={() => {
                            setDialogState({
                                ...dialogState,
                                createBlindBoxDlgOpened: true,
                                createBlindBoxDlgStep: 0,
                                progressBar: 0,
                            });
                        }}
                    >
                        Back
                    </SecondaryButton>
                    <PrimaryButton fullWidth disabled={onProgress} onClick={handleCreateBlindBox}>
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

export default CheckBlindBoxDetails;
