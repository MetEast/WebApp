import React, { useRef } from 'react';
import { Stack, Typography } from '@mui/material';
import { Container } from './styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import NotificationItem from './NotificationItem';
import { TypeNotification } from 'src/types/notification-types';
import useOnClickOutside from 'src/hooks/useOnClickOutside';

interface ComponentProps {
    notificationsList: Array<TypeNotification>;
    onClose: () => void;
}

const NotificationsBox: React.FC<ComponentProps> = ({ notificationsList, onClose }): JSX.Element => {
    const emptyNotifications = notificationsList.length === 0;
    const unReadNotes = notificationsList.filter((item: TypeNotification) => item.isRead === false)
    const node = useRef<HTMLDivElement>();
    useOnClickOutside(node, onClose);

    return (
        <Container
            justifyContent={emptyNotifications ? 'auto' : 'space-between'}
            alignItems={emptyNotifications ? 'center' : 'auto'}
            spacing={6}
            sx={{ overflowY: 'auto', overflowX: 'hidden' }}
            ref={node}
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
                            <PrimaryButton size="small" sx={{ width: 108, height: 32, fontSize: 12 }}>
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
