import React from 'react';
import { Stack, Typography } from '@mui/material';
import { Container } from './styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import NotificationItem from './NotificationItem';
import { TypeNotification } from 'src/types/notification-types';
import { useSignInContext } from 'src/context/SignInContext';
import { markNotificationsAsRead } from 'src/services/fetch';
import { useNotificationContext } from 'src/context/NotificationContext';

interface ComponentProps {
    notificationsList: Array<TypeNotification>;
    onClose: () => void;
}

const NotificationsBox: React.FC<ComponentProps> = ({ notificationsList, onClose }): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [notificationState, setNotificationState] = useNotificationContext();
    const emptyNotifications = notificationsList.length === 0;
    const unReadNotes = notificationsList.filter((item: TypeNotification) => item.isRead === false);

    const handleMarkAsRead = async () => {
        let unmounted = false;
        const markAsRead = async () => {
            const arrNoteIds: string[] = [];
            notificationsList.forEach((item: TypeNotification) => {
                arrNoteIds.push(item._id);
            });
            const result = await markNotificationsAsRead(signInDlgState.token, arrNoteIds.join(','));
            if (!unmounted && result) {
                setNotificationState({
                    ...notificationState,
                    notesUnreadCnt: 0,
                });
                onClose();
            }
        };
        if (signInDlgState.walletAccounts.length) markAsRead().catch(console.error);
        return () => {
            unmounted = true;
        };
    };

    return (
        <Container
            justifyContent={emptyNotifications ? 'auto' : 'space-between'}
            alignItems={emptyNotifications ? 'center' : 'auto'}
            spacing={6}
            sx={{ overflowY: 'auto', overflowX: 'hidden' }}
        >
            {emptyNotifications ? (
                <>
                    <Typography
                        fontSize={42}
                        fontWeight={700}
                        lineHeight={1}
                        textAlign="center"
                        sx={{ textTransform: 'capitalize', wordBreak: 'normal' }}
                    >
                        you Currently have No notifications
                    </Typography>
                    <img src="/assets/images/notifications/no-notifications.svg" width="80%" alt="" />
                </>
            ) : (
                <>
                    <Stack alignItems="flex-start" spacing={1.5}>
                        <Typography fontSize={42} fontWeight={700}>
                            Notifications
                        </Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                            <Typography
                                fontSize={16}
                                fontWeight={500}
                                color="#1EA557"
                                paddingX={1.5}
                                paddingY={0.5}
                                borderRadius={3}
                                sx={{ background: '#C9F5DC' }}
                            >
                                {unReadNotes.length} Unread
                            </Typography>
                            <PrimaryButton
                                size="small"
                                sx={{ width: 108, height: 32, fontSize: 12 }}
                                onClick={handleMarkAsRead}
                            >
                                Mark as read
                            </PrimaryButton>
                        </Stack>
                    </Stack>
                    <Stack spacing={3} height="100%">
                        {notificationsList.map((item, index) => (
                            <NotificationItem key={index} data={item} />
                        ))}
                    </Stack>
                </>
            )}
        </Container>
    );
};

export default NotificationsBox;
