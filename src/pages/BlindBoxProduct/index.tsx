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
    TypeBlindListLikes,
} from 'src/types/product-types';
import { getELA2USD } from 'src/services/fetch';
import { getImageFromAsset, getTime } from 'src/services/common';
import { isInAppBrowser } from 'src/services/wallet';
import Container from 'src/components/Container';

const BlindBoxProduct: React.FC = (): JSX.Element => {
    const params = useParams();
    const [signInDlgState] = useSignInContext();
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

    const getBlindBoxDetail = async (tokenPriceRate: number) => {
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
            blind.holder = itemObject.authorName; // no data ------------------------------------
            blind.isLike = signInDlgState.isLoggedIn
                ? itemObject.list_likes.findIndex(
                      (value: TypeBlindListLikes) => value.did === `did:elastos:${signInDlgState.userDid}`,
                  ) === -1
                    ? false
                    : true
                : false;
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
        getBlindBoxDetail(await getELA2USD());
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

    const updateBlindBoxLikes = (type: string) => {
        setBlindBoxDetail((prevState: TypeProduct) => {
            const blindDetail: TypeProduct = { ...prevState };
            if (type === 'inc') {
                blindDetail.likes++;
            } else if (type === 'dec') {
                blindDetail.likes--;
            }
            return blindDetail;
        });
    };

    const updateBlindBoxViews = (tokenId: string) => {
        if (signInDlgState.isLoggedIn && tokenId) {
            const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/incTokenViews`;
            const reqBody = {
                token: signInDlgState.token,
                blindBoxIndex: tokenId,
                did: signInDlgState.userDid,
            };
            fetch(reqUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqBody),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.code === 200) {
                        setBlindBoxDetail((prevState: TypeProduct) => {
                            const blindDetail: TypeProduct = { ...prevState };
                            blindDetail.views += 1;
                            return blindDetail;
                        });
                    } else {
                        console.log(data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        updateBlindBoxViews(blindBoxDetail.tokenId);
    }, [blindBoxDetail.tokenId]);

    return (
        <Container>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <ProductImageContainer product={blindBoxDetail} updateLikes={updateBlindBoxLikes} />
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
                    {signInDlgState.walletAccounts !== [] &&
                        blindBoxDetail.holder !== signInDlgState.walletAccounts[0] &&
                        blindBoxDetail.type === enumBlindBoxNFTType.SaleEnds &&
                        blindBoxDetail.state === 'online' && (
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
        </Container>
    );
};

export default BlindBoxProduct;
