import React from 'react';
import { Stack, Typography } from '@mui/material';
import CustomTextField from 'src/components/TextField';
import { PrimaryButton } from 'src/components/Buttons/styles';

const AdminNotifications: React.FC = (): JSX.Element => {
    return (
        <Stack alignItems="center" width="100%" paddingY={5}>
            <Stack width="50%" spacing={3}>
                <Typography fontSize={42} fontWeight={700}>
                    Notification Settings
                </Typography>
                <CustomTextField title="Bid information template settings" placeholder="Placeholder Text" />
                <CustomTextField title="Trading information template settings" placeholder="Placeholder Text" />
                <CustomTextField title="Streaming notifications are coming soon" placeholder="Placeholder Text" />
                <CustomTextField title="Notice of payment pending" placeholder="Placeholder Text" />
                <CustomTextField title="A notice of sale at a price" placeholder="Placeholder Text" />
                <PrimaryButton>Confirm</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default AdminNotifications;
