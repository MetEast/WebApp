import React from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';
import { useDialogContext } from 'src/context/DialogContext';



export interface ComponentProps {
    txHash: string;
}

const NFTMinted: React.FC<ComponentProps> = ({txHash}): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    
    return (
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
                            setDialogState({ ...dialogState, createNFTDlgOpened: true, createNFTDlgStep: 3 });
                        }}
                    >
                        Sell
                    </PrimaryButton>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default NFTMinted;
