import React, { useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';
import { useDialogContext } from 'src/context/DialogContext';
import { getImageFromAsset } from '../../../../services/common';
import { serverConfig } from 'src/config';

export interface ComponentProps {}

const PurchaseSuccess: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();

    useEffect(() => {
        fetch(`${serverConfig.metServiceUrl}/api/v1/getNFTFromBlindBox`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(dialogState.buyBlindOrderIds.map((item: string) => Number(item))),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                const names: string[] = [],
                    images: string[] = [],
                    creators: string[] = [];
                data.data.forEach((item: any) => {
                    names.push(item.name);
                    images.push(getImageFromAsset(item.thumbnail));
                    creators.push(item.authorName ? item.authorName : item.royaltyOwner);
                });
                setDialogState({
                    ...dialogState,
                    buyBlindNames: names,
                    buyBlindImages: images,
                    buyBlindCreators: creators,
                });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Purchase Successful!</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400}>
                    You have just received {dialogState.buyBlindAmount} Mystery Box!
                </Typography>
            </Stack>
            <Stack>
                <img src="/assets/images/transactionsdlg/buyblindbox-purchase-success.svg" alt="" />
            </Stack>
            <Stack alignItems="center" spacing={2}>
                <ViewOnExplorerButton txHash={dialogState.buyBlindTxHash} />
                <PrimaryButton
                    fullWidth
                    onClick={() => {
                        setDialogState({ ...dialogState, buyBlindBoxDlgStep: 3, buyBlindBoxDlgOpened: true });
                    }}
                >
                    Open Mystery Box
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default PurchaseSuccess;
