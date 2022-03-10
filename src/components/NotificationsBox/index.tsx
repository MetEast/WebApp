import React from 'react';
import { Stack, Typography } from '@mui/material';
import { Container } from './styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import NotificationItem from './NotificationItem';
import { TypeNotification } from 'src/types/notification-types';

interface ComponentProps {
    notificationsList: Array<TypeNotification>;
    onClose: () => void;
}

const NotificationsBox: React.FC<ComponentProps> = ({ notificationsList, onClose }): JSX.Element => {
    const emptyNotifications = notificationsList.length === 0;

    return (
        <Container
            justifyContent={emptyNotifications ? 'center' : 'space-between'}
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
                        sx={{ textTransform: 'capitalize' }}
                    >
                        you Currently have No notifications
                    </Typography>
                    <img src="/assets/images/notifications/no-notifications.svg" width="80%" alt="" />
                    <PrimaryButton fullWidth onClick={onClose}>
                        Back
                    </PrimaryButton>
                </>
            ) : (
                <>
                    <Stack alignItems="flex-start" spacing={1.5}>
                        <Typography fontSize={42} fontWeight={700}>
                            Notifications
                        </Typography>
                        <Typography
                            fontSize={16}
                            fontWeight={500}
                            color="#1EA557"
                            paddingX={1.5}
                            paddingY={0.5}
                            borderRadius={3}
                            sx={{ background: '#C9F5DC' }}
                        >
                            28 Unread
                        </Typography>
                    </Stack>
                    <Stack spacing={3} height="100%">
                        {notificationsList.map((item, index) => (
                            <NotificationItem key={index} data={item} />
                        ))}
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <SecondaryButton fullWidth onClick={onClose}>
                            Close
                        </SecondaryButton>
                        <PrimaryButton fullWidth>Mark as read</PrimaryButton>
                    </Stack>
                </>
            )}
        </Container>
    );
};

export default NotificationsBox;
