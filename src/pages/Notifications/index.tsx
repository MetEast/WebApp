import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import NotificationsBox from 'src/components/NotificationsBox';
import { useSignInContext } from 'src/context/SignInContext';
import { getNotificationList } from 'src/services/fetch';
import { useNotificationContext } from 'src/context/NotificationContext';

const NotificationsPage: React.FC = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [notificationState, setNotificationState] = useNotificationContext();
    const [refetch, setRefetch] = useState<boolean>(false);

    useEffect(() => {
        let unmounted = false;
        const fetchNotifications = async () => {
            const _notificationList = await getNotificationList(signInDlgState.walletAccounts[0]);
            if (!unmounted) {
                setNotificationState({ ...notificationState, notesList: _notificationList });
            }
        };
        if (signInDlgState.walletAccounts.length) fetchNotifications().catch(console.error);
        setTimeout(() => {
            setRefetch(!refetch);
        }, 10 * 60 * 1000);

        return () => {
            unmounted = true;
        };
    }, [signInDlgState.walletAccounts, refetch]);

    return (
        <Stack direction="column">
            <NotificationsBox notificationsList={notificationState.notesList} onClose={() => {}} />
        </Stack>
    );
};

export default NotificationsPage;
