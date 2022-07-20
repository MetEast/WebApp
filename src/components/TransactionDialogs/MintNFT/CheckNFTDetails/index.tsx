import React, { useState } from 'react';
import { createHash } from 'crypto';
import { Stack, Box, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import { useSignInContext } from 'src/context/SignInContext';
import { defaultDlgState, useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import { uploadImage2Ipfs, uploadMetaData2Ipfs } from 'src/services/ipfs';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { callContractMethod } from 'src/components/ContractMethod';
import { blankContractMethodParam } from 'src/constants/init-constants';
import { ImageBox } from './styles';
import { reduceUserName } from 'src/services/common';
import { enumMetEastContractType } from 'src/types/contract-types';
import { enumAuthType } from 'src/types/auth-types';

export interface ComponentProps {}

const CheckNFTDetails: React.FC<ComponentProps> = (): JSX.Element => {
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

    const mint2net = (paramObj: any) => {
        enqueueSnackbar('Ipfs upload succeed!', {
            variant: 'success',
            anchorOrigin: { horizontal: 'right', vertical: 'top' },
        });
        let unmounted = false;
        const updatedState = { ...dialogState };
        updatedState.waitingConfirmDlgOpened = true;
        updatedState.progressBar = 70;
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
            method: 'mint',
            price: '0',
            tokenId: paramObj._id,
            tokenUri: paramObj._uri,
            // didUri: paramObj._didUri,
            royaltyFee: dialogState.mintRoyalties * 1e4,
        })
            .then((txHash: string) => {
                enqueueSnackbar('Mint token succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                if (!unmounted) {
                    setDialogState({
                        ...updatedState,
                        createNFTDlgOpened: true,
                        createNFTDlgStep: 2,
                        mintTxHash: txHash,
                        mintTokenId: paramObj._id,
                        mintTokenUri: paramObj._uri,
                        // mintDidUri: paramObj._didUri,
                        progressBar: 100,
                        waitingConfirmDlgOpened: false,
                    });
                }
            })
            .catch((error) => {
                enqueueSnackbar(`Mint token error.`, {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                if (!unmounted) {
                    setDialogState({
                        ...updatedState,
                        createNFTDlgOpened: false,
                        waitingConfirmDlgOpened: false,
                        errorMessageDlgOpened: true,
                        progressBar: 0,
                    });
                }
            });
        return () => {
            unmounted = true;
        };
    };

    const uploadData = () =>
        new Promise((resolve, reject) => {
            let unmounted = false;
            let _id = '';
            let _uri = '';
            if (!dialogState.mintFile) return;
            uploadImage2Ipfs(dialogState.mintFile)
                .then((added: any) => {
                    // Hash of image path - tokenId
                    _id = `0x${createHash('sha256').update(added.origin.path).digest('hex')}`;
                    if (!unmounted) setDialogState({ ...dialogState, progressBar: 25 });
                    return uploadMetaData2Ipfs(
                        added,
                        signInDlgState.userDid,
                        signInDlgState.userName,
                        signInDlgState.userDescription,
                        dialogState.mintTitle,
                        dialogState.mintIntroduction,
                        dialogState.mintCategory.value,
                    );
                })
                .then((metaRecv: any) => {
                    // tokenUri
                    _uri = `meteast:json:${metaRecv.path}`;
                    if (!unmounted) setDialogState({ ...dialogState, progressBar: 50 });
                    resolve({ _id, _uri });
                })
                .catch((error) => {
                    reject(error);
                });
            return () => {
                unmounted = true;
            };
        });

    const handleMint = () => {
        if (!dialogState.mintFile) return;
        if (dialogState.mintTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'error',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        setOnProgress(true);
        uploadData()
            .then((paramObj) => mint2net(paramObj))
            .finally(() => {
                setOnProgress(false);
            });
    };

    return (
        <Stack spacing={5} width={360}>
            <Stack alignItems="center">
                <PageNumberTypo>2 of 2</PageNumberTypo>
                <DialogTitleTypo>Check NFT Details</DialogTitleTypo>
            </Stack>
            <Stack
                alignItems="center"
                spacing={2}
                paddingX={4}
                paddingY={4}
                borderRadius={4}
                sx={{ background: '#F0F1F2' }}
            >
                <Box position="relative" borderRadius={4.5} overflow="hidden" sx={{ width: '100%', paddingTop: '75%' }}>
                    <ImageBox>
                        <img
                            src={!dialogState.mintFile ? '' : URL.createObjectURL(dialogState.mintFile)}
                            alt="file preview"
                        />
                    </ImageBox>
                </Box>
                <Grid container>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Item</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>
                            {dialogState.mintTitle.length > 40
                                ? reduceUserName(dialogState.mintTitle, 20)
                                : dialogState.mintTitle}
                        </DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Collection</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{dialogState.mintCategory.label}</DetailedInfoLabelTypo>
                    </Grid>
                    {/* <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Tx Fees</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{dialogState.mintTxFee} ELA</DetailedInfoLabelTypo>
                    </Grid> */}
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
                            setDialogState({
                                ...dialogState,
                                createNFTDlgOpened: true,
                                createNFTDlgStep: 0,
                                progressBar: 0,
                            });
                        }}
                    >
                        Back
                    </SecondaryButton>
                    <PrimaryButton fullWidth disabled={onProgress} onClick={handleMint}>
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

export default CheckNFTDetails;
