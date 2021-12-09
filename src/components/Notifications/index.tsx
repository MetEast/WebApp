import React from 'react';
import { H2Typography, H5Typography } from 'src/core/typographies';
import { Button, Box } from '@mui/material';
import NotificationItem from './components/NotificationItem';
import NoNotifications from './components/NoNotifications';
import { dummyNotificationList } from 'src/constants/dummyData';

export interface INotificationsProps {
    onClose: () => void;
}

const Notifications: React.FC<INotificationsProps> = ({ onClose }): JSX.Element => {
    const notificationList = dummyNotificationList;

    return notificationList.length ? (
        <>
            <Button variant="outlined" sx={{ paddingTop: '0.4rem', paddingBottom: '0.4rem' }} onClick={onClose}>
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
