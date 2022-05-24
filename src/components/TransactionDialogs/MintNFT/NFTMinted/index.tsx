import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';
import { useDialogContext } from 'src/context/DialogContext';

export interface ComponentProps {}

const NFTMinted: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const navigate = useNavigate();
    const location = useLocation();

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
                <ViewOnExplorerButton txHash={dialogState.mintTxHash} />
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
                                // mintTxFee: 0,
                                mintTxHash: '',
                                mintTokenId: '',
                                mintTokenUri: '',
                                // mintDidUri: '',
                                createNFTDlgOpened: false,
                            });
                            document.cookie = 'METEAST_PROFILE=Created; Path=/; SameSite=None; Secure';
                            if (location.pathname.indexOf('/profile') !== -1) window.location.reload();
                            else navigate('/profile');
                        }}
                    >
                        Close
                    </SecondaryButton>
                    <PrimaryButton
                        fullWidth
                        onClick={() => {
                            setDialogState({
                                ...dialogState,
                                mintTitle: '',
                                mintIntroduction: '',
                                mintCategory: { label: '', value: '' },
                                mintFile: new File([''], ''),
                                mintRoyalties: -1,
                                createNFTDlgOpened: true,
                                createNFTDlgStep: 3,
                            });
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
