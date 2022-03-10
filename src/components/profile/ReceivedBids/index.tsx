import React, { useState, useEffect } from 'react';
import { Stack, Grid, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { TypeSelectItem } from 'src/types/select-types';
import { SecondaryButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';
import Select from 'src/components/Select';
import { SelectTitleBtn } from './styles';
import { Icon } from '@iconify/react';
import { TypeSingleNFTBid } from 'src/types/product-types';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import AcceptBid from 'src/components/TransactionDialogs/AcceptBid/AcceptBid';
import SaleSuccess from 'src/components/TransactionDialogs/AcceptBid/SaleSuccess';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useSignInContext } from 'src/context/SignInContext';

export interface ComponentProps {
    bidsList: Array<TypeSingleNFTBid>;
    closeDlg: () => void;
    changeHandler: (value: TypeSelectItem | undefined) => void;
}

const ReceivedBids: React.FC<ComponentProps> = ({ bidsList, closeDlg, changeHandler }): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [sortby, setSortby] = useState<TypeSelectItem>();
    const [sortBySelectOpen, isSortBySelectOpen] = useState(false);
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const { library } = useWeb3React<Web3Provider>();
    const walletConnectWeb3 = new Web3(
        signInDlgState.loginType === '1' ? (walletConnectProvider as any) : (library?.provider as any),
    );

    const sortbyOptions: Array<TypeSelectItem> = [
        {
            label: 'Option1',
            value: 'Option1',
        },
        {
            label: 'Option2',
            value: 'Option2',
        },
        {
            label: 'Option3',
            value: 'Option3',
        },
    ];
    const handleSortbyChange = (value: string) => {
        const item = sortbyOptions.find((option) => option.value === value);
        setSortby(item);
        changeHandler(item);
    };

    // tx Fee
    useEffect(() => {
        const setAcceptBidTxFee = async () => {
            const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
            setDialogState({ ...dialogState, acceptBidTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
        };
        setAcceptBidTxFee();
    }, [dialogState.acceptBidDlgStep]);

    return (
        <>
            <Stack spacing={5} width={520}>
                <Stack direction="row" justifyContent="space-between">
                    <DialogTitleTypo>Received bids</DialogTitleTypo>
                    <Select
                        titlebox={
                            <SelectTitleBtn fullWidth isOpen={sortBySelectOpen ? 1 : 0}>
                                <Icon icon="ph:sort-ascending" fontSize={20} />
                                {sortby ? sortby.label : 'Sort by'}
                                <Icon icon="ph:caret-down" className="arrow-icon" style={{ marginBottom: 2 }} />
                            </SelectTitleBtn>
                        }
                        selectedItem={sortby}
                        options={sortbyOptions}
                        isOpen={sortBySelectOpen ? 1 : 0}
                        setIsOpen={isSortBySelectOpen}
                        handleClick={handleSortbyChange}
                        width={160}
                    />
                </Stack>
                <Stack spacing={3}>
                    <Box>
                        <Grid container>
                            <Grid item xs={4}>
                                <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                    User
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                    Date
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                    Price
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container marginTop={2.5} rowGap={3} alignItems="center">
                            {bidsList.map((item, index) => (
                                <>
                                    <Grid item xs={4}>
                                        <Typography fontSize={16} fontWeight={700}>
                                            {item.user}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography fontSize={12} fontWeight={500}>
                                            {item.time}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <ELAPrice price_ela={item.price} price_ela_fontsize={14} />
                                    </Grid>
                                    {/* <Grid item xs={3} display="flex" flexDirection="row" justifyContent="flex-end">
                                        <SecondaryButton
                                            size="small"
                                            sx={{
                                                height: 32,
                                                fontSize: 14,
                                                paddingX: 2,
                                                paddingTop: '12px',
                                                paddingBottom: '10px',
                                            }}
                                            onClick={() => {
                                                if (signInDlgState.isLoggedIn) {
                                                    setDialogState({
                                                        ...dialogState,
                                                        acceptBidDlgOpened: true,
                                                        acceptBidDlgStep: 0,
                                                        acceptBidName: bidsList[index].user,
                                                        acceptBidOrderId: bidsList[index].orderId || '',
                                                        acceptBidPrice: bidsList[index].price
                                                    });
                                                } else {
                                                    setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
                                                }
                                            }}
                                        >
                                            Accept
                                        </SecondaryButton>
                                    </Grid> */}
                                </>
                            ))}
                        </Grid>
                    </Box>
                </Stack>
                <SecondaryButton fullWidth onClick={closeDlg}>
                    Close
                </SecondaryButton>
            </Stack>
            <ModalDialog
                open={dialogState.acceptBidDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, acceptBidDlgOpened: false });
                }}
            >
                {dialogState.acceptBidDlgStep === 0 && <AcceptBid />}
                {dialogState.acceptBidDlgStep === 1 && <SaleSuccess />}
            </ModalDialog>
        </>
    );
};

export default ReceivedBids;
