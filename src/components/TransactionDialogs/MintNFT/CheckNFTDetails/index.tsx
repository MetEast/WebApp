import React, { useEffect, useState } from 'react';
import { create } from 'ipfs-http-client';
import { createHash } from 'crypto';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import { useDialogContext } from 'src/context/DialogContext';
import { TypeMintInputForm } from 'src/types/mint-types';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import { useSnackbar } from 'notistack';
import { UserTokenType } from 'src/types/auth-types';
import { callMintNFT } from 'src/components/ContractMethod';

const client = create({url: 'https://ipfs-test.meteast.io/'});

export interface ComponentProps {
    inputData: TypeMintInputForm;
    setInputData: (value: TypeMintInputForm) => void;
    txFee: number;
}

const CheckNFTDetails: React.FC<ComponentProps> = ({ inputData, setInputData, txFee }): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const { file } = inputData;
    const [tokenCookies] = useCookies(["token"]);
    const { enqueueSnackbar } = useSnackbar();
    const userInfo: UserTokenType = jwtDecode(tokenCookies.token);
    const {did, name} = userInfo;
    const defaultValue: TypeMintInputForm = {
        name: '',
        description: '',
        author: '',
        category: { label: '', value: '' },
        file: new File([""], "")
    };

    const mint2net = async (paramObj: any) => {
        enqueueSnackbar('Ipfs upload succeed!', { variant: "success", anchorOrigin: {horizontal: "right", vertical: "top"} });
        const _royaltyFee = 10000;
        await callMintNFT(paramObj._id, paramObj._uri, _royaltyFee, 5000000);
        return true;
    };

    const sendIpfsImage = (f: File) => (
        new Promise((resolve, reject) => {
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(f);
        reader.onloadend = async() => {
            try {
                const fileContent = Buffer.from(reader.result as string)
                const added = await client.add(fileContent)
                resolve({...added, 'type': f.type} as any)
            } catch (error) {
                reject(error);
            }
        }
        })
    )

    const sendIpfsMetaData = (added: any)=>(
        new Promise((resolve, reject) => {
        // create the metadata object we'll be storing
        const metaObj = {
            "version": "1",
            "type": "image",
            "name": inputData.name,
            "description": inputData.description,
            "creator": {
                "did": did, 
                "description": inputData.author,
                "name": name,
            },
            "data": {
                "image": `meteast:image:${added.path}`,
                "kind": added.type.replace('image/', ''),
                "size": added.size,
                "thumbnail": `meteast:image:${added.path}`,
            },
            "adult": false
        }

        try {
            const jsonMetaObj = JSON.stringify(metaObj);
            // add the metadata itself as well
            const metaRecv = Promise.resolve(client.add(jsonMetaObj))
            resolve(metaRecv)
        } catch (error) {
            reject(error);
        }
        })
    )

    const uploadData = ()=>(
        new Promise((resolve, reject) => {
            let _id = '';
            let _uri = '';
            if (!file) return;
            sendIpfsImage(file).then((added: any) => { // Hash of image path
                _id = `0x${createHash('sha256').update(added.path).digest('hex')}`;
                console.log('ipfs hash:-------------', _id);
                return sendIpfsMetaData(added);
            }).then((metaRecv: any) => {
                _uri = `meteast:json:${metaRecv.path}`;
                console.log('ipfs uri:-------------', _uri);
                resolve({ _id, _uri })
            }).catch((error) => {
                reject(error);
            })
        })
    )

    const handleMint = () => {
        if(!file) return;
        uploadData().then((paramObj) => mint2net(paramObj)).then((success) => {
            if(success)
                enqueueSnackbar('Mint token succeed!', { variant: "success", anchorOrigin: {horizontal: "right", vertical: "top"} })
            else
                enqueueSnackbar('Mint token error!', { variant: "warning", anchorOrigin: {horizontal: "right", vertical: "top"} })
          }).catch((error) => {
            enqueueSnackbar('Mint token error!', { variant: "warning", anchorOrigin: {horizontal: "right", vertical: "top"} })
        });
    }

    return (
        <Stack spacing={5} width={340}>
            <Stack alignItems="center">
                <PageNumberTypo>2 of 2</PageNumberTypo>
                <DialogTitleTypo>Check NFT Details</DialogTitleTypo>
            </Stack>
            <Stack alignItems="center" paddingX={6} paddingY={4} borderRadius={4} sx={{ background: '#F0F1F2' }}>
                <Grid container>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Item</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>Nickname</DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Collection</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>Collection Name</DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Tx Fees</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{txFee} ELA</DetailedInfoLabelTypo>
                    </Grid>
                </Grid>
            </Stack>
            <Stack alignItems="center" spacing={1}>
                <Typography fontSize={14} fontWeight={600}>
                    Available: {txFee} ELA
                </Typography>
                <Stack direction="row" width="100%" spacing={2}>
                    <SecondaryButton
                        fullWidth
                        onClick={() => {
                            setInputData(defaultValue);
                            setDialogState({ ...dialogState, createNFTDlgOpened: false });
                        }}
                    >
                        Close
                    </SecondaryButton>
                    <PrimaryButton
                        fullWidth
                        onClick={() => {
                            handleMint();
                            setDialogState({ ...dialogState, createNFTDlgStep: 2 });
                        }}
                    >
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
