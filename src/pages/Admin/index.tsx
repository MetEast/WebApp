import { FC, PropsWithChildren, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { MenuBox, ContentBox } from './styles';
import MenuBar from 'src/components/Admin/MenuBar';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { UserTokenType } from 'src/types/auth-types';
import jwtDecode from 'jwt-decode';
import { blankUserToken } from 'src/constants/init-constants';

export interface ComponentProps {}

const AdminPage: FC<PropsWithChildren<ComponentProps>> = ({ children }): JSX.Element => {
    const navigate = useNavigate();
    const [cookies] = useCookies(['METEAST_LINK', 'METEAST_TOKEN']);
    useEffect(() => {
        const user: UserTokenType = cookies.METEAST_TOKEN ? jwtDecode(cookies.METEAST_TOKEN) : blankUserToken;
        if (user.role === '' || parseInt(user.role) >= 2 || isNaN(parseInt(user.role)))  navigate('/');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cookies]);
    
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
