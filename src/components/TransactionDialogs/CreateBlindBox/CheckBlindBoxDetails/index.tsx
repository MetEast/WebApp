import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import ELAPrice from 'src/components/ELAPrice';
import { useStyles, InfoItemWrapper } from './styles';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { create } from 'ipfs-http-client';
import { createHash } from 'crypto';
import ModalDialog from 'src/components/ModalDialog';
import WaitingConfirm from '../../Others/WaitingConfirm';

const client = create({ url: process.env.REACT_APP_IPFS_UPLOAD_URL });

export interface ComponentProps {}

const CheckBlindBoxDetails: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [didCookies] = useCookies(['METEAST_DID']);
    const [tokenCookies] = useCookies(['METEAST_TOKEN']);
    const [loadingDlgOpened, setLoadingDlgOpened] = useState<boolean>(false);

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

    const createFetchParam = () =>
        new Promise((resolve, reject) => {
            if (!dialogState.crtBlindImage) reject('no file');
            try {
                const fetchParams = {
                    token: tokenCookies.METEAST_TOKEN,
                    did: didCookies.METEAST_DID,
                    title: dialogState.crtBlindTitle,
                    description: dialogState.crtBlindDescription,
                    authorDescription: dialogState.crtBlindAuthorDescription,
                    filename: dialogState.crtBlindImage,
                    tokenId: dialogState.crtBlindItem.value,
                    status: dialogState.crtBlindStatus,
                    copies: dialogState.crtBlindQuantity,
                    price: dialogState.crtBlindPrice,
                    saleBegin: dialogState.crtBlindSaleBegin,
                    saleEnd: dialogState.crtBlindSaleEnd,
                    likes: dialogState.crtBlindLikes,
                    views: dialogState.crtBlindViews,
                    purchases: dialogState.crtBlindPurchases,
                    sort: dialogState.crtBlindSort.value,
                };
                resolve(fetchParams);
            } catch (error) {
                reject(error);
            }
        });

    const uploadBlindBoxInfo = (imgUri: string) =>
        new Promise((resolve, reject) => {
            // Create an object of formData
            const formData = new FormData();
            formData.append('token', tokenCookies.METEAST_TOKEN);
            formData.append('did', didCookies.METEAST_DID);
            formData.append('title', dialogState.crtBlindTitle);
            formData.append('description', dialogState.crtBlindDescription);
            formData.append('authorDescription', dialogState.crtBlindAuthorDescription);
            formData.append('file', imgUri);
            formData.append(
                'tokenIds',
                '38849327409920734835477143637279288805665423210925588473023669586505758977592',
            );
            formData.append('status', dialogState.crtBlindStatus);
            formData.append('maxQuantity', dialogState.crtBlindQuantity.toString());
            formData.append('maxPrice', dialogState.crtBlindPrice.toString());
            formData.append('saleBegin', dialogState.crtBlindSaleBegin);
            formData.append('saleEnd', dialogState.crtBlindSaleEnd);
            formData.append('maxLikes', dialogState.crtBlindLikes.toString());
            formData.append('maxViews', dialogState.crtBlindViews.toString());
            formData.append('maxPurchases', dialogState.crtBlindPurchases.toString());
            formData.append('sort', dialogState.crtBlindSort.value);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            };
            axios
                .post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/createBlindBox`, formData, config)
                .then((respose) => {
                    console.log(respose);
                    resolve(true);
                });
            // fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/createBlindBox`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(fetchParams),
            // })
            //     .then((response) => response.json())
            //     .then((data) => {
            //         if (data.code === 200) {
            //             alert('success');
            //             resolve(true);
            //         } else {
            //             alert('error');
            //             console.log(data);
            //             resolve(false);
            //         }
            //     })
            //     .catch((error) => {
            //         enqueueSnackbar(
            //             `Failed to call the backend API. Check your connectivity and make sure ${process.env.REACT_APP_BACKEND_URL} is reachable.`,
            //             { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' } },
            //         );
            //         reject(error);
            //     });
        });

    const handleCreateBlindBox = () => {
        if (!dialogState.crtBlindImage) return;
        if (dialogState.crtBlindTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'warning',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        sendIpfsImage(dialogState.crtBlindImage)
            .then((added: any) => {
                const imgUri = `0x${createHash('sha256').update(added.path).digest('hex')}`;
                return uploadBlindBoxInfo(imgUri);
            })
            .then((success) => {
                alert(success);
                if (success) {
                    enqueueSnackbar('Upload data to backend servce succeed!', {
                        variant: 'success',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                } else {
                    enqueueSnackbar('Upload data to backend servce error!', {
                        variant: 'warning',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                }
            })
            .then(() => {
                return true;
            })
            .catch((error) => {
                enqueueSnackbar('Upload data to backend servce error!', {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
            });
    };

    const classes = useStyles();
    return (
        <>
            <Stack
                spacing={5}
                width={400}
                maxHeight={'60vh'}
                sx={{ overflowY: 'auto', overflowX: 'hidden' }}
                className={classes.container}
            >
                <Stack alignItems="center">
                    <PageNumberTypo>2 of 2</PageNumberTypo>
                    <DialogTitleTypo>Check Blind Box Details</DialogTitleTypo>
                </Stack>
                <Stack paddingX={6} paddingY={4} spacing={1} borderRadius={4} sx={{ background: '#F0F1F2' }}>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Title</DetailedInfoTitleTypo>
                        <Typography fontSize={20} fontWeight={500}>
                            {dialogState.crtBlindTitle}
                        </Typography>
                    </InfoItemWrapper>
                    <InfoItemWrapper>
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
                    </InfoItemWrapper>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo># Of Copies</DetailedInfoTitleTypo>
                        <DetailedInfoLabelTypo>{dialogState.crtBlindQuantity}</DetailedInfoLabelTypo>
                    </InfoItemWrapper>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Price</DetailedInfoTitleTypo>
                        <ELAPrice price_ela={dialogState.crtBlindPrice} price_ela_fontsize={14} />
                    </InfoItemWrapper>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Sale Begins</DetailedInfoTitleTypo>
                        <DetailedInfoLabelTypo>{dialogState.crtBlindSaleBegin}</DetailedInfoLabelTypo>
                    </InfoItemWrapper>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Sale Ends</DetailedInfoTitleTypo>
                        <DetailedInfoLabelTypo>{dialogState.crtBlindSaleEnd}</DetailedInfoLabelTypo>
                    </InfoItemWrapper>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Max num of purchases</DetailedInfoTitleTypo>
                        <DetailedInfoLabelTypo>{dialogState.crtBlindPurchases}</DetailedInfoLabelTypo>
                    </InfoItemWrapper>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Description</DetailedInfoTitleTypo>
                        <DetailedInfoLabelTypo textAlign="right">
                            {dialogState.crtBlindDescription}
                        </DetailedInfoLabelTypo>
                    </InfoItemWrapper>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Author Description</DetailedInfoTitleTypo>
                        <DetailedInfoLabelTypo textAlign="right">
                            {dialogState.crtBlindAuthorDescription}
                        </DetailedInfoLabelTypo>
                    </InfoItemWrapper>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Items</DetailedInfoTitleTypo>
                        <DetailedInfoLabelTypo textAlign="right">
                            {dialogState.crtBlindItem.value}
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
                                    createBlindBoxDlgStep: 0,
                                    crtBlindTitle: '',
                                    crtBlindDescription: '',
                                    crtBlindAuthorDescription: '',
                                    crtBlindImage: new File([''], ''),
                                    crtBlindItem: { label: '', value: '' },
                                    crtBlindStatus: 'offline',
                                    crtBlindQuantity: 0,
                                    crtBlindPrice: 0,
                                    crtBlindSaleBegin: '',
                                    crtBlindSaleEnd: '',
                                    crtBlindLikes: 0,
                                    crtBlindViews: 0,
                                    crtBlindPurchases: 0,
                                    crtBlindSort: { label: '', value: '' },
                                });
                            }}
                        >
                            Back
                        </SecondaryButton>
                        <PrimaryButton fullWidth onClick={handleCreateBlindBox}>
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

export default CheckBlindBoxDetails;
