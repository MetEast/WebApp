import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Stack, Grid, Typography, Box } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { useSignInContext } from 'src/context/SignInContext';
import { useCookies } from 'react-cookie';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import BlindBoxContents from 'src/components/TransactionDialogs/BuyBlindBox/BlindBoxContents';
import BuyBlindBox from 'src/components/TransactionDialogs/BuyBlindBox/BuyBlindBox';
import OrderSummary from 'src/components/TransactionDialogs/BuyBlindBox/OrderSummary';
import PurchaseSuccess from 'src/components/TransactionDialogs/BuyBlindBox/PurchaseSuccess';
import {
    enumBadgeType,
    enumBlindBoxNFTType,
    TypeProduct,
    TypeProductFetch,
    TypeFavouritesFetch,
} from 'src/types/product-types';
import { getELA2USD, getMyFavouritesList } from 'src/services/fetch';
import { getImageFromAsset, selectFromFavourites, getTime } from 'src/services/common';
import { isInAppBrowser } from 'src/services/wallet';

const BlindBoxProduct: React.FC = (): JSX.Element => {
    const params = useParams(); // params.id
    const [signInDlgState] = useSignInContext();
    const [didCookies] = useCookies(['METEAST_DID']);
    const [dialogState, setDialogState] = useDialogContext();
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
        type: enumBlindBoxNFTType.ComingSoon,
        isLike: false,
        sold: 0,
        instock: 0,
    };
    const [blindBoxDetail, setBlindBoxDetail] = useState<TypeProduct>(defaultValue);
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);

    const getBlindBoxDetail = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>) => {
        const resBlindBoxDetail = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/getBlindboxById?blindBoxId=${params.id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        const dataBlindBoxDetail = await resBlindBoxDetail.json();
        const blindDetail = dataBlindBoxDetail.data.result;
        var blind: TypeProduct = { ...defaultValue };

        if (blindDetail !== undefined) {
            const itemObject: TypeProductFetch = blindDetail;
            blind.tokenId = itemObject.blindBoxIndex.toString();
            blind.name = itemObject.name;
            blind.image = getImageFromAsset(itemObject.asset);
            blind.price_ela = parseInt(itemObject.blindPrice);
            blind.price_usd = blind.price_ela * tokenPriceRate;
            const curTimestamp = new Date().getTime() / 1000;
            blind.type =
                curTimestamp < parseInt(itemObject.saleBegin)
                    ? enumBlindBoxNFTType.ComingSoon
                    : curTimestamp <= parseInt(itemObject.saleEnd)
                    ? enumBlindBoxNFTType.SaleEnds
                    : enumBlindBoxNFTType.SaleEnded;
            blind.likes = itemObject.likes;
            blind.views = itemObject.views;
            blind.isLike =
                favouritesList.findIndex((value: TypeFavouritesFetch) =>
                    selectFromFavourites(value, itemObject.tokenId),
                ) === -1
                    ? false
                    : true;
            blind.description = itemObject.description;
            blind.authorDescription = itemObject.authorDescription || ' ';
            blind.instock = itemObject.instock || 0;
            blind.sold = itemObject.sold || 0;
            if (itemObject.saleEnd) {
                let endTime = getTime(itemObject.saleEnd);
                blind.endTime = endTime.date + ' ' + endTime.time;
            } else {
                blind.endTime = '';
            }
            blind.state = itemObject.state;
            blind.maxPurchases = parseInt(itemObject.maxPurchases);
            blind.maxLikes = parseInt(itemObject.maxLikes);
            blind.maxViews = parseInt(itemObject.maxViews);
            blind.maxQuantity = parseInt(itemObject.maxQuantity);
        }
        setBlindBoxDetail(blind);
    };

    const getFetchData = async () => {
        let ela_usd_rate = await getELA2USD();
        let favouritesList = await getMyFavouritesList(signInDlgState.isLoggedIn, didCookies.METEAST_DID);
        getBlindBoxDetail(ela_usd_rate, favouritesList);
    };

    useEffect(() => {
        getFetchData();
    }, []);

    const setBuyBlindBoxTxFee = async () => {
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setDialogState({ ...dialogState, buyBlindTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
    };

    useEffect(() => {
        setBuyBlindBoxTxFee();
    }, [dialogState.buyBlindBoxDlgStep]);

    const updateProductLikes = (type: string) => {
        let prodDetail: TypeProduct = { ...blindBoxDetail };
        if (type === 'inc') {
            prodDetail.likes += 1;
        } else if (type === 'dec') {
            prodDetail.likes -= 1;
        }
        setBlindBoxDetail(prodDetail);
    };

    return (
        <>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <ProductImageContainer product={blindBoxDetail} updateLikes={updateProductLikes} />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Typography fontSize={{ md: 56, sm: 42, xs: 32 }} fontWeight={700}>
                        {blindBoxDetail.name}
                    </Typography>
                    <ProductSnippets
                        sold={blindBoxDetail.sold}
                        instock={blindBoxDetail.instock}
                        likes={blindBoxDetail.likes}
                        views={blindBoxDetail.views}
                    />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge
                            badgeType={
                                blindBoxDetail.type === enumBlindBoxNFTType.ComingSoon
                                    ? enumBadgeType.ComingSoon
                                    : blindBoxDetail.type === enumBlindBoxNFTType.SaleEnds
                                    ? enumBadgeType.SaleEnds
                                    : enumBadgeType.SaleEnded
                            }
                            content={blindBoxDetail.endTime}
                        />
                    </Stack>
                    <ELAPrice price_ela={blindBoxDetail.price_ela} price_usd={blindBoxDetail.price_usd} marginTop={3} />
                    {blindBoxDetail.type === enumBlindBoxNFTType.SaleEnds && blindBoxDetail.state === 'online' && (
                        <PrimaryButton
                            sx={{ marginTop: 3, width: '100%' }}
                            onClick={() => {
                                setDialogState({
                                    ...dialogState,
                                    buyBlindBoxDlgOpened: true,
                                    buyBlindBoxDlgStep: 0,
                                    buyBlindName: blindBoxDetail.name,
                                    buyBlindPriceEla: blindBoxDetail.price_ela,
                                    buyBlindPriceUsd: blindBoxDetail.price_usd,
                                    buyBlindAmount: 1,
                                    // buyBlindCreator: blindBoxDetail.author,
                                    // buyBlindOrderId: blindBoxDetail.orderId || '',
                                    buyBlindBoxId: parseInt(blindBoxDetail.tokenId),
                                });
                            }}
                        >
                            Buy Now
                        </PrimaryButton>
                    )}
                </Grid>
            </Grid>
            <Box marginTop={5}>
                <img src="" alt="Blind Box Introduction"></img>
            </Box>
            <ModalDialog
                open={dialogState.buyBlindBoxDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, buyBlindBoxDlgOpened: false });
                }}
            >
                {dialogState.buyBlindBoxDlgStep === 0 && <BuyBlindBox />}
                {dialogState.buyBlindBoxDlgStep === 1 && <OrderSummary />}
                {dialogState.buyBlindBoxDlgStep === 2 && <PurchaseSuccess />}
                {dialogState.buyBlindBoxDlgStep === 3 && <BlindBoxContents />}
            </ModalDialog>
        </>
    );
};

export default BlindBoxProduct;
