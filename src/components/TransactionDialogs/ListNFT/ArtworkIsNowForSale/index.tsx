import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';
import { useDialogContext } from 'src/context/DialogContext';

export interface ComponentProps {}

const ArtworkIsNowForSale: React.FC<ComponentProps> = (): JSX.Element => {
    const navigate = useNavigate();
    const [dialogState, setDialogState] = useDialogContext();

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Your artwork is now for sale!</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400} textAlign="center">
                    Users will now able to find it in the marketplace
                </Typography>
            </Stack>
            <Stack>
                <img src="/assets/images/transactionsdlg/artwork-now-forsale.svg" alt="" />
            </Stack>
            <Stack alignItems="center" spacing={2}>
                <ViewOnExplorerButton txHash={dialogState.sellTxHash} />
                <PrimaryButton
                    fullWidth
                    onClick={() => {
                        setDialogState({
                            ...dialogState,
                            createNFTDlgOpened: false,
                            sellMinPrice: 0,
                            sellSaleEnds: { label: '', value: '' },
                            sellSaleType: 'buynow',
                            sellTxFee: 0,
                            sellTxHash: '',
                            sellPrice: 0,
                            mintTokenId: '',
                            mintTokenUri: '',
                            mintDidUri: '',
                        });
                        navigate('/products');
                        window.location.reload();
                    }}
                >
                    Close
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default ArtworkIsNowForSale;
