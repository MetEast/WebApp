import { ThemeProvider } from '@mui/system';
import React from 'react';
import theme from 'src/styles/theme';
import AppRouter from './AppRouter';
import SwiperCore, { Autoplay } from 'swiper';
import { AppContextProvider } from 'src/context/AppContext';
import { DialogContextProvider } from 'src/context/DialogContext';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { SnackbarProvider } from 'notistack';
import { CookiesProvider } from 'react-cookie';
import { SignInContextProvider } from 'src/context/SignInContext';
import { NotificationContextProvider } from 'src/context/NotificationContext';
import { isProductEnv } from 'src/config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLibrary = (provider: any): Web3Provider => {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
};

const App: React.FC = (): JSX.Element => {
    SwiperCore.use([Autoplay]);
    if (isProductEnv()) {
        if (document.addEventListener) {
            document.addEventListener('contextmenu', (event) => {
                event.preventDefault();
            });
        } else {
            // document.attachEvent('oncontextmenu', (event) => {
            //     window.event.returnValue = false;
            // });
        }
        document.addEventListener('keydown', (event) => {
            // Prevent F12 -
            if (event.keyCode === 123) {
                event.preventDefault();
                return;
            }
            // Prevent Ctrl+u = disable view page source
            // Prevent Ctrl+s = disable save
            // Prevent Ctrl+a = disable select all
            // Prevent Ctrl+d = disable bookmark
            if (
                event.ctrlKey &&
                (event.keyCode === 85 || event.keyCode === 83 || event.keyCode === 65 || event.keyCode === 68)
            ) {
                event.preventDefault();
                return;
            }
            // Prevent Ctrl+Shift+I = disabled debugger console using keys open
            if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
                event.preventDefault();
                return false;
            }
        });
    }
    return (
        <ThemeProvider theme={theme}>
            <AppContextProvider>
                <Web3ReactProvider getLibrary={getLibrary}>
                    <SignInContextProvider>
                        <DialogContextProvider>
                            <NotificationContextProvider>
                                <SnackbarProvider maxSnack={1}>
                                    <CookiesProvider>
                                        <AppRouter />
                                    </CookiesProvider>
                                </SnackbarProvider>
                            </NotificationContextProvider>
                        </DialogContextProvider>
                    </SignInContextProvider>
                </Web3ReactProvider>
            </AppContextProvider>
        </ThemeProvider>
    );
};

export default App;
