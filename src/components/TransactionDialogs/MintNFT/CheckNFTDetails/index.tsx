import React from 'react';
import { create, urlSource } from 'ipfs-http-client';
import { createHash } from 'crypto';
import { ethers } from 'ethers';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import { useDialogContext } from 'src/context/DialogContext';
import { TypeMintInputForm } from 'src/types/mint-types';
// import { METEAST_CONTRACT_ABI, METEAST_CONTRACT_ADDRESS } from '../../../ContractMethod/config';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import { useSnackbar } from 'notistack';
import { UserTokenType } from 'src/types/auth-types';
import { mintEther, testETHCall } from 'src/components/ContractMethod';
// import { essentialsConnector } from 'src/components/ConnectWallet/EssentialConnectivity';

const client = create({url: 'https://ipfs-test.meteast.io/'});

export interface ComponentProps {
    inputData: TypeMintInputForm;
}

const CheckNFTDetails: React.FC<ComponentProps> = ({ inputData }): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const { file } = inputData;
    const [tokenCookies] = useCookies(["token"]);
    const { enqueueSnackbar } = useSnackbar();
    const userInfo: UserTokenType = jwtDecode(tokenCookies.token);
    const {did, name} = userInfo;

    const mint2net = (paramObj: any)=>(
        new Promise((resolve, reject) => {
            enqueueSnackbar('Ipfs upload succeed!', { variant: "success", anchorOrigin: {horizontal: "right", vertical: "top"} });
            const _royaltyFee = 10000;
            // mintEther(parseInt(paramObj._id), paramObj._uri, _royaltyFee);
            testETHCall(paramObj._id, paramObj._uri, _royaltyFee);
            // try {
            //     const eeProvider = essentialsConnector.getWeb3Provider();
            //     const { ethereum } = window;
            //     if (ethereum) {
            //         const provider = new ethers.providers.Web3Provider(ethereum);
            //         const signer = provider.getSigner();
            //         const meteastContract = new ethers.Contract(METEAST_CONTRACT_ADDRESS, METEAST_CONTRACT_ABI, signer);

            //         console.log("Initialize payment")
            //         alert(1);
            //         // console.log(parseInt(paramObj._id), "---", paramObj._uri, "---", _royaltyFee);
            //         meteastContract.mint(paramObj._id, paramObj._uri, _royaltyFee).then((nftTxn: any)=>{
            //             alert(2);
            //             console.log("Mining... please wait")
            //             nftTxn.wait().then(()=>{
            //                 console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
            //                 resolve(true)
            //             }).catch((error: Error) => {
            //                 reject(error)
            //             })
            //         }).catch((error: Error) => {
            //             reject(error)
            //         })
            //     } 
            //     else {
            //         resolve(false)
            //         console.log("Ethereum object does not exist")
            //     }
            // } catch (err) {
            //     reject(err)
            // }
        })
    )

    const sendIpfsImage = (f: File)=>(
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
                        <DetailedInfoLabelTypo>0.22 ELA</DetailedInfoLabelTypo>
                    </Grid>
                </Grid>
            </Stack>
            <Stack alignItems="center" spacing={1}>
                <Typography fontSize={14} fontWeight={600}>
                    Available: {0.22} ELA
                </Typography>
                <Stack direction="row" width="100%" spacing={2}>
                    <SecondaryButton
                        fullWidth
                        onClick={() => {
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
