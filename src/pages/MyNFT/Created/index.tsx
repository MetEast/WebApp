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
import {
    getImageFromAsset,
    getMintCategory,
    getUTCTime,
    getTime,
    selectFromFavourites,
    reduceHexAddress,
} from 'src/services/common';
import {
    enumBadgeType,
    enumSingleNFTType,
    enumTransactionType,
    TypeProduct,
    TypeProductFetch,
    TypeFavouritesFetch,
    TypeNFTHisotry,
    TypeNFTTransactionFetch,
} from 'src/types/product-types';
import { getELA2USD, getMyFavouritesList } from 'src/services/fetch';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import Container from 'src/components/Container';
import { blankNFTItem, blankMyNFTHistory } from 'src/constants/init-constants';

const MyNFTCreated: React.FC = (): JSX.Element => {
    const params = useParams();
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [productDetail, setProductDetail] = useState<TypeProduct>(blankNFTItem);
    const [prodTransHistory, setProdTransHistory] = useState<Array<TypeNFTHisotry>>([]);
    const burnAddress = '0x0000000000000000000000000000000000000000';

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
        var product: TypeProduct = { ...blankNFTItem };

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
            product.author =
                itemObject.authorName === '' ? reduceHexAddress(itemObject.royaltyOwner, 4) : itemObject.authorName;
            product.authorDescription = itemObject.authorDescription || ' ';
            product.authorImg = product.image; // -- no proper value
            product.authorAddress = itemObject.royaltyOwner;
            product.holderName =
                itemObject.holderName === '' || itemObject.holder === itemObject.royaltyOwner
                    ? itemObject.authorName
                    : itemObject.holderName;
            product.holder = itemObject.holder;
            product.tokenIdHex = itemObject.tokenIdHex;
            product.royalties = parseInt(itemObject.royalties) / 1e4;
            product.category = itemObject.category;
            let createTime = getUTCTime(itemObject.createTime);
            product.createTime = createTime.date + '' + createTime.time;
        }
        setProductDetail(product);
    };

    const getLatestTransaction = async () => {
        const resLatestTransaction = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getTranDetailsByTokenId?tokenId=${params.id}&timeOrder=-1&pageNum=1&$pageSize=5`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        const dataLatestTransaction = await resLatestTransaction.json();
        const arrLatestTransaction = dataLatestTransaction.data;

        let _prodTransHistory: Array<TypeNFTHisotry> = [];
        for (let i = 0; i < arrLatestTransaction.length; i++) {
            let itemObject: TypeNFTTransactionFetch = arrLatestTransaction[i];
            if (itemObject.event !== 'Mint') continue;
            let _prodTrans: TypeNFTHisotry = { ...blankMyNFTHistory };
            _prodTrans.type = 'Created';
            _prodTrans.price = parseInt(itemObject.price) / 1e18;
            _prodTrans.user = reduceHexAddress(itemObject.from === burnAddress ? itemObject.to : itemObject.from, 4); // no proper data
            let timestamp = getTime(itemObject.timestamp.toString());
            _prodTrans.time = timestamp.date + ' ' + timestamp.time;
            _prodTrans.txHash = itemObject.tHash;
            _prodTransHistory.push(_prodTrans);
        }
        setProdTransHistory(_prodTransHistory);
    };

    const getFetchData = async () => {
        getProductDetail(await getELA2USD(), await getMyFavouritesList(signInDlgState.isLoggedIn, signInDlgState.userDid));
        getLatestTransaction();
    };

    useEffect(() => {
        getFetchData();
    }, []);

    const updateProductLikes = (type: string) => {
        setProductDetail((prevState: TypeProduct) => {
            const prodDetail: TypeProduct = { ...prevState };
            if (type === 'inc') {
                prodDetail.likes++;
            } else if (type === 'dec') {
                prodDetail.likes--;
            }
            return prodDetail;
        });
    };

    const updateProductViews = (tokenId: string) => {
        if (signInDlgState.isLoggedIn && tokenId) {
            const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/incTokenViews`;
            const reqBody = {
                token: signInDlgState.token,
                tokenId: tokenId,
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
                        setProductDetail((prevState: TypeProduct) => {
                            const prodDetail: TypeProduct = { ...prevState };
                            prodDetail.views += 1;
                            return prodDetail;
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
        updateProductViews(productDetail.tokenId);
    }, [productDetail.tokenId]);

    return (
        <Container>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <ProductImageContainer product={productDetail} updateLikes={updateProductLikes} />
                </Grid>
                <Grid item xs={6}>
                    <Typography fontSize={56} fontWeight={700}>
                        {productDetail.name}
                    </Typography>
                    <ProductSnippets
                        nickname={productDetail.author}
                        likes={productDetail.likes}
                        views={productDetail.views}
                    />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={enumBadgeType.Created} />
                        <ProductBadge badgeType={getMintCategory(productDetail.category)} />
                    </Stack>
                    {/* <ELAPrice price_ela={199} price_usd={480} marginTop={3} /> */}
                    <PrimaryButton
                        sx={{ marginTop: 3, width: '100%' }}
                        onClick={() => {
                            setDialogState({
                                ...dialogState,
                                mintTokenId: productDetail.tokenIdHex,
                                createNFTDlgOpened: true,
                                createNFTDlgStep: 3,
                            });
                        }}
                    >
                        Sell
                    </PrimaryButton>
                </Grid>
            </Grid>
            <Grid container marginTop={5} columnSpacing={10}>
                <Grid item xs={4}>
                    <Stack spacing={5}>
                        <ProductTransHistory historyList={prodTransHistory} />
                        <ProjectDescription description={productDetail.description} />
                        <AboutAuthor
                            name={productDetail.author}
                            description={productDetail.authorDescription}
                            img={productDetail.authorImg}
                            address={productDetail.authorAddress}
                        />
                        <ChainDetails
                            tokenId={productDetail.tokenIdHex}
                            ownerName={productDetail.holderName}
                            ownerAddress={productDetail.holder}
                            royalties={productDetail.royalties}
                            createTime={productDetail.createTime}
                        />
                    </Stack>
                </Grid>
                <Grid item xs={8}>
                    <Stack spacing={10}></Stack>
                </Grid>
            </Grid>
        </Container>
    );
};

export default MyNFTCreated;
