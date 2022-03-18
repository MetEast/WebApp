import { FC, PropsWithChildren, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { MenuBox, ContentBox } from './styles';
import MenuBar from 'src/components/Admin/MenuBar';
import { useSignInContext } from 'src/context/SignInContext';
import { useNavigate } from 'react-router-dom';

export interface ComponentProps {}

const AdminPage: FC<PropsWithChildren<ComponentProps>> = ({ children }): JSX.Element => {
    const navigate = useNavigate();
    const [signInDlgState] = useSignInContext();
    useEffect(() => {
        if (signInDlgState.userRole >= 2)  navigate('/');
    }, [signInDlgState.userRole]);
    
    return (
        <>
            <Box position="relative">
                {/* <Stack position="absolute" top={0} left={0} height="100vh" justifyContent="center">
                    <ShowMenuBtn>
                        <Icon icon="ph:caret-right-bold" color="white" />
                    </ShowMenuBtn>
                </Stack> */}
                <Stack
                    position="absolute"
                    top={0}
                    left={0}
                    boxSizing="border-box"
                    width={280}
                    height="100vh"
                    padding={3}
                >
                    <MenuBox>
                        <MenuBar />
                    </MenuBox>
                </Stack>
                <ContentBox marginLeft={35}>{children}</ContentBox>
            </Box>
        </>
    );
};

export default AdminPage;
