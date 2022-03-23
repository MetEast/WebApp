import React, { useEffect } from 'react';
import { Stack } from '@mui/material';
import NotificationsBox from 'src/components/NotificationsBox';
import { useSignInContext } from 'src/context/SignInContext';
import { getNotificationList } from 'src/services/fetch';
import { useNotificationContext } from 'src/context/NotificationContext';
import { dummyNotificationList } from 'src/constants/dummyData';

const NotificationsPage: React.FC = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [notificationState, setNotificationState] = useNotificationContext();

    useEffect(() => {
        let unmounted = false;
        const fetchNotifications = async () => {
            const _notificationList = await getNotificationList(signInDlgState.walletAccounts[0]);
            if (!unmounted) {
                setNotificationState({ ...notificationState, notesList: _notificationList });
            }
        };
        if (signInDlgState.walletAccounts.length) fetchNotifications().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.walletAccounts]);

    return (
        <Stack direction="column">
            <NotificationsBox
                notificationsList={notificationState.notesList}
                // notificationsList={dummyNotificationList} // test data
                onClose={() => {}}
            />
        </Stack>
    );
};

export default NotificationsPage;
