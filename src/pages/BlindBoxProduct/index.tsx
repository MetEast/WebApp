import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Stack, Grid, Typography, Box } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { useRecoilValue } from 'recoil';
import authAtom from 'src/recoil/auth';
import { useCookies } from 'react-cookie';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import BlindBoxContents from 'src/components/TransactionDialogs/BuyBlindBox/BlindBoxContents';
import BuyBlindBox from 'src/components/TransactionDialogs/BuyBlindBox/BuyBlindBox';
import OrderSummary from 'src/components/TransactionDialogs/BuyBlindBox/OrderSummary';
import PurchaseSuccess from 'src/components/TransactionDialogs/BuyBlindBox/PurchaseSuccess';
import {
    enumBadgeType,
    enumSingleNFTType,
    TypeProduct,
    TypeProductFetch,
    TypeFavouritesFetch,
} from 'src/types/product-types';
import { getElaUsdRate, getMyFavouritesList } from 'src/services/fetch';
import { getImageFromAsset, getUTCTime, selectFromFavourites } from 'src/services/common';

// dialogs for test
// import BuyBlindBox from 'src/components/TransactionDialogs/BuyBlindBox/BuyBlindBox';
// import OrderSummary from 'src/components/TransactionDialogs/BuyBlindBox/OrderSummary';
// import PurchaseSuccess from 'src/components/TransactionDialogs/BuyBlindBox/PurchaseSuccess';
// import BlindBoxContents from 'src/components/TransactionDialogs/BuyBlindBox/BlindBoxContents';
// import MintNFT from 'src/components/TransactionDialogs/MintNFT/MintNFT';
// import CheckNFTDetails from 'src/components/TransactionDialogs/MintNFT/CheckNFTDetails';
// import NFTMinted from 'src/components/TransactionDialogs/MintNFT/NFTMinted';
// import PlaceBid from 'src/components/TransactionDialogs/PlaceBid/PlaceBid';
// import ReviewBidDetails from 'src/components/TransactionDialogs/PlaceBid/ReviewBidDetails';
// import BidPlaceSuccess from 'src/components/TransactionDialogs/PlaceBid/BidPlaceSuccess';
import UpdateBid from 'src/components/TransactionDialogs/UpdateBid/UpdateBid';
import BidUpdateSuccess from 'src/components/TransactionDialogs/UpdateBid/BidUpdateSuccess';
import CancelBid from 'src/components/TransactionDialogs/CancelBid/CancelBid';
import CancelBidSuccess from 'src/components/TransactionDialogs/CancelBid/CancelBidSuccess';
import ChangePrice from 'src/components/TransactionDialogs/ChangePrice/ChangePrice';
import PriceChangeSuccess from 'src/components/TransactionDialogs/ChangePrice/PriceChangeSuccess';
import CancelSale from 'src/components/TransactionDialogs/CancelSale/CancelSale';
import CancelSaleSuccess from 'src/components/TransactionDialogs/CancelSale/CancelSaleSuccess';
// import EnterSaleDetails from 'src/components/TransactionDialogs/ListNFT/EnterSaleDetails';
// import CheckSaleDetails from 'src/components/TransactionDialogs/ListNFT/CheckSaleDetails';
// import ArtworkIsNowForSale from 'src/components/TransactionDialogs/ListNFT/ArtworkIsNowForSale';
// import AcceptBid from 'src/components/TransactionDialogs/AcceptBid/AcceptBid';
// import SaleSuccess from 'src/components/TransactionDialogs/AcceptBid/SaleSuccess';
// import BuyNow from 'src/components/TransactionDialogs/BuyNow/BuyNow';
// import PurchaseSuccess from 'src/components/TransactionDialogs/BuyNow/PurchaseSuccess';
// import WaitingConfirm from 'src/components/TransactionDialogs/Others/WaitingConfirm';
// import ErrorMessage from 'src/components/TransactionDialogs/Others/ErrorMessage';
// import CreateBlindBox from 'src/components/TransactionDialogs/CreateBlindBox/CreateBlindBox';
// import CheckBlindBoxDetails from 'src/components/TransactionDialogs/CreateBlindBox/CheckBlindBoxDetails';
// import BlindBoxCreateSuccess from 'src/components/TransactionDialogs/CreateBlindBox/BlindBoxCreateSuccess';
// import CreateBanner from 'src/components/TransactionDialogs/CreateBanner/CreateBanner';
// import YourEarnings from 'src/components/profile/YourEarnings';
// import AllTransactions from 'src/components/profile/AllTransactions';
// import AllBids from 'src/components/profile/AllBids';
// import ReceivedBids from 'src/components/profile/ReceivedBids';

const BlindBoxProduct: React.FC = (): JSX.Element => {
    const params = useParams(); // params.id
    const auth = useRecoilValue(authAtom);
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
        type: enumSingleNFTType.BuyNow,
        isLike: false,
        sold: 0,
        instock: 0,
    };
    const [productDetail, setProductDetail] = useState<TypeProduct>(defaultValue);

    const getProductDetail = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>) => {
        const resProductDetail = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getCollectibleByTokenId?tokenId=${params.id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        const dataProductDetail = await resProductDetail.json();
        const prodDetail = dataProductDetail.data;
        var product: TypeProduct = { ...defaultValue };

        if (prodDetail !== undefined) {
            // get individual data
            const itemObject: TypeProductFetch = prodDetail;
            product.tokenId = itemObject.tokenId;
            product.name = itemObject.name;
            product.image = getImageFromAsset(itemObject.asset);
            product.price_ela = itemObject.price;
            product.price_usd = product.price_ela * tokenPriceRate;
            product.type = itemObject.status === 'NEW' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
            product.likes = itemObject.likes;
            product.views = itemObject.views;
            product.isLike =
                favouritesList.findIndex((value: TypeFavouritesFetch) =>
                    selectFromFavourites(value, itemObject.tokenId),
                ) === -1
                    ? false
                    : true;
            product.description = itemObject.description;
            product.author = itemObject.authorName || '---';
            product.authorDescription = itemObject.authorDescription || '---';
            product.authorImg = product.image; // -- no proper value
            product.authorAddress = itemObject.royaltyOwner;
            product.holderName = '---'; // -- no proper value
            product.holder = itemObject.holder;
            product.tokenIdHex = itemObject.tokenIdHex;
            product.royalties = parseInt(itemObject.royalties) / 1e4;
            let createTime = getUTCTime(itemObject.createTime);
            product.createTime = createTime.date + '' + createTime.time;
            product.instock = itemObject.instock || 0;
            product.sold = itemObject.sold || 0;
        }
        setProductDetail(product);
    };

    const getFetchData = async () => {
        let ela_usd_rate = await getElaUsdRate();
        let favouritesList = await getMyFavouritesList(auth.isLoggedIn, didCookies.METEAST_DID);
        getProductDetail(ela_usd_rate, favouritesList);
    };

    useEffect(() => {
        getFetchData();
    }, []);

    const setBuyBlindBoxTxFee = async () => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setDialogState({ ...dialogState, buyBlindBoxTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
    };

    useEffect(() => {
        setBuyBlindBoxTxFee();
    }, [dialogState.buyBlindBoxDlgStep]);


    const updateProductLikes = (type: string) => {
        let prodDetail: TypeProduct = { ...productDetail };
        if (type === 'inc') {
            prodDetail.likes += 1;
        } else if (type === 'dec') {
            prodDetail.likes -= 1;
        }
        setProductDetail(prodDetail);
    };

    return (
        <>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <ProductImageContainer product={productDetail} updateLikes={updateProductLikes} />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Typography fontSize={{ md: 56, sm: 42, xs: 32 }} fontWeight={700}>
                        {productDetail.name}
                    </Typography>
                    <ProductSnippets
                        sold={productDetail.sold}
                        instock={productDetail.instock}
                        likes={productDetail.likes}
                        views={productDetail.views}
                    />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={enumBadgeType.ComingSoon} content={productDetail.endTime} />
                    </Stack>
                    <ELAPrice price_ela={productDetail.price_ela} price_usd={productDetail.price_usd} marginTop={3} />
                    <PrimaryButton
                        sx={{ marginTop: 3, width: '100%' }}
                        onClick={() => {
                            setDialogState({
                                ...dialogState,
                                buyBlindBoxDlgOpened: true,
                                buyBlindBoxDlgStep: 0,
                                buyBlindBoxName: productDetail.name,
                                buyBlindBoxPriceEla: productDetail.price_ela,
                                buyBlindBoxPriceUsd: productDetail.price_usd,
                                buyBlindBoxAmount: 1,
                                buyBlindBoxCreator: productDetail.author
                            });
                        }}
                    >
                        Buy Now
                    </PrimaryButton>
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
