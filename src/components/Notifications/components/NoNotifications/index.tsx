import React from 'react';
import { H2Typography } from 'src/core/typographies';
import { Box, Button } from '@mui/material';

const NoNotifications: React.FC = (): JSX.Element => {
    return (
        <Box pl={1.5} pr={1.5} sx={{ paddingTop: '80px' }} textAlign="center">
            <H2Typography>You Currently Have No Notifications</H2Typography>
            <Box mt={4}>
                <img src="/assets/images/no-notifications.svg" alt="" />
            </Box>
            <Box mt={6}>
                <Button variant="contained" fullWidth>
                    Close
                </Button>
            </Box>
        </Box>
    );
};

export default NoNotifications;
