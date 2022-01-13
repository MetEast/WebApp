import React, { useState } from 'react';
import { Box, Stack, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { ShowMenuBtn } from './styles';
import { Icon } from '@iconify/react';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const AdminPage: React.FC = (): JSX.Element => {
    const [showMenuBar, setShowMenuBar] = useState(false);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setShowMenuBar(open);
    };

    const list = () => (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            MenuBar
        </Box>
    );

    return (
        <Box position="relative">
            <Stack position="absolute" top={0} left={0} width={40} height="100vh" justifyContent="center">
                <ShowMenuBtn onClick={toggleDrawer(true)}>
                    <Icon icon="ph:caret-right-bold" color="white" />
                </ShowMenuBtn>
            </Stack>
            <Drawer anchor="left" open={showMenuBar} onClose={toggleDrawer(false)}>
                {list()}
            </Drawer>
        </Box>
    );
};

export default AdminPage;
