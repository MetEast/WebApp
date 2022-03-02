import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import ELAPriceInput from '../../components/ELAPriceInput';
import { TypeSelectItem } from 'src/types/select-types';
import Select from 'src/components/Select';
import { SelectBtn } from './styles';
import { Icon } from '@iconify/react';
import { auctionNFTExpirationOptions } from 'src/constants/select-constants';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import { AbiItem } from 'web3-utils';
import { METEAST_MARKET_CONTRACT_ABI, METEAST_MARKET_CONTRACT_ADDRESS } from 'src/contracts/METMarket';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import ModalDialog from 'src/components/ModalDialog';
import WaitingConfirm from '../../Others/WaitingConfirm';
import { isInAppBrowser } from 'src/services/wallet';

export interface ComponentProps {}

const UpdateBid: React.FC<ComponentProps> = (): JSX.Element => {
    const [expiration, setExpiration] = useState<TypeSelectItem>();
    const [expirationSelectOpen, setExpirationSelectOpen] = useState(false);
    const [bidAmount, setBidAmount] = useState(0);
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [loadingDlgOpened, setLoadingDlgOpened] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);

    const callChangeOrderPrice = async (_orderId: string, _price: string) => {
        const accounts = await walletConnectWeb3.eth.getAccounts();

        const contractAbi = METEAST_MARKET_CONTRACT_ABI;
        const contractAddress = METEAST_MARKET_CONTRACT_ADDRESS;
        const marketContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);

        const gasPrice = await walletConnectWeb3.eth.getGasPrice();
        console.log('Gas price:', gasPrice);

        console.log('Sending transaction with account address:', accounts[0]);
        const transactionParams = {
            from: accounts[0],
            gasPrice: gasPrice,
            gas: 5000000,
            value: 0,
        };
        let txHash = '';

        setLoadingDlgOpened(true);
        const timer = setTimeout(() => setLoadingDlgOpened(false), 120000);
        marketContract.methods
            .changeOrderPrice(_orderId, _price)
            .send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log('transactionHash', hash);
                txHash = hash;
                setLoadingDlgOpened(false);
                clearTimeout(timer);
            })
            .on('receipt', (receipt: any) => {
                console.log('receipt', receipt);
                enqueueSnackbar('Update bid succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({
                    ...dialogState,
                    changePriceDlgOpened: true,
                    changePriceDlgStep: 1,
                    changePriceTxHash: txHash,
                });
            })
            .on('error', (error: any, receipt: any) => {
                console.error('error', error);
                enqueueSnackbar('Update bid error!', {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setLoadingDlgOpened(false);
                clearTimeout(timer);
                setDialogState({ ...dialogState, changePriceDlgOpened: false, errorMessageDlgOpened: true });
            });
    };

    const handleUpdateBid = () => {
        if (dialogState.updateBidTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'warning',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        } else if (isNaN(bidAmount) || bidAmount <= 0) {
            enqueueSnackbar('Invalid price!', {
                variant: 'warning',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        callChangeOrderPrice(dialogState.updateBidOrderId, BigInt(bidAmount * 1e18).toString());
    };

    return (
        <>
            <Stack spacing={5} width={320}>
                <Stack alignItems="center">
                    <PageNumberTypo>1 of 2</PageNumberTypo>
                    <DialogTitleTypo>Update Bid</DialogTitleTypo>
                    <Typography fontSize={16} fontWeight={400} marginTop={1}>
                        Current Bid: {dialogState.updateBidPrice} ELA
                    </Typography>
                </Stack>
                <Stack spacing={2.5}>
                    <ELAPriceInput
                        title="New Bid Amount"
                        handleChange={(value) => {
                            setBidAmount(value);
                        }}
                    />
                    <Stack spacing={0.5}>
                        <Typography fontSize={12} fontWeight={700}>
                            Expiration
                        </Typography>
                        <Select
                            titlebox={
                                <SelectBtn fullWidth isopen={expirationSelectOpen ? 1 : 0}>
                                    {expiration ? expiration.label : 'Select'}
                                    <Icon icon="ph:caret-down" className="arrow-icon" />
                                </SelectBtn>
                            }
                            options={auctionNFTExpirationOptions}
                            isOpen={expirationSelectOpen ? 1 : 0}
                            handleClick={(value: string) => {
                                const item = auctionNFTExpirationOptions.find((option) => option.value === value);
                                setExpiration(item);
                            }}
                            setIsOpen={setExpirationSelectOpen}
                        />
                    </Stack>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <SecondaryButton
                        fullWidth
                        onClick={() => {
                            setDialogState({
                                ...dialogState,
                                updateBidPrice: 0,
                                updateBidTxFee: 0,
                                updateBidOrderId: '',
                                updateBidTxHash: '',
                                updateBidDlgOpened: false,
                                updateBidDlgStep: 0,
                            });
                        }}
                    >
                        close
                    </SecondaryButton>
                    <PrimaryButton fullWidth onClick={handleUpdateBid}>
                        Next
                    </PrimaryButton>
                </Stack>
            </Stack>
            <ModalDialog
                open={loadingDlgOpened}
                onClose={() => {
                    setLoadingDlgOpened(false);
                }}
            >
                <WaitingConfirm />
            </ModalDialog>
        </>
    );
};

export default UpdateBid;
