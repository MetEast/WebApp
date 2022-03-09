import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stack, Grid, Box, Typography } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton } from 'src/components/Buttons/styles';
import AboutAuthor from 'src/components/SingleNFTMoreInfo/AboutAuthor';
import ProjectDescription from 'src/components/SingleNFTMoreInfo/ProjectDescription';
import ChainDetails from 'src/components/SingleNFTMoreInfo/ChainDetails';
import PriceHistoryView from 'src/components/PriceHistoryView';
import ProductTransHistory from 'src/components/ProductTransHistory';
import NFTTransactionTable from 'src/components/NFTTransactionTable';
import { getMintCategory } from 'src/services/common';
import { enumBadgeType, TypeProduct, TypeNFTTransaction, TypeNFTHisotry } from 'src/types/product-types';
import { getNFTLatestTxs, getELA2USD, getMyFavouritesList, getMyNFTItem } from 'src/services/fetch';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { isInAppBrowser } from 'src/services/wallet';
import { TypeSelectItem } from 'src/types/select-types';
import ModalDialog from 'src/components/ModalDialog';
import AllTransactions from 'src/components/profile/AllTransactions';
import Container from 'src/components/Container';
import { blankNFTItem } from 'src/constants/init-constants';

const MyNFTPurchased: React.FC = (): JSX.Element => {
    const params = useParams(); // params.id
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [productDetail, setProductDetail] = useState<TypeProduct>(blankNFTItem);
    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);
    const [transactionSortBy, setTransactionSortBy] = useState<TypeSelectItem>();
    const [prodTransHistory, setProdTransHistory] = useState<Array<TypeNFTHisotry>>([]);
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);

    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const ELA2USD = await getELA2USD();
            const likeList = await getMyFavouritesList(signInDlgState.isLoggedIn, signInDlgState.userDid);
            const _MyNFTItem = await getMyNFTItem(params.id, ELA2USD, likeList);
            if (!unmounted) {
                setProductDetail(_MyNFTItem);
            }
        };
        getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.isLoggedIn, signInDlgState.userDid, params.id]);

    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const _NFTTxs = await getNFTLatestTxs(params.id, signInDlgState.walletAccounts[0], 1, 5);
            if (!unmounted) {
                setTransactionsList(_NFTTxs.txs);
                setProdTransHistory(_NFTTxs.history);
            }
        };
        getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [transactionSortBy, params.id, signInDlgState.walletAccounts]);

    useEffect(() => {
        const setSaleTxFee = async () => {
            const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
            setDialogState({ ...dialogState, sellTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
        };
        setSaleTxFee();
    }, [dialogState.createNFTDlgStep]);

    const updateProductLikes = (type: string) => {
        let prodDetail: TypeProduct = { ...productDetail };
        if (type === 'inc') {
            prodDetail.likes += 1;
        } else if (type === 'dec') {
            prodDetail.likes -= 1;
        }
        setProductDetail(prodDetail);
    };

    useEffect(() => {
        let unmounted = false;
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
                            if (!unmounted) {
                                setProductDetail((prevState: TypeProduct) => {
                                    const prodDetail: TypeProduct = { ...prevState };
                                    prodDetail.views += 1;
                                    return prodDetail;
                                });
                            }
                        } else {
                            console.log(data);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        };
        updateProductViews(productDetail.tokenId);
        return () => {
            unmounted = true;
        };
    }, [productDetail.tokenId, signInDlgState.token, signInDlgState.userDid]);

    return (
        <Container sx={{ paddingTop: { xs: 4, sm: 0 } }}>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5} rowGap={1}>
                <Grid item xs={12} md={6}>
                    <ProductImageContainer product={productDetail} updateLikes={updateProductLikes} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography fontSize={56} fontWeight={700}>
                        {productDetail.name}
                    </Typography>
                    <ProductSnippets
                        nickname={productDetail.author}
                        likes={productDetail.likes}
                        views={productDetail.views}
                    />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={enumBadgeType.Purchased} />
                        <ProductBadge badgeType={getMintCategory(productDetail.category)} />
                    </Stack>
                    <ELAPrice price_ela={productDetail.price_ela} price_usd={productDetail.price_usd} marginTop={3} />
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
            <Grid container marginTop={5} columnSpacing={10} rowGap={5}>
                <Grid item xs={12} md={4}>
                    <Stack spacing={5}>
                        <ProductTransHistory historyList={prodTransHistory} />
                        <ProjectDescription description={productDetail.description} />
                        <Box>
                            <Grid container columnSpacing={10} rowGap={5}>
                                <Grid item xs={12} sm={6} md={12}>
                                    <AboutAuthor
                                        name={productDetail.author}
                                        description={productDetail.authorDescription}
                                        img={productDetail.authorImg}
                                        address={productDetail.authorAddress}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={12}>
                                    <ChainDetails
                                        tokenId={productDetail.tokenIdHex}
                                        ownerName={productDetail.holderName}
                                        ownerAddress={productDetail.holder}
                                        royalties={productDetail.royalties}
                                        createTime={productDetail.createTime}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Stack spacing={10}>
                        <PriceHistoryView />
                        <NFTTransactionTable transactionsList={transactionsList} />
                    </Stack>
                </Grid>
            </Grid>
            <ModalDialog
                open={dialogState.allTxDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, allTxDlgOpened: false });
                }}
            >
                <AllTransactions
                    transactionList={transactionsList}
                    changeHandler={(value: TypeSelectItem | undefined) => setTransactionSortBy(value)}
                />
            </ModalDialog>
        </Container>
    );
};

export default MyNFTPurchased;
