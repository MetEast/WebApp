import React, { useState } from 'react';
import { createHash } from 'crypto';
import { Stack, Box, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import { uploadDidUri2Ipfs, uploadImage2Ipfs, uploadMetaData2Ipfs } from 'src/services/ipfs';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { callContractMethod } from 'src/components/ContractMethod';
import { blankContractMethodParam } from 'src/constants/init-constants';

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
        signInDlgState.loginType === '1' ? (walletConnectProvider as any) : (library?.provider as any),
    );

    const mint2net = (paramObj: any) => {
        enqueueSnackbar('Ipfs upload succeed!', {
            variant: 'success',
            anchorOrigin: { horizontal: 'right', vertical: 'top' },
        });
        setDialogState({ ...dialogState, waitingConfirmDlgOpened: true, mintProgress: 70 });
        const timer = setTimeout(() => {
            setDialogState({ ...dialogState, errorMessageDlgOpened: true, waitingConfirmDlgOpened: false });
        }, 120000);
        callContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: 1,
            method: 'mint',
            price: '0',
            tokenId: paramObj._id,
            tokenUri: paramObj._uri,
            didUri: paramObj._didUri,
            royaltyFee: dialogState.mintRoyalties * 1e4,
        })
            .then((txHash: string) => {
                enqueueSnackbar('Mint token succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({
                    ...dialogState,
                    createNFTDlgOpened: true,
                    createNFTDlgStep: 2,
                    mintTxHash: txHash,
                    mintTokenId: paramObj._id,
                    mintTokenUri: paramObj._uri,
                    mintDidUri: paramObj._didUri,
                    mintProgress: 100,
                    waitingConfirmDlgOpened: false,
                });
            })
            .catch((error) => {
                enqueueSnackbar(`Mint token error: ${error}!`, {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({
                    ...dialogState,
                    createNFTDlgOpened: false,
                    waitingConfirmDlgOpened: false,
                    errorMessageDlgOpened: true,
                    mintProgress: 0,
                });
            })
            .finally(() => {
                clearTimeout(timer);
            });
    };

    const uploadData = () =>
        new Promise((resolve, reject) => {
            let _id = '';
            let _uri = '';
            let _didUri = '';
            if (!dialogState.mintFile) return;
            uploadImage2Ipfs(dialogState.mintFile)
                .then((added: any) => {
                    // Hash of image path - tokenId
                    _id = `0x${createHash('sha256').update(added.path).digest('hex')}`;
                    setDialogState({ ...dialogState, mintProgress: 10 });
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
                    setDialogState({ ...dialogState, mintProgress: 30 });
                    return uploadDidUri2Ipfs(
                        signInDlgState.userDid,
                        signInDlgState.userName,
                        signInDlgState.userDescription,
                    );
                })
                .then((didRecv: any) => {
                    // didUri
                    _didUri = `meteast:json:${didRecv.path}`;
                    setDialogState({ ...dialogState, mintProgress: 50 });
                    resolve({ _id, _uri, _didUri });
                })
                .catch((error) => {
                    reject(error);
                });
        });

    const handleMint = () => {
        if (!dialogState.mintFile) return;
        if (dialogState.mintTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'warning',
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
        <Stack spacing={5} width={340}>
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
                <Box borderRadius={4.5} maxHeight={120} overflow="hidden">
                    <img
                        src={!dialogState.mintFile ? '' : URL.createObjectURL(dialogState.mintFile)}
                        alt="file preview"
                        width="100%"
                        height="100%"
                        style={{ objectFit: 'cover' }}
                    />
                </Box>
                <Grid container>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Item</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{dialogState.mintTitle}</DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Collection</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{dialogState.mintCategory.label}</DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Tx Fees</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{dialogState.mintTxFee} ELA</DetailedInfoLabelTypo>
                    </Grid>
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
                                mintTitle: '',
                                // mintAuthor: '',
                                mintIntroduction: '',
                                mintCategory: { label: '', value: '' },
                                mintFile: new File([''], ''),
                                mintTxFee: 0,
                                mintTokenId: '',
                                mintTokenUri: '',
                                mintDidUri: '',
                                mintProgress: 0,
                                createNFTDlgOpened: true,
                                createNFTDlgStep: 0,
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
