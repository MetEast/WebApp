import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';
import { useDialogContext } from 'src/context/DialogContext';
import { callCreateOrderForSale } from 'src/components/ContractMethod';
import ModalDialog from 'src/components/ModalDialog';
import EnterSaleDetails from '../../ListNFT/EnterSaleDetails';
import CheckNFTDetails from '../CheckNFTDetails';
import CheckSaleDetails from '../../ListNFT/CheckSaleDetails';
import ArtworkIsNowForSale from '../../ListNFT/ArtworkIsNowForSale';
import { TypeSellInputForm } from 'src/types/mint-types';


export interface ComponentProps {
    txHash: string;
}

const NFTMinted: React.FC<ComponentProps> = ({txHash}): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    // sell nft operation
    const defaultValue: TypeSellInputForm = {
        saleType: 'buynow',
        price: '',
        royalty: '',
        minPirce: '',
        saleEnds: {label: '', value: ''}
    };
    const [openSellDlg, setOpenSellDlg] = useState<boolean>(false);
    const [sellDlgStep, setSellDlgStep] = useState<number>(0);
    const [inputFormData, setInputFormData] = useState<TypeSellInputForm>(defaultValue);
    const [orderTxHash, setOrderTxHash] = useState<string>('');

    const handleOrderTxHash = (value: string) => {
        setOrderTxHash(value);
    };

    const handleSaleStep = (newStep: number) => () => {
        setSellDlgStep(newStep);
    };

    const closeSaleDlg = () => {
        setOpenSellDlg(false);
    };

    React.useEffect(() => {
        console.log(sellDlgStep, "------", inputFormData);
    }, [sellDlgStep]);

    return (
        <>
            <Stack spacing={5} width={320}>
                <Stack alignItems="center">
                    <DialogTitleTypo>Your NFT Has Been Minted!</DialogTitleTypo>
                    <Typography fontSize={16} fontWeight={400} textAlign="center">
                        Congratulations! Your artwork has officially been minted as NFT on Elastos Smart Chain (ESC)
                    </Typography>
                </Stack>
                <Stack>
                    <img src="/assets/images/transactionsdlg/mintnft-nft-minted.svg" alt="" />
                </Stack>
                <Stack alignItems="center" spacing={2}>
                    <ViewOnExplorerButton txHash={txHash} />
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
                                setOpenSellDlg(true);
                                // setDialogState({ ...dialogState, createNFTDlgOpened: false });
                            }}
                        >
                            Sell
                        </PrimaryButton>
                    </Stack>
                </Stack>
            </Stack>
            <ModalDialog open={openSellDlg} onClose={() => setOpenSellDlg(false)}>
                {sellDlgStep === 0 && <EnterSaleDetails closeDlg={closeSaleDlg} nextStep={handleSaleStep(1)} inputData={inputFormData} setInputData={setInputFormData}/>}
                {sellDlgStep === 1 && <CheckSaleDetails previousStep={handleSaleStep(0)} nextStep={handleSaleStep(2)} inputData={inputFormData} setInputData={setInputFormData}  handleTxHash={handleOrderTxHash}/>}
                {sellDlgStep === 2 && <ArtworkIsNowForSale txHash={orderTxHash}/>}
            </ModalDialog>
        </>
    );
};

export default NFTMinted;
