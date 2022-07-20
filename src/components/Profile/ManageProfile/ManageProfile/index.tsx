import React, { useState, useEffect } from 'react';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { SignInState, useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { TypeYourEarning } from 'src/types/product-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyToClipboardButton } from './styles';
import { useSnackbar } from 'notistack';
import { getMyTotalEarned, getMyTodayEarned, getMyEarnedList } from 'src/services/fetch';
import { reduceHexAddress } from 'src/services/common';
// import EditProfileDlgContainer from 'src/components/Profile/EditProfile';
import YourEarningDlgContainer from 'src/components/Profile/YourEarnings';

export interface ComponentProps {
    onClose: () => void;
}

const ManageProfile: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [toatlEarned, setTotalEarned] = useState<string>('0');
    const [todayEarned, setTodayEarned] = useState<string>('0');
    const [earningList, setEarningList] = useState<Array<TypeYourEarning>>([]);
    const arrStrDid = signInDlgState.address.split(':').filter((value: string) => value.length > 0);
    const strUserDid =
        arrStrDid.length === 3
            ? `did:elastos:${reduceHexAddress(arrStrDid[2], 7)}`
            : reduceHexAddress(signInDlgState.address, 10);

    const showSnackBar = () => {
        enqueueSnackbar('Copied to Clipboard!', {
            variant: 'success',
            anchorOrigin: { horizontal: 'right', vertical: 'top' },
        });
    };

    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const _totalEarned = await getMyTotalEarned(signInDlgState.walletAccounts[0]);
            const _todayEarned = await getMyTodayEarned(signInDlgState.walletAccounts[0]);
            const _myEarnedList = await getMyEarnedList(signInDlgState.walletAccounts[0]);
            if (!unmounted) {
                setTotalEarned(_totalEarned);
                setTodayEarned(_todayEarned);
                setEarningList(_myEarnedList);
            }
        };
        getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.walletAccounts]);

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
                            {toatlEarned} ELA
                        </Typography>
                        <Typography fontSize={16} fontWeight={400}>
                            Total Earned
                        </Typography>
                    </Stack>
                    <Stack alignItems="flex-end">
                        <Typography fontSize={20} fontWeight={900}>
                            {todayEarned} ELA
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
                            setDialogState({ ...dialogState, earningDlgOpened: true });
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
                            setDialogState({ ...dialogState, editProfileDlgOpened: true });
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
                                        text={signInDlgState.userDid ? signInDlgState.userDid : signInDlgState.address}
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
                                        {strUserDid}
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
                                setSignInDlgState((prevState: SignInState) => {
                                    const _state = { ...prevState };
                                    if (signInDlgState.isLoggedIn) _state.signOut = true;
                                    else _state.signInDlgOpened = true;
                                    return _state;
                                });
                                onClose();
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
            <YourEarningDlgContainer earningList={earningList} />
            {/* <EditProfileDlgContainer /> */}
        </>
    );
};

export default ManageProfile;
