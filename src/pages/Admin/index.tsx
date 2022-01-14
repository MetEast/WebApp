import React, { FC, PropsWithChildren, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { ShowMenuBtn, MenuBox, ContentBox } from './styles';
import { Icon } from '@iconify/react';
import MenuBar from 'src/components/Admin/MenuBar';

export interface ComponentProps {}

const AdminPage: FC<PropsWithChildren<ComponentProps>> = ({ children }): JSX.Element => {
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
            <ContentBox marginLeft={35}>{children}</ContentBox>
        </Box>
    );
};

export default AdminPage;