import React, { useState } from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { IconBtn } from './styles';
import ELAPrice from 'src/components/ELAPrice';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { useDialogContext } from 'src/context/DialogContext';
import { TypeBlindBoxCandidate } from 'src/types/product-types';
import { getImageFromAsset } from 'src/services/common';
import { FETCH_CONFIG_JSON } from 'src/services/fetch';
import { serverConfig } from 'src/config';

export interface ComponentProps {}

const BuyBlindBox: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const [amount, setAmount] = useState<number>(1);

    const selectFromBlindBox = async () => {
        let unmounted = false;
        const resNFTList = await fetch(
            `${serverConfig.metServiceUrl}/api/v1/selectBlindBoxToken?id=${dialogState.buyBlindBoxId}&count=${amount}`,
            FETCH_CONFIG_JSON,
        );
        const dataNFTList = await resNFTList.json();
        const selectedTokens: Array<TypeBlindBoxCandidate> = dataNFTList.data;
        const arrOrderIds: string[] = [];
        const arrTokenIds: string[] = [];
        const arrAssets: string[] = [];
        const arrNames: string[] = [];
        const arrCreators: string[] = [];
        selectedTokens.forEach((item: TypeBlindBoxCandidate) => {
            arrOrderIds.push(item.orderId.toString());
            arrTokenIds.push(item.tokenId);
            arrAssets.push(getImageFromAsset(item.asset));
            arrNames.push(item.name);
            arrCreators.push(item.creator ? item.creator : item.creatorAddress);
        });
        if (!unmounted) {
            setDialogState({
                ...dialogState,
                buyBlindBoxDlgStep: 1,
                buyBlindBoxDlgOpened: true,
                buyBlindAmount: amount,
                buyBlindOrderIds: arrOrderIds,
                buyBlindImages: arrAssets,
                buyBlindNames: arrNames,
                buyBlindTokenIds: arrTokenIds,
                buyBlindCreators: arrCreators,
            });
        }
        return () => {
            unmounted = true;
        };
    };
    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <PageNumberTypo>1 of 2</PageNumberTypo>
                <DialogTitleTypo>Buy Mystery Box</DialogTitleTypo>
            </Stack>
            <Stack alignItems="center">
                <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                    Item
                </Typography>
                <Typography fontSize={18} fontWeight={700}>
                    {dialogState.buyBlindName}
                </Typography>
                <ELAPrice price_ela={dialogState.buyBlindPriceEla} price_ela_fontsize={14} />
                <Typography fontSize={14} fontWeight={700} marginTop={4} sx={{ textTransform: 'uppercase' }}>
                    Quantity
                </Typography>
                <Stack direction="row" spacing={1} marginTop={1}>
                    <IconBtn
                        onClick={() => {
                            amount > 1 && setAmount(amount - 1);
                        }}
                    >
                        <Icon icon="ph:minus" color="#1890FF" />
                    </IconBtn>
                    <TextField
                        value={amount}
                        sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                width: 60,
                                height: 40,
                                '& fieldset': {
                                    borderWidth: 0,
                                },
                                '&.Mui-focused fieldset': {
                                    borderWidth: 0,
                                },
                                '& input': {
                                    textAlign: 'center',
                                },
                            },
                        }}
                    />
                    <IconBtn
                        onClick={() => {
                            dialogState.buyBlindMaxPurchases > amount &&
                                dialogState.buyBlindInstock > amount &&
                                setAmount(amount + 1);
                        }}
                    >
                        <Icon icon="ph:plus" color="#1890FF" />
                    </IconBtn>
                </Stack>
                <Typography fontSize={14} fontWeight={700} marginTop={4} sx={{ textTransform: 'uppercase' }}>
                    Subtotal
                </Typography>
                <ELAPrice
                    price_ela={dialogState.buyBlindPriceEla * amount}
                    price_usd={dialogState.buyBlindPriceUsd * amount}
                />
            </Stack>
            <Stack direction="row" spacing={2}>
                <SecondaryButton
                    fullWidth
                    onClick={() => {
                        setDialogState({ ...dialogState, buyBlindBoxDlgOpened: false });
                    }}
                >
                    close
                </SecondaryButton>
                <PrimaryButton fullWidth onClick={selectFromBlindBox}>
                    Confirm
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default BuyBlindBox;
