import React, { useEffect } from 'react';
import { Stack } from '@mui/material';
import NotificationsBox from 'src/components/NotificationsBox';
import { useSignInContext } from 'src/context/SignInContext';
import { getNotificationList } from 'src/services/fetch';

const NotificationsPage: React.FC = (): JSX.Element => {
    const [signInDlgState, setSignInDlgState] = useSignInContext();

    useEffect(() => {
        let unmounted = false;
        const fetchNotifications = async () => {
            const _notificationList = await getNotificationList(signInDlgState.walletAccounts[0]);
            if (!unmounted) {
                setSignInDlgState({ ...signInDlgState, notesList: _notificationList });
            }
        };
        if (signInDlgState.walletAccounts.length) fetchNotifications().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.walletAccounts]);

    return (
        <Stack direction="column">
            <NotificationsBox notificationsList={signInDlgState.notesList} onClose={() => {}} />
        </Stack>
    );
};

export default NotificationsPage;
