import React, { useEffect } from 'react';
import { Box, Stack, Grid, Typography } from '@mui/material';
import { ViewAllBtn } from './styles';
import { TypeSingleNFTBid } from 'src/types/product-types';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton, PinkButton } from 'src/components/Buttons/styles';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import UpdateBid from 'src/components/TransactionDialogs/UpdateBid/UpdateBid';
import BidUpdateSuccess from 'src/components/TransactionDialogs/UpdateBid/BidUpdateSuccess';
import CancelBid from 'src/components/TransactionDialogs/CancelBid/CancelBid';
import CancelBidSuccess from 'src/components/TransactionDialogs/CancelBid/CancelBidSuccess';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';

interface ComponentProps {
    isLoggedIn: boolean;
    myBidsList: Array<TypeSingleNFTBid>;
    bidsList: Array<TypeSingleNFTBid>;
    onlyShowDownSm?: boolean;
}

const SingleNFTBidsTable: React.FC<ComponentProps> = ({
    isLoggedIn = false,
    myBidsList,
    bidsList,
    onlyShowDownSm = false,
}): JSX.Element => {
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();

    const bidsTblColumns = [
        { value: 'User', width: 4 },
        { value: 'Date', width: 4 },
        { value: 'Price', width: 4 },
    ];

    // update bid tx fee
    const setUpdateBidTxFee = async () => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setDialogState({ ...dialogState, updateBidTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
    };

    useEffect(() => {
        setUpdateBidTxFee();
    }, [dialogState.updateBidDlgStep]);

    // cancel bid tx fee
    const setCancelBidTxFee = async () => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setDialogState({ ...dialogState, cancelBidTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
    };

    useEffect(() => {
        setCancelBidTxFee();
    }, [dialogState.cancelBidDlgStep]);

    return (
        <>
            <Box
                display={
                    onlyShowDownSm ? { xs: 'block', sm: 'block', md: 'none' } : { xs: 'none', sm: 'none', md: 'block' }
                }
            >
                <Stack direction="column" alignItems="left" justifyContent="space-between" marginTop={1}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" marginTop={5}>
                        <Typography fontSize={22} fontWeight={700}>
                            Latest Bids
                        </Typography>
                        <ViewAllBtn
                            onClick={() => {
                                setDialogState({ ...dialogState, allBidDlgOpened: true });
                            }}
                        >
                            View ALL
                        </ViewAllBtn>
                    </Stack>
                    {isLoggedIn && (
                        <>
                            <Typography fontSize={16} fontWeight={700} marginTop={3}>
                                Your Bids
                            </Typography>
                            <Grid container alignItems="center" rowSpacing={2} marginTop={0}>
                                {bidsTblColumns.map((item, index) => (
                                    <Grid
                                        item
                                        key={index}
                                        xs={item.width}
                                        fontSize={14}
                                        fontWeight={700}
                                        sx={{ textTransform: 'uppercase' }}
                                        textAlign={item.value === 'Price' ? 'right' : 'left'}
                                        display={{ xs: 'none', sm: 'block' }}
                                    >
                                        {item.value}
                                    </Grid>
                                ))}
                                {myBidsList.map((item, index) => (
                                    <Grid container item key={index}>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={bidsTblColumns[0].width}
                                            order={{ xs: 3, sm: 1, md: 1, lg: 1 }}
                                        >
                                            <Typography fontSize={16} fontWeight={700}>
                                                {item.user}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                            sm={bidsTblColumns[1].width}
                                            order={{ xs: 1, sm: 2, md: 2, lg: 2 }}
                                        >
                                            <Typography fontSize={12} fontWeight={500}>
                                                {item.time}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                            sm={bidsTblColumns[2].width}
                                            order={{ xs: 2, sm: 3, md: 3, lg: 3 }}
                                        >
                                            <ELAPrice price_ela={item.price} price_ela_fontsize={14} alignRight />
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                            {myBidsList.length !== 0 && (
                                <Grid container spacing={1} marginTop={3}>
                                    <Grid item xs={6}>
                                        <PinkButton
                                            fullWidth
                                            onClick={() => {
                                                if (signInDlgState.isLoggedIn) {
                                                    setDialogState({
                                                        ...dialogState,
                                                        cancelBidDlgOpened: true,
                                                        cancelBidDlgStep: 0,
                                                        cancelBidOrderId: myBidsList[0].user || '',
                                                    });
                                                } else {
                                                    setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
                                                }
                                            }}
                                        >
                                            Cancel Bid
                                        </PinkButton>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <PrimaryButton
                                            fullWidth
                                            onClick={() => {
                                                if (signInDlgState.isLoggedIn) {
                                                    setDialogState({
                                                        ...dialogState,
                                                        updateBidDlgOpened: true,
                                                        updateBidDlgStep: 0,
                                                        updateBidPrice: myBidsList[0].price,
                                                        updateBidOrderId: myBidsList[0].user || '',
                                                    });
                                                } else {
                                                    setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
                                                }
                                            }}
                                        >
                                            Update Bid
                                        </PrimaryButton>
                                    </Grid>
                                </Grid>
                            )}
                        </>
                    )}
                    <Grid container alignItems="center" rowSpacing={2} marginTop={0}>
                        {bidsTblColumns.map((item, index) => (
                            <Grid
                                item
                                key={index}
                                xs={item.width}
                                fontSize={14}
                                fontWeight={700}
                                sx={{ textTransform: 'uppercase' }}
                                textAlign={item.value === 'Price' ? 'right' : 'left'}
                                display={{ xs: 'none', sm: 'block' }}
                            >
                                {item.value}
                            </Grid>
                        ))}
                        {bidsList.map((item, index) => (
                            <Grid container item key={index}>
                                <Grid item xs={12} sm={bidsTblColumns[0].width} order={{ xs: 3, sm: 1, md: 1, lg: 1 }}>
                                    <Typography fontSize={16} fontWeight={700}>
                                        {item.user}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={bidsTblColumns[1].width} order={{ xs: 1, sm: 2, md: 2, lg: 2 }}>
                                    <Typography fontSize={12} fontWeight={500}>
                                        {item.time}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={bidsTblColumns[2].width} order={{ xs: 2, sm: 3, md: 3, lg: 3 }}>
                                    <ELAPrice price_ela={item.price} price_ela_fontsize={14} alignRight />
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
            </Box>
            <ModalDialog
                open={dialogState.updateBidDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, updateBidDlgOpened: false });
                }}
            >
                {dialogState.updateBidDlgStep === 0 && <UpdateBid />}
                {dialogState.updateBidDlgStep === 1 && <BidUpdateSuccess />}
            </ModalDialog>
            <ModalDialog
                open={dialogState.cancelBidDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, cancelBidDlgOpened: false });
                }}
            >
                {dialogState.cancelBidDlgStep === 0 && <CancelBid />}
                {dialogState.cancelBidDlgStep === 1 && <CancelBidSuccess />}
            </ModalDialog>
        </>
    );
};

export default SingleNFTBidsTable;
