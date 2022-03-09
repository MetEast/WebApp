import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { Container } from './styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import NotificationItem from './NotificationItem';
import { dummyNotificationList } from 'src/constants/dummyData';

interface ComponentProps {}

const NotificationsBox: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Container spacing={6} sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
            <Stack alignItems="flex-start" spacing={1.5}>
                <Typography fontSize={42} fontWeight={700} color="black">
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
            <Stack spacing={3}>
                {dummyNotificationList.map((item, index) => (
                    <NotificationItem data={item} />
                ))}
            </Stack>
            <Stack direction="row" spacing={2}>
                <SecondaryButton fullWidth>Close</SecondaryButton>
                <PrimaryButton fullWidth>Mark as read</PrimaryButton>
            </Stack>
        </Container>
    );
};

export default NotificationsBox;
