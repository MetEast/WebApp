import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { ShowMenuBtn, MenuBox } from './styles';
import { Icon } from '@iconify/react';
import MenuBar from 'src/components/Admin/MenuBar';

const AdminPage: React.FC = (): JSX.Element => {
    const [showMenuBar, setShowMenuBar] = useState(false);

    return (
        <Box position="relative">
            {/* <Stack position="absolute" top={0} left={0} height="100vh" justifyContent="center">
                <ShowMenuBtn>
                    <Icon icon="ph:caret-right-bold" color="white" />
                </ShowMenuBtn>
            </Stack> */}
            <Stack position="absolute" top={0} left={0} boxSizing="border-box" width={280} height="100vh" padding={3}>
                <MenuBox>
                    <MenuBar />
                </MenuBox>
            </Stack>
        </Box>
    );
};

export default AdminPage;
