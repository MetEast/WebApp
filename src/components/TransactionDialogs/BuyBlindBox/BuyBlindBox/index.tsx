import React, { useState } from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { IconBtn } from './styles';
import ELAPrice from 'src/components/ELAPrice';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { useDialogContext } from 'src/context/DialogContext';
import { TypeProduct, TypeProductFetch, enumSingleNFTType } from 'src/types/product-types';
import { getImageFromAsset } from 'src/services/common';
import { FETCH_CONFIG_JSON } from 'src/services/fetch';

export interface ComponentProps {}

const BuyBlindBox: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const [amount, setAmount] = useState<number>(1);
    const defaultValue: TypeProduct = {
        tokenId: '',
        name: '',
        image: '',
        price_ela: 0,
        price_usd: 0,
        likes: 0,
        views: 0,
        author: '',
        authorDescription: '',
        authorImg: '',
        authorAddress: '',
        description: '',
        tokenIdHex: '',
        royalties: 0,
        createTime: '',
        holderName: '',
        holder: '',
        type: enumSingleNFTType.BuyNow,
        isLike: false,
    };

    const selectFromBlindBox = async () => {
        const resNFTList = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/selectBlindBoxToken?id=${dialogState.buyBlindBoxId}`,
            FETCH_CONFIG_JSON
        );
        const dataNFTList = await resNFTList.json();
        const tokenId = dataNFTList.data.result;
        console.log(tokenId);
        const resProductDetail = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getCollectibleByTokenId?tokenId=${tokenId}`,
            FETCH_CONFIG_JSON
        );
        const dataProductDetail = await resProductDetail.json();
        const productDetail = dataProductDetail.data;
        var product: TypeProduct = { ...defaultValue };

        if (productDetail !== undefined) {
            const itemObject: TypeProductFetch = productDetail;
            product.orderId = itemObject.orderId;
            product.image = getImageFromAsset(itemObject.asset);
            product.tokenId = itemObject.tokenId;
            // product.tokenId = itemObject.tokenId;
            // product.name = itemObject.name;
            // product.image = getImageFromAsset(itemObject.asset);
            // product.type = itemObject.endTime === '0' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
            // product.likes = itemObject.likes;
            // product.views = itemObject.views;
            // product.isLike =
            //     favouritesList.findIndex((value: TypeFavouritesFetch) =>
            //         selectFromFavourites(value, itemObject.tokenId),
            //     ) === -1
            //         ? false
            //         : true;
            // product.description = itemObject.description;
            // product.author = itemObject.authorName || ' ';
            // product.authorDescription = itemObject.authorDescription || ' ';
            // product.authorImg = product.image; // -- no proper value
            // product.authorAddress = itemObject.royaltyOwner;
            // product.holderName = itemObject.holderName === '' ? itemObject.authorName : itemObject.holderName;
            // product.orderId = itemObject.orderId;
            // product.holder = itemObject.holder;
            // product.tokenIdHex = itemObject.tokenIdHex;
            // product.royalties = parseInt(itemObject.royalties) / 1e4;
            // product.category = itemObject.category;
            // let createTime = getUTCTime(itemObject.createTime);
            // product.createTime = createTime.date + '' + createTime.time;
        }
        setDialogState({
            ...dialogState,
            buyBlindBoxDlgStep: 1,
            buyBlindBoxDlgOpened: true,
            buyBlindAmount: amount,
            buyBlindOrderId: product.orderId || '',
            buyBlindImage: product.image,
            buyBlindTokenId: product.tokenId
        });
    };
    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <PageNumberTypo>1 of 2</PageNumberTypo>
                <DialogTitleTypo>Buy Blind Box</DialogTitleTypo>
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
                            amount >= 1 && setAmount(amount - 1);
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
