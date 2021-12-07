import React from 'react';
import { H4Typography, H6Typography } from 'src/core/typographies';
import { TypeNotification } from 'src/types/notification-types';
import { Unread } from './styledComponents';
import { Box } from '@mui/material';
import { Delete24Filled } from '@fluentui/react-icons';

export interface INotificationItemProps {
    data: TypeNotification;
}

const NotificationItem: React.FC<INotificationItemProps> = ({ data }): JSX.Element => {
    return (
        <Box mt={3.5}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Box display="flex">
                    <H4Typography>{data.title}</H4Typography>
                    {!data.isRead && <Unread>Unread</Unread>}
                </Box>
                <H6Typography>{data.date}</H6Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
                <H6Typography>{data.content}</H6Typography>
                <Box>
                    <Delete24Filled />
                </Box>
            </Box>
        </Box>
    );
};

export default NotificationItem;
