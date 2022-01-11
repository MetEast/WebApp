import { ThemeProvider } from '@mui/system';
import React from 'react';
import { RecoilRoot } from 'recoil';
import theme from 'src/styles/theme';
import AppRouter from './AppRouter';
import SwiperCore, { Autoplay } from 'swiper';

const App: React.FC = (): JSX.Element => {
    SwiperCore.use([Autoplay]);
    // if (document.addEventListener) {
    //     document.addEventListener('contextmenu', (event) => {
    //       event.preventDefault();
    //     });
    // } else {
    //     // document.attachEvent('oncontextmenu', (event) => {
    //     //     window.event.returnValue = false;
    //     // });
    // }
    // document.addEventListener('keydown', (event) => {
    //     // Prevent F12 -
    //     if (event.keyCode === 123) {
    //         event.preventDefault();
    //         return;  
    //     }
    //     // Prevent Ctrl+u = disable view page source
    //     // Prevent Ctrl+s = disable save
    //     // Prevent Ctrl+a = disable select all
    //     // Prevent Ctrl+d = disable bookmark
    //     if (event.ctrlKey && (event.keyCode === 85 || event.keyCode === 83 || event.keyCode ===65 || event.keyCode ===68 )){
    //         event.preventDefault();
    //         return;
    //     }
    //     // Prevent Ctrl+Shift+I = disabled debugger console using keys open
    //     if (event.ctrlKey && event.shiftKey && event.keyCode === 73){
    //         event.preventDefault();
    //         return false;
    //     }
    // });
    return (
        <RecoilRoot>
            <ThemeProvider theme={theme}>
                <AppRouter />
            </ThemeProvider>
        </RecoilRoot>
    );
};

export default App;
