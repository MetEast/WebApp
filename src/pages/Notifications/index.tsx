import React from 'react';
import { Stack } from '@mui/material';
import NotificationsBox from 'src/components/NotificationsBox';
import { dummyNotificationList } from 'src/constants/dummyData';

const NotificationsPage: React.FC = (): JSX.Element => {
    return (
        <Stack direction="column">
            <NotificationsBox notificationsList={dummyNotificationList} onClose={() => {}} />
        </Stack>
    );
};

export default NotificationsPage;
