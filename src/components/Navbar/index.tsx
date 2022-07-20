import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { TypeMenuItem } from 'src/types/layout-types';
import PageButton from './PageButton';
import { useNavigate } from 'react-router-dom';
import { SignInState, useSignInContext } from 'src/context/SignInContext';
import { Icon } from '@iconify/react';
import { useDialogContext } from 'src/context/DialogContext';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { useStyles, NotificationTypo, MenuButton, NotificationsBoxContainer } from './styles';
import NotificationsBox from 'src/components/NotificationsBox';
import { getNotificationList } from 'src/services/fetch';
import { TypeNotification } from 'src/types/notification-types';
import { useNotificationContext } from 'src/context/NotificationContext';
import useOnClickOutside from 'src/hooks/useOnClickOutside';

interface ComponentProps {
    mobile?: boolean;
}

const Navbar: React.FC<ComponentProps> = ({ mobile = false }): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [notificationState, setNotificationState] = useNotificationContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [showNotificationsBox, setShowNotificationsBox] = useState<boolean>(false);
    const isProfilePage = location.pathname === '/profile';
    const isAdmin = !isNaN(signInDlgState.userRole) && signInDlgState.userRole < 2;
    const [refetch, setRefetch] = useState<boolean>(false);

    const notificationsBoxContainerNode = useRef<HTMLDivElement>();
    useOnClickOutside(notificationsBoxContainerNode, () => setShowNotificationsBox(false));

    const classes = useStyles();

    const getUnReadNotes = useCallback(() => {
        let unmounted = false;
        const fetchNotifications = async () => {
            const _notificationList = await getNotificationList(signInDlgState.token);
            const _unReadNotes = _notificationList.filter((item: TypeNotification) => item.isRead === false);
            if (!unmounted) {
                setNotificationState({
                    ...notificationState,
                    notesUnreadCnt: _unReadNotes.length,
                    notesList: _notificationList,
                });
            }
        };
        if (signInDlgState.token) fetchNotifications().catch(console.error);
        return () => {
            unmounted = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signInDlgState.token]);

    useEffect(() => {
        getUnReadNotes();
        setTimeout(() => {
            setRefetch(!refetch);
        }, 10 * 60 * 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signInDlgState.walletAccounts, refetch]);

    const menuItemsList: Array<TypeMenuItem> = [
        {
            title: 'Home',
            url: '/',
            icon: <Icon icon="ph:house" fontSize={20} style={{ marginRight: mobile ? 0 : 6, marginBottom: 2 }} />,
        },
        {
            title: 'Products',
            url: '/products',
            icon: (
                <Icon icon="ph:image-square" fontSize={20} style={{ marginRight: mobile ? 0 : 6, marginBottom: 2 }} />
            ),
        },
        {
            title: 'Mystery Boxes',
            url: '/blind-box',
            icon: <Icon icon="ph:cube" fontSize={20} style={{ marginRight: mobile ? 0 : 6, marginBottom: 2 }} />,
        },
        {
            title: 'Rewards',
            url: '/rewards',
            icon: <Icon icon="ph:coins" fontSize={20} style={{ marginRight: mobile ? 0 : 6, marginBottom: 2 }} />,
        },
    ];

    const pageButtons = (mobile ? menuItemsList : menuItemsList.slice(1)).map((item, index) => (
        <PageButton
            key={`navbaritem-${index}`}
            data={item}
            isSelected={item.url === location.pathname}
            mobile={mobile}
        />
    ));

    const menuButtons = signInDlgState.isLoggedIn ? (
        <>
            <Box position="relative" ref={notificationsBoxContainerNode}>
                <MenuButton
                    size="small"
                    selected={location.pathname === '/notifications'}
                    sx={{ minWidth: 40 }}
                    onClick={() => {
                        if (mobile) navigate('/notifications');
                        else {
                            getUnReadNotes();
                            setShowNotificationsBox(!showNotificationsBox);
                        }
                    }}
                >
                    <Icon icon="ph:chat-circle" fontSize={20} />
                </MenuButton>
                {notificationState.notesUnreadCnt !== 0 && (
                    <NotificationTypo>{notificationState.notesUnreadCnt}</NotificationTypo>
                )}
                <NotificationsBoxContainer show={showNotificationsBox} className={classes.container}>
                    <NotificationsBox
                        notificationsList={notificationState.notesList}
                        onClose={() => setShowNotificationsBox(false)}
                    />
                </NotificationsBoxContainer>
            </Box>
            <MenuButton
                size="small"
                selected={isProfilePage}
                onClick={() => {
                    document.cookie = 'METEAST_PROFILE=All; Path=/; SameSite=None; Secure';
                    navigate('/profile');
                }}
            >
                <Icon icon="ph:user" fontSize={20} />
            </MenuButton>
            {isProfilePage && !mobile ? (
                <PrimaryButton
                    size="small"
                    sx={{ paddingX: mobile ? 0 : 2, minWidth: 40 }}
                    onClick={() => {
                        setDialogState({ ...dialogState, manageProfileDlgOpened: true });
                    }}
                >
                    <Icon icon="ci:settings-future" fontSize={20} color="white" style={{ marginBottom: 1 }} />
                    {!mobile && (
                        <Typography fontWeight={700} color="white" marginLeft={0.5}>
                            MANAGE PROFILE
                        </Typography>
                    )}
                </PrimaryButton>
            ) : (
                !mobile &&
                !isAdmin && (
                    <>
                        <PrimaryButton
                            size="small"
                            onClick={() => {
                                if (signInDlgState.isLoggedIn)
                                    setDialogState({
                                        ...dialogState,
                                        createNFTDlgOpened: true,
                                        createNFTDlgStep: 0,
                                    });
                                else
                                    setSignInDlgState((prevState: SignInState) => {
                                        const _state = { ...prevState };
                                        _state.signInDlgOpened = true;
                                        return _state;
                                    });
                            }}
                            sx={{ paddingX: mobile ? 0 : 2, minWidth: 40 }}
                        >
                            <Icon icon="ph:sticker" fontSize={20} color="white" style={{ marginBottom: 1 }} />
                            {!mobile && (
                                <Typography fontWeight={700} color="white" marginLeft={0.5}>
                                    CREATE NFT
                                </Typography>
                            )}
                        </PrimaryButton>
                        <PrimaryButton
                            size="small"
                            sx={{ minWidth: 40, background: '#A453D6', '&:hover': { background: '#A463D6' } }}
                            onClick={() => {
                                if (signInDlgState.isLoggedIn)
                                    setDialogState({
                                        ...dialogState,
                                        createBlindBoxDlgOpened: true,
                                        createBlindBoxDlgStep: 0,
                                    });
                                else
                                    setSignInDlgState((prevState: SignInState) => {
                                        const _state = { ...prevState };
                                        _state.signInDlgOpened = true;
                                        return _state;
                                    });
                            }}
                        >
                            <Icon icon="ph:cube" fontSize={20} color="white" style={{ marginBottom: 2 }} />
                        </PrimaryButton>
                    </>
                )
            )}
            {isAdmin && (
                <PrimaryButton
                    size="small"
                    sx={{ paddingX: 2 }}
                    onClick={() => {
                        navigate('/admin/nfts');
                    }}
                >
                    {mobile ? 'admin' : 'admin area'}
                    <Icon
                        icon="ph:arrow-square-out"
                        fontSize={20}
                        color="white"
                        style={{ marginLeft: 4, marginBottom: 4 }}
                    />
                </PrimaryButton>
            )}
        </>
    ) : (
        <PrimaryButton
            size="small"
            sx={{ paddingX: 2 }}
            onClick={() => {
                setSignInDlgState((prevState: SignInState) => {
                    const _state = { ...prevState };
                    _state.signInDlgOpened = true;
                    return _state;
                });
            }}
        >
            <Icon icon="ph:sign-in" fontSize={20} color="white" style={{ marginRight: 4, marginBottom: 2 }} />
            Login
        </PrimaryButton>
    );

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                paddingTop={mobile ? 1.5 : 0}
                paddingBottom={mobile ? 1.5 : 0}
            >
                {!mobile && (
                    <Link to="/">
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <img src="/assets/images/header/logo.svg" alt="" />
                            <Box display={{ xs: 'none', lg: 'block' }}>
                                <img src="/assets/images/header/meteast_label.svg" alt="" />
                            </Box>
                        </Stack>
                    </Link>
                )}
                {mobile ? (
                    pageButtons
                ) : (
                    <Stack direction="row" spacing={3}>
                        {pageButtons}
                    </Stack>
                )}
                {mobile ? (
                    menuButtons
                ) : (
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {menuButtons}
                    </Stack>
                )}
            </Stack>
        </>
    );
};

export default Navbar;
