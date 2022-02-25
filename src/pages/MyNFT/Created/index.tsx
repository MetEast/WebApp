import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stack, Grid, Typography } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import { PrimaryButton } from 'src/components/Buttons/styles';
import AboutAuthor from 'src/components/SingleNFTMoreInfo/AboutAuthor';
import ProjectDescription from 'src/components/SingleNFTMoreInfo/ProjectDescription';
import ChainDetails from 'src/components/SingleNFTMoreInfo/ChainDetails';
import ProductTransHistory from 'src/components/ProductTransHistory';
import { getImageFromAsset, getMintCategory, getUTCTime, getTime, selectFromFavourites } from 'src/services/common';
import {
    enumBadgeType,
    enumSingleNFTType,
    TypeProduct,
    TypeProductFetch,
    TypeFavouritesFetch,
    TypeNFTHisotry
} from 'src/types/product-types';
import { getElaUsdRate, getMyFavouritesList } from 'src/services/fetch';
import { useSignInContext } from 'src/context/SignInContext';
import { useCookies } from 'react-cookie';
import { useDialogContext } from 'src/context/DialogContext';
import MintNFTDlgContainer from 'src/components/TransactionDialogs/MintNFT';

const MyNFTCreated: React.FC = (): JSX.Element => {
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
        type: enumSingleNFTType.BuyNow,
        isLike: false,
    };
    const defaultProdTransHisotryValue: TypeNFTHisotry = {
        type: '',
        user: '',
        price: 0,
        time: '',
        saleType: ''
    };
    const [productDetail, setProductDetail] = useState<TypeProduct>(defaultValue);
    const [prodTransHistory, setProdTransHistory] = useState<Array<TypeNFTHisotry>>([]);
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
            const itemObject: TypeProductFetch = prodDetail;
            product.tokenId = itemObject.tokenId;
            product.name = itemObject.name;
            product.image = getImageFromAsset(itemObject.asset);
            product.price_ela = itemObject.price / 1e18;
            product.price_usd = product.price_ela * tokenPriceRate;
            product.type = itemObject.endTime === '0' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
            product.likes = itemObject.likes;
            product.views = itemObject.views;
            product.isLike =
                favouritesList.findIndex((value: TypeFavouritesFetch) =>
                    selectFromFavourites(value, itemObject.tokenId),
                ) === -1
                    ? false
                    : true;
            product.description = itemObject.description;
            product.author = itemObject.authorName || ' ';
            product.authorDescription = itemObject.authorDescription || ' ';
            product.authorImg = product.image; // -- no proper value
            product.authorAddress = itemObject.royaltyOwner;
            product.holderName = itemObject.holderName === '' ? itemObject.authorName : itemObject.holderName;
            product.holder = itemObject.holder;
            product.tokenIdHex = itemObject.tokenIdHex;
            product.royalties = parseInt(itemObject.royalties) / 1e4;
            let createTime = getUTCTime(itemObject.createTime);
            product.createTime = createTime.date + '' + createTime.time;

            // let _prodTransHistory: Array<TypeNFTHisotry> = [];
            let _prodTrans: TypeNFTHisotry = { ...defaultProdTransHisotryValue };
            _prodTrans.type = 'Created';
            _prodTrans.price = itemObject.price / 1e18;
            _prodTrans.user = product.author;
            let timestamp = getTime(itemObject.timestamp.toString());
            _prodTrans.time = timestamp.date + ' ' + timestamp.time;
            // _prodTrans.saleType = (itemObject)
            setProdTransHistory([_prodTrans]);
        }
        setProductDetail(product);
    };

    const getFetchData = async () => {
        let ela_usd_rate = await getElaUsdRate();
        let favouritesList = await getMyFavouritesList(signInDlgState.isLoggedIn, didCookies.METEAST_DID);
        getProductDetail(ela_usd_rate, favouritesList);
    };

    useEffect(() => {
        getFetchData();
    }, []);

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
                <Grid item xs={6}>
                    <ProductImageContainer product={productDetail} updateLikes={updateProductLikes} />
                </Grid>
                <Grid item xs={6}>
                    <Typography fontSize={56} fontWeight={700}>
                        {productDetail.name}
                    </Typography>
                    <ProductSnippets nickname={productDetail.author} likes={productDetail.likes} views={productDetail.views} />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={productDetail.royaltyOwner !== productDetail.holder ? enumBadgeType.Purchased : enumBadgeType.Created} />
                        <ProductBadge badgeType={getMintCategory(productDetail.category)} />
                    </Stack>
                    {/* <ELAPrice price_ela={199} price_usd={480} marginTop={3} /> */}
                    <PrimaryButton
                        sx={{ marginTop: 3, width: '100%' }}
                        onClick={() => {
                            setDialogState({ ...dialogState, mintTokenId: productDetail.tokenIdHex, createNFTDlgOpened: true, createNFTDlgStep: 3 });
                        }}
                    >
                        Sell
                    </PrimaryButton>
                </Grid>
            </Grid>
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <Stack spacing={3}>
                        <AboutAuthor
                            name={productDetail.author}
                            description={productDetail.authorDescription}
                            img={productDetail.authorImg}
                            address={productDetail.authorAddress}
                        />
                        <ProductTransHistory historyList={prodTransHistory} />
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={3}>
                        <ProjectDescription description={productDetail.description} />
                        <ChainDetails
                            tokenId={productDetail.tokenIdHex}
                            ownerName={productDetail.holderName}
                            ownerAddress={productDetail.holder}
                            royalties={productDetail.royalties}
                            createTime={productDetail.createTime}
                        />
                    </Stack>
                </Grid>
            </Grid>
            <MintNFTDlgContainer />
        </>
    );
};

export default MyNFTCreated;
