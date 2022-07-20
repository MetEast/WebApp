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
import { defaultDlgState, useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { callContractMethod } from 'src/components/ContractMethod';
import { blankContractMethodParam } from 'src/constants/init-constants';
import { enumMetEastContractType } from 'src/types/contract-types';
import { enumAuthType } from 'src/types/auth-types';

export interface ComponentProps {}

const UpdateBid: React.FC<ComponentProps> = (): JSX.Element => {
    const [expiration, setExpiration] = useState<TypeSelectItem>();
    const [expirationSelectOpen, setExpirationSelectOpen] = useState(false);
    const [bidAmount, setBidAmount] = useState(0);
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [onProgress, setOnProgress] = useState<boolean>(false);
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const { library } = useWeb3React<Web3Provider>();
    const walletConnectWeb3 = new Web3(
        signInDlgState.loginType === enumAuthType.ElastosEssentials
            ? (walletConnectProvider as any)
            : (library?.provider as any),
    );

    const handleUpdateBid = () => {
        if (dialogState.updateBidTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'error',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        } else if (isNaN(bidAmount) || bidAmount <= 0) {
            enqueueSnackbar('Invalid price!', {
                variant: 'error',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        setOnProgress(true);
        let unmounted = false;
        const updatedState = { ...dialogState };
        updatedState.waitingConfirmDlgOpened = true;
        updatedState.waitingConfirmDlgTimer = setTimeout(() => {
            setDialogState({
                ...defaultDlgState,
                errorMessageDlgOpened: true,
            });
        }, 120000);
        if (!unmounted) setDialogState(updatedState);

        callContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: enumMetEastContractType.METEAST_MARKET,
            method: 'changeOrderPrice',
            price: '0',
            orderId: dialogState.updateBidOrderId,
            _price: BigInt(bidAmount * 1e18).toString(),
        })
            .then((txHash: string) => {
                enqueueSnackbar('Update bid succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                if (!unmounted) {
                    setDialogState({
                        ...updatedState,
                        changePriceDlgOpened: true,
                        changePriceDlgStep: 1,
                        changePriceTxHash: txHash,
                        waitingConfirmDlgOpened: false,
                    });
                }
            })
            .catch((error) => {
                enqueueSnackbar(`Update bid error.`, {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                if (!unmounted) {
                    setDialogState({
                        ...updatedState,
                        changePriceDlgOpened: false,
                        waitingConfirmDlgOpened: false,
                        errorMessageDlgOpened: true,
                    });
                }
            })
            .finally(() => {
                setOnProgress(false);
            });
        return () => {
            unmounted = true;
        };
    };

    return (
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
                        selectedItem={expiration}
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
                            // updateBidTxFee: 0,
                            updateBidOrderId: '',
                            updateBidTxHash: '',
                            updateBidDlgOpened: false,
                            updateBidDlgStep: 0,
                        });
                    }}
                >
                    close
                </SecondaryButton>
                <PrimaryButton fullWidth disabled={onProgress} onClick={handleUpdateBid}>
                    Next
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default UpdateBid;
