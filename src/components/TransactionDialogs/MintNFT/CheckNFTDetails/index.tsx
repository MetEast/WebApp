import React, { useState } from 'react';
import { create } from 'ipfs-http-client';
import { createHash } from 'crypto';
import { Stack, Box, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import { UserTokenType } from 'src/types/auth-types';
import { useSnackbar } from 'notistack';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { METEAST_CONTRACT_ABI, METEAST_CONTRACT_ADDRESS } from 'src/contracts/MET';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import ModalDialog from 'src/components/ModalDialog';
import WaitingConfirm from '../../Others/WaitingConfirm';
import { isInAppBrowser } from 'src/services/wallet';

const client = create({ url: process.env.REACT_APP_IPFS_UPLOAD_URL });

export interface ComponentProps {}

const CheckNFTDetails: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [tokenCookies] = useCookies(['METEAST_TOKEN']);
    const [loadingDlgOpened, setLoadingDlgOpened] = useState<boolean>(false);
    // const [onProgress, setOnProgress] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();
    const userInfo: UserTokenType =
        tokenCookies.METEAST_TOKEN === undefined
            ? {
                  did: '',
                  name: '',
                  description: '',
                  avatar: '',
                  email: '',
                  exp: 0,
                  iat: 0,
                  type: '',
                  canManageAdmins: false,
              }
            : jwtDecode(tokenCookies.METEAST_TOKEN);
    const { did, name } = userInfo;

    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);
    let onProgress: boolean = false;

    const callMintNFT = async (_tokenId: string, _tokenUri: string, _didUri: string, _royaltyFee: number) => {
        const accounts = await walletConnectWeb3.eth.getAccounts();

        let contractAbi = METEAST_CONTRACT_ABI;
        let contractAddress = METEAST_CONTRACT_ADDRESS; // Elastos Testnet
        let meteastContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);

        let gasPrice = await walletConnectWeb3.eth.getGasPrice();
        console.log('Gas price:', gasPrice);

        console.log('Sending transaction with account address:', accounts[0]);
        let transactionParams = {
            from: accounts[0],
            gasPrice: gasPrice,
            gas: 5000000,
            value: 0,
        };
        let txHash = '';

        setLoadingDlgOpened(true);
        const timer = setTimeout(() => {
            setLoadingDlgOpened(false);
            setDialogState({ ...dialogState, errorMessageDlgOpened: true });
        }, 120000);
        setDialogState({ ...dialogState, mintProgress: 70 });
        meteastContract.methods
            .mint(_tokenId, _tokenUri, _royaltyFee)
            .send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log('transactionHash', hash);
                txHash = hash;
                setLoadingDlgOpened(false);
                clearTimeout(timer);
            })
            .on('receipt', (receipt: any) => {
                console.log('receipt', receipt);
                enqueueSnackbar('Mint token succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({
                    ...dialogState,
                    mintTxHash: txHash,
                    mintTokenId: _tokenId,
                    mintTokenUri: _tokenUri,
                    mintDidUri: _didUri,
                    createNFTDlgOpened: true,
                    createNFTDlgStep: 2,
                    mintProgress: 100,
                });
                onProgress = false;
            })
            .on('error', (error: any, receipt: any) => {
                console.error('error', error);
                enqueueSnackbar('Mint token error!', {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setLoadingDlgOpened(false);
                clearTimeout(timer);
                setDialogState({
                    ...dialogState,
                    createNFTDlgOpened: false,
                    errorMessageDlgOpened: true,
                    mintProgress: 0,
                });
                onProgress = false;
            });
    };

    const mint2net = async (paramObj: any) => {
        enqueueSnackbar('Ipfs upload succeed!', {
            variant: 'success',
            anchorOrigin: { horizontal: 'right', vertical: 'top' },
        });
        await callMintNFT(paramObj._id, paramObj._uri, paramObj._didUri, dialogState.mintRoyalties * 1e4);
        return true;
    };

    const sendIpfsImage = (f: File) =>
        new Promise((resolve, reject) => {
            const reader = new window.FileReader();
            reader.readAsArrayBuffer(f);
            reader.onloadend = async () => {
                try {
                    const fileContent = Buffer.from(reader.result as string);
                    const added = await client.add(fileContent);
                    resolve({ ...added, type: f.type } as any);
                } catch (error) {
                    reject(error);
                }
            };
        });

    const sendIpfsMetaData = (added: any) =>
        new Promise((resolve, reject) => {
            // create the metadata object we'll be storing
            const metaObj = {
                version: '1',
                type: 'image',
                name: dialogState.mintTitle,
                description: dialogState.mintIntroduction,
                creator: {
                    did: did,
                    description: dialogState.mintAuthor,
                    name: name,
                },
                data: {
                    image: `meteast:image:${added.path}`,
                    kind: added.type.replace('image/', ''),
                    size: added.size,
                    thumbnail: `meteast:image:${added.path}`,
                },
                category: dialogState.mintCategory.value,
            };

            try {
                const jsonMetaObj = JSON.stringify(metaObj);
                // add the metadata itself as well
                const metaRecv = Promise.resolve(client.add(jsonMetaObj));
                resolve(metaRecv);
            } catch (error) {
                reject(error);
            }
        });

    const sendIpfsDidJson = () =>
        new Promise((resolve, reject) => {
            // create the metadata object we'll be storing
            const didObj = {
                did: did,
                description: dialogState.mintAuthor,
                name: name,
            };
            try {
                const jsonDidObj = JSON.stringify(didObj);
                // add the metadata itself as well
                const didRecv = Promise.resolve(client.add(jsonDidObj));
                resolve(didRecv);
            } catch (error) {
                reject(error);
            }
        });

    const uploadData = () =>
        new Promise((resolve, reject) => {
            let _id = '';
            let _uri = '';
            let _didUri = '';
            if (!dialogState.mintFile) return;
            sendIpfsImage(dialogState.mintFile)
                .then((added: any) => {
                    // Hash of image path - tokenId
                    _id = `0x${createHash('sha256').update(added.path).digest('hex')}`;
                    setDialogState({ ...dialogState, mintProgress: 10 });
                    return sendIpfsMetaData(added);
                })
                .then((metaRecv: any) => {
                    // tokenUri
                    _uri = `meteast:json:${metaRecv.path}`;
                    setDialogState({ ...dialogState, mintProgress: 30 });
                    return sendIpfsDidJson();
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
        if (!dialogState.mintFile || onProgress) return;
        if (dialogState.mintTXFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'warning',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        onProgress = true;
        uploadData()
            .then((paramObj) => mint2net(paramObj))
            .then((success) => {
                if (!success)
                    enqueueSnackbar('Mint token error!', {
                        variant: 'warning',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
            })
            .catch((error) => {
                enqueueSnackbar('Mint token error!', {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
            });
    };

    return (
        <>
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
                            <DetailedInfoLabelTypo>{dialogState.mintTXFee} ELA</DetailedInfoLabelTypo>
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
                                    mintAuthor: '',
                                    mintIntroduction: '',
                                    mintCategory: { label: '', value: '' },
                                    mintFile: new File([''], ''),
                                    mintTXFee: 0,
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
                        <PrimaryButton fullWidth onClick={handleMint}>
                            Confirm
                        </PrimaryButton>
                    </Stack>
                    <WarningTypo width={240}>
                        In case of payment problems, please contact the official customer service
                    </WarningTypo>
                </Stack>
            </Stack>

            <ModalDialog
                open={loadingDlgOpened}
                onClose={() => {
                    setLoadingDlgOpened(false);
                }}
            >
                <WaitingConfirm />
            </ModalDialog>
        </>
    );
};

export default CheckNFTDetails;
