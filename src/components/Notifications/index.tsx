import React from 'react';
import { H2Typography, H5Typography } from 'src/core/typographies';
import { Button, Box } from '@mui/material';
import { TypeNotification } from 'src/types/notification-types';
import NotificationItem from './components/NotificationItem';
import NoNotifications from './components/NoNotifications';

const dummyNotificationList: Array<TypeNotification> = [
    {
        title: 'You have a new bid!',
        content:
            'Your CryptoGirl#19 project has just been bid by a VKWR909981 user for E 100.00Your CryptoGirl#19 project has just been bid by a VKWR909981 user for E 100.00Your CryptoGirl#19 project has just been bid by a VKWR909981 user for E 100.00',
        date: '2021-09-03',
    },
    {
        title: 'You have a new bid!',
        content: 'Your CryptoGirl#19 project has just been bid by a VKWR909981 user for E 100.00',
        date: '2021-09-03',
    },
    {
        title: 'You have a new bid!',
        content: 'Your CryptoGirl#19 project has just been bid by a VKWR909981 user for E 100.00',
        date: '2021-09-03',
        isRead: true,
    },
    {
        title: 'You have a new bid!',
        content: 'Your CryptoGirl#19 project has just been bid by a VKWR909981 user for E 100.00',
        date: '2021-09-03',
        isRead: true,
    },
];

const Notifications: React.FC = (): JSX.Element => {
    const notificationList = dummyNotificationList;

    return notificationList.length ? (
        <>
            <Button variant="outlined" sx={{ paddingTop: '0.4rem', paddingBottom: '0.4rem' }}>
                Back
            </Button>
            <H2Typography mt={2}>Notifications</H2Typography>
            <H5Typography mt={0.5} mb={1}>
                You have 2 new notifications
            </H5Typography>
            <Button variant="contained" sx={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                Mark as read
            </Button>

            <Box>
                {dummyNotificationList.map((item, index) => (
                    <NotificationItem key={`notification-item-${index}`} data={item} />
                ))}
            </Box>
        </>
    ) : (
        <NoNotifications />
    );
};

export default Notifications;
