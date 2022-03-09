import React, { useState } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { Container } from './styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';

interface ComponentProps {}

const NotificationsBox: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Container sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
            <Typography fontSize={42} fontWeight={700} color="black" sx={{ textTransform: 'none' }}>
                Notifications
            </Typography>
        </Container>
    );
};

export default NotificationsBox;
