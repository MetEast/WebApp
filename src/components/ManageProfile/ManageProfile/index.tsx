import React, { useState, useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { useSignInContext } from 'src/context/SignInContext';
import ModalDialog from 'src/components/ModalDialog';
import YourEarnings from 'src/components/TransactionDialogs/YourEarnings';
import EditProfile from 'src/components/TransactionDialogs/EditProfile';
import { enumBadgeType, TypeYourEarning, TypeYourEarningFetch } from 'src/types/product-types';
import { useCookies } from 'react-cookie';
import { UserTokenType } from 'src/types/auth-types';
import jwtDecode from 'jwt-decode';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyToClipboardButton } from './styles';
import { useSnackbar } from 'notistack';
import { getTotalEarned, getTodayEarned, FETCH_CONFIG_JSON } from 'src/services/fetch';
import { getImageFromAsset, getTime, reduceHexAddress } from 'src/services/common';

export interface ComponentProps {
    onClose: () => void;
}

const ManageProfile: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [didCookies] = useCookies(['METEAST_DID']);
    const [tokenCookies] = useCookies(['METEAST_TOKEN']);
    const { enqueueSnackbar } = useSnackbar();
    const [earningsDlgOpen, setEarningsDlgOpen] = useState<boolean>(false);
    const [editProfileDlgOpen, setEditProfileDlgOpen] = useState<boolean>(false);
    const [toatlEarned, setTotalEarned] = useState<number>(0);
    const [todayEarned, setTodayEarned] = useState<number>(0);
    const [earningList, setEarningList] = useState<Array<TypeYourEarning>>([]);
    const userInfo: UserTokenType =
        tokenCookies.METEAST_TOKEN === undefined
            ? {
                  did: '',
                  name: '',
                  description: '',
                  avatar: '',
                  coverImage: '',
                  exp: 0,
                  iat: 0,
              }
            : jwtDecode(tokenCookies.METEAST_TOKEN);
    const defaultEarningValue: TypeYourEarning = {
        avatar: '',
        title: '',
        time: '',
        price: 0,
        badge: enumBadgeType.Other,
    };
    const showSnackBar = () => {
        enqueueSnackbar('Copied to Clipboard!', {
            variant: 'success',
            anchorOrigin: { horizontal: 'right', vertical: 'top' },
        });
    };

    const getPersonalData = async () => {
        let _totalEarned = await getTotalEarned(signInDlgState.walletAccounts[0]);
        let _todayEarned = await getTodayEarned(signInDlgState.walletAccounts[0]);
        setTotalEarned(_totalEarned);
        setTodayEarned(_todayEarned);
        getEarningList();
    };

    const getEarningList = async () => {
        const resEarnedResult = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getEarnedListByAddress?address=${signInDlgState.walletAccounts[0]}`,
            FETCH_CONFIG_JSON,
        );
        const dataEarnedResult = await resEarnedResult.json();
        const arrEarnedResult = dataEarnedResult === undefined ? [] : dataEarnedResult.data;

        let _myEarningList: any = [];
        for (let i = 0; i < arrEarnedResult.length; i++) {
            const itemObject: TypeYourEarningFetch = arrEarnedResult[i];
            let _earning: TypeYourEarning = { ...defaultEarningValue };
            _earning.title = itemObject.name;
            _earning.avatar = getImageFromAsset(itemObject.thumbnail);
            _earning.price = itemObject.iEarned / 1e18;
            let timestamp = getTime(itemObject.updateTime);
            _earning.time = timestamp.date + ' ' + timestamp.time;
            _earning.badge = itemObject.Badge === 'Badge' ? enumBadgeType.Sale : enumBadgeType.Royalties;
            _myEarningList.push(_earning);
        }
        setEarningList(_myEarningList);
    };

    useEffect(() => {
        if (signInDlgState.walletAccounts.length) getPersonalData();
    }, [signInDlgState]);

    return (
        <>
            <Stack
                spacing={5}
                width={{ xs: '100%', sm: 470 }}
                paddingY={{ xs: 4, sm: 0 }}
                sx={{ overflowY: 'auto', overflowX: 'hidden' }}
            >
                <Stack>
                    <DialogTitleTypo sx={{ textAlign: 'center' }}>Manage Profile</DialogTitleTypo>
                </Stack>
                <Stack direction="row" justifyContent="space-between" display={{ xs: 'flex', md: 'none' }}>
                    <Stack>
                        <Typography fontSize={20} fontWeight={900}>
                            {toatlEarned.toFixed(2)} ELA
                        </Typography>
                        <Typography fontSize={16} fontWeight={400}>
                            Total Earned
                        </Typography>
                    </Stack>
                    <Stack alignItems="flex-end">
                        <Typography fontSize={20} fontWeight={900}>
                            {todayEarned.toFixed(2)} ELA
                        </Typography>
                        <Typography fontSize={16} fontWeight={400}>
                            Earned Today
                        </Typography>
                    </Stack>
                </Stack>
                <Stack width="100%" direction="row" justifyContent="space-between" display={{ xs: 'flex', md: 'none' }}>
                    <SecondaryButton
                        size="small"
                        sx={{ paddingX: 2.5 }}
                        onClick={() => {
                            setEarningsDlgOpen(true);
                        }}
                    >
                        <Icon
                            icon="ph:coin"
                            fontSize={20}
                            color="#1890FF"
                            style={{ marginBottom: 1, marginRight: 4 }}
                        />
                        Earnings
                    </SecondaryButton>
                    <SecondaryButton
                        size="small"
                        sx={{ paddingX: 2.5 }}
                        onClick={() => {
                            setEditProfileDlgOpen(true);
                        }}
                    >
                        <Icon
                            icon="ph:magic-wand"
                            fontSize={20}
                            color="#1890FF"
                            style={{ marginBottom: 1, marginRight: 4 }}
                        />
                        Edit Profile
                    </SecondaryButton>
                </Stack>
                <Stack padding={3} borderRadius={6} sx={{ background: '#F0F1F2' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Icon icon="ph:user" fontSize={20} color="black" />
                            <Typography
                                fontSize={14}
                                fontWeight={700}
                                color="black"
                                sx={{ textTransform: 'uppercase' }}
                            >
                                Identity
                            </Typography>
                        </Stack>
                        <PrimaryButton
                            sx={{ height: 32, borderRadius: 2.5, fontSize: 14 }}
                            onClick={() => {
                                signInDlgState.isLoggedIn
                                    ? setSignInDlgState({ ...signInDlgState, disconnectWallet: true })
                                    : setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
                            }}
                        >
                            {signInDlgState.isLoggedIn ? 'sign out' : 'sign in'}
                        </PrimaryButton>
                    </Stack>
                    {signInDlgState.isLoggedIn && (
                        <>
                            <Typography fontSize={18} fontWeight={700} marginTop={3}>
                                {userInfo.name}
                            </Typography>
                            <Stack direction="row" spacing={0.5}>
                                <CopyToClipboard text={userInfo.did} onCopy={showSnackBar}>
                                    <CopyToClipboardButton>
                                        <Icon
                                            icon="ph:copy"
                                            color="#1890FF"
                                            style={{ marginTop: '1px', cursor: 'pointer' }}
                                        />
                                    </CopyToClipboardButton>
                                </CopyToClipboard>
                                <Typography fontSize={14} fontWeight={400}>
                                    {`did:elastos:${reduceHexAddress(didCookies.METEAST_DID, 7)}`}
                                </Typography>
                            </Stack>
                        </>
                    )}
                </Stack>
                <Stack padding={3} borderRadius={6} sx={{ background: '#F0F1F2' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Icon icon="ph:wallet" fontSize={20} color="black" />
                            <Typography
                                fontSize={14}
                                fontWeight={700}
                                color="black"
                                sx={{ textTransform: 'uppercase' }}
                            >
                                Wallet
                            </Typography>
                        </Stack>
                        <PrimaryButton
                            sx={{ height: 32, borderRadius: 2.5, fontSize: 14 }}
                            onClick={() => {
                                setSignInDlgState({ ...signInDlgState, disconnectWallet: true });
                            }}
                        >
                            Disconnect
                        </PrimaryButton>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.25} marginTop={3}>
                        <img src="/assets/icons/elatos-ela.svg" alt="" style={{ marginBottom: '2px' }} />
                        <Typography fontSize={18} fontWeight={700}>
                            {signInDlgState.walletBalance} ELA
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5}>
                        <CopyToClipboard text={signInDlgState.walletAccounts[0]} onCopy={showSnackBar}>
                            <CopyToClipboardButton>
                                <Icon icon="ph:copy" color="#1890FF" style={{ marginTop: '1px', cursor: 'pointer' }} />
                            </CopyToClipboardButton>
                        </CopyToClipboard>
                        <Typography fontSize={14} fontWeight={400}>
                            {reduceHexAddress(signInDlgState.walletAccounts[0], 4)}
                        </Typography>
                    </Stack>
                </Stack>
                <SecondaryButton fullWidth onClick={onClose}>
                    Close
                </SecondaryButton>
            </Stack>
            <ModalDialog
                open={earningsDlgOpen}
                onClose={() => {
                    setEarningsDlgOpen(false);
                }}
            >
                <YourEarnings
                    earnings={earningList}
                    onClose={() => {
                        setEarningsDlgOpen(false);
                    }}
                />
            </ModalDialog>
            <ModalDialog
                open={editProfileDlgOpen}
                onClose={() => {
                    setEditProfileDlgOpen(false);
                }}
            >
                <EditProfile
                    onClose={() => {
                        setEditProfileDlgOpen(false);
                    }}
                />
            </ModalDialog>
        </>
    );
};

export default ManageProfile;
