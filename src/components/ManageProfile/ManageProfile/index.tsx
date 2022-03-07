import React, { useState, useEffect } from 'react';
import { Stack, Typography, Box, Grid } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { useSignInContext } from 'src/context/SignInContext';
import ModalDialog from 'src/components/ModalDialog';
import YourEarnings from 'src/components/TransactionDialogs/YourEarnings';
import EditProfile from 'src/components/TransactionDialogs/EditProfile';
import { enumBadgeType, TypeYourEarning, TypeYourEarningFetch } from 'src/types/product-types';
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
    const { enqueueSnackbar } = useSnackbar();
    const [earningsDlgOpen, setEarningsDlgOpen] = useState<boolean>(false);
    const [editProfileDlgOpen, setEditProfileDlgOpen] = useState<boolean>(false);
    const [toatlEarned, setTotalEarned] = useState<number>(0);
    const [todayEarned, setTodayEarned] = useState<number>(0);
    const [earningList, setEarningList] = useState<Array<TypeYourEarning>>([]);
    const blankMyEarningValue: TypeYourEarning = {
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
        setTotalEarned(await getTotalEarned(signInDlgState.walletAccounts[0]));
        setTodayEarned(await getTodayEarned(signInDlgState.walletAccounts[0]));
        getEarningList();
    };

    const getEarningList = async () => {
        const resEarnedResult = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getEarnedListByAddress?address=${signInDlgState.walletAccounts[0]}`,
            FETCH_CONFIG_JSON,
        );
        const dataEarnedResult = await resEarnedResult.json();
        const arrEarnedResult = dataEarnedResult === undefined ? [] : dataEarnedResult.data;

        const _myEarningList: any = [];
        for (let i = 0; i < arrEarnedResult.length; i++) {
            const itemObject: TypeYourEarningFetch = arrEarnedResult[i];
            let _earning: TypeYourEarning = { ...blankMyEarningValue };
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
                width={{ xs: '100%', md: 470 }}
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
                <Grid container padding={3} borderRadius={6} rowGap={4} sx={{ background: '#F0F1F2' }}>
                    <Grid item xs={12} md={9} order={0}>
                        {signInDlgState.isLoggedIn && (
                            <>
                                {signInDlgState.userName && (
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <Icon icon="ph:user" fontSize={20} color="black" />
                                        <Typography fontSize={18} fontWeight={700}>
                                            {signInDlgState.userName}
                                        </Typography>
                                    </Stack>
                                )}
                                <Stack direction="row" spacing={0.5}>
                                    <CopyToClipboard
                                        text={`did:elastos:${signInDlgState.userDid}`}
                                        onCopy={showSnackBar}
                                    >
                                        <CopyToClipboardButton>
                                            <Icon
                                                icon="ph:copy"
                                                color="#1890FF"
                                                style={{ marginTop: '1px', cursor: 'pointer' }}
                                            />
                                        </CopyToClipboardButton>
                                    </CopyToClipboard>
                                    <Typography fontSize={14} fontWeight={400}>
                                        {`did:elastos:${reduceHexAddress(signInDlgState.userDid, 7)}`}
                                    </Typography>
                                </Stack>
                            </>
                        )}
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={3}
                        display={{ md: 'flex' }}
                        flexDirection="row"
                        justifyContent="flex-end"
                        order={{ xs: 2, md: 1 }}
                    >
                        <PrimaryButton
                            fullWidth
                            sx={{ height: 32, borderRadius: 2.5, fontSize: 14 }}
                            onClick={() => {
                                signInDlgState.isLoggedIn
                                    ? setSignInDlgState({ ...signInDlgState, signOut: true })
                                    : setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
                            }}
                        >
                            {signInDlgState.isLoggedIn ? 'sign out' : 'sign in'}
                        </PrimaryButton>
                    </Grid>
                    <Grid item xs={12} order={{ xs: 1, md: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={0.25}>
                            <Icon icon="ph:wallet" fontSize={20} color="black" style={{ marginBottom: '2px' }} />
                            <Typography fontSize={18} fontWeight={700}>
                                {signInDlgState.walletBalance} ELA
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5}>
                            <CopyToClipboard text={signInDlgState.walletAccounts[0]} onCopy={showSnackBar}>
                                <CopyToClipboardButton>
                                    <Icon
                                        icon="ph:copy"
                                        color="#1890FF"
                                        style={{ marginTop: '1px', cursor: 'pointer' }}
                                    />
                                </CopyToClipboardButton>
                            </CopyToClipboard>
                            <Typography fontSize={14} fontWeight={400}>
                                {reduceHexAddress(signInDlgState.walletAccounts[0], 4)}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
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
