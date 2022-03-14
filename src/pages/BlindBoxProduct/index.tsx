import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stack, Grid, Box, Skeleton, Typography } from '@mui/material';
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
import { enumBadgeType, enumBlindBoxNFTType, TypeProduct } from 'src/types/product-types';
import { getBBItem, getELA2USD } from 'src/services/fetch';
import { reduceHexAddress } from 'src/services/common';
import Container from 'src/components/Container';
import { blankBBItem } from 'src/constants/init-constants';
import ProjectDescription from 'src/components/SingleNFTMoreInfo/ProjectDescription';
import AboutAuthor from 'src/components/SingleNFTMoreInfo/AboutAuthor';

const BlindBoxProduct: React.FC = (): JSX.Element => {
    const params = useParams();
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [blindBoxDetail, setBlindBoxDetail] = useState<TypeProduct>(blankBBItem);

    // -------------- Fetch Data -------------- //
    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const ELA2USD = await getELA2USD();
            const _BBItem = await getBBItem(params.id, ELA2USD, signInDlgState.userDid);
            if (!unmounted) {
                setBlindBoxDetail(_BBItem);
            }
        };
        getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.isLoggedIn, signInDlgState.userDid, params.id]);

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

    useEffect(() => {
        let unmounted = false;
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
                            if (!unmounted) {
                                setBlindBoxDetail((prevState: TypeProduct) => {
                                    const blindDetail: TypeProduct = { ...prevState };
                                    blindDetail.views += 1;
                                    return blindDetail;
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
        updateBlindBoxViews(blindBoxDetail.tokenId);
        return () => {
            unmounted = true;
        };
    }, [blindBoxDetail.tokenId, signInDlgState.isLoggedIn, signInDlgState.token, signInDlgState.userDid]);

    return (
        <Container sx={{ paddingTop: { xs: 4, sm: 0 } }}>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5} rowGap={2}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    {blindBoxDetail.tokenId === '' ? (
                        <Box
                            position="relative"
                            borderRadius={4}
                            overflow="hidden"
                            sx={{ width: '100%', paddingTop: '75%' }}
                        >
                            <Box position="absolute" sx={{ inset: 0 }}>
                                <Skeleton
                                    variant="rectangular"
                                    animation="wave"
                                    width="100%"
                                    height="100%"
                                    sx={{ bgcolor: '#E8F4FF' }}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <ProductImageContainer
                            product={blindBoxDetail}
                            updateLikes={updateBlindBoxLikes}
                            isBlindBox={true}
                        />
                    )}
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    {blindBoxDetail.tokenId === '' ? (
                        <>
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width="100%"
                                height={45}
                                sx={{ borderRadius: 2, bgcolor: '#E8F4FF' }}
                            />
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width="100%"
                                height={45}
                                sx={{ borderRadius: 2, bgcolor: '#E8F4FF', marginTop: 2 }}
                            />
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width="100%"
                                height={56}
                                sx={{ borderRadius: 2, bgcolor: '#E8F4FF', marginTop: 3 }}
                            />
                        </>
                    ) : (
                        <>
                            <Typography fontSize={{ md: 56, sm: 42, xs: 32 }} fontWeight={700}>
                                {blindBoxDetail.name}
                            </Typography>
                            <ProductSnippets
                                nickname={
                                    blindBoxDetail.author === '' ? blindBoxDetail.royaltyOwner : blindBoxDetail.author
                                }
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
                            <ELAPrice
                                price_ela={blindBoxDetail.price_ela}
                                price_usd={blindBoxDetail.price_usd}
                                marginTop={3}
                            />
                            {signInDlgState.walletAccounts !== [] &&
                                blindBoxDetail.holder !== signInDlgState.walletAccounts[0] &&
                                blindBoxDetail.type === enumBlindBoxNFTType.SaleEnds &&
                                blindBoxDetail.state === 'online' &&
                                signInDlgState.userDid !== blindBoxDetail.did && (
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
                                                buyBlindBoxId: parseInt(blindBoxDetail.tokenId),
                                                buyBlindCreator:
                                                    blindBoxDetail.author === ''
                                                        ? reduceHexAddress(blindBoxDetail.royaltyOwner || '', 4)
                                                        : blindBoxDetail.author,
                                                buyBlindLeftAmount:
                                                    blindBoxDetail.maxPurchases !== undefined &&
                                                    blindBoxDetail.sold !== undefined
                                                        ? blindBoxDetail.maxPurchases - blindBoxDetail.sold
                                                        : 0,
                                            });
                                        }}
                                    >
                                        Buy Now
                                    </PrimaryButton>
                                )}
                        </>
                    )}
                </Grid>
            </Grid>
            {blindBoxDetail.tokenId === '' ? (
                <Box position="relative" marginTop={5} sx={{ width: '100%', paddingTop: '75%' }}>
                    <Box position="absolute" sx={{ inset: 0 }}>
                        <Skeleton
                            variant="rectangular"
                            animation="wave"
                            width="100%"
                            height="100%"
                            sx={{ borderRadius: 4, bgcolor: '#E8F4FF' }}
                        />
                    </Box>
                </Box>
            ) : (
                <Grid container marginTop={5} columnSpacing={10}>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={5}>
                            <ProjectDescription description={blindBoxDetail.description} />
                            <AboutAuthor
                                name={blindBoxDetail.author}
                                description={blindBoxDetail.authorDescription}
                                img={blindBoxDetail.authorImg}
                                address={reduceHexAddress(blindBoxDetail.royaltyOwner || '', 4)}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            )}
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
