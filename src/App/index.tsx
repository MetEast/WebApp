import { ThemeProvider } from '@mui/system';
import React from 'react';
import { RecoilRoot } from 'recoil';
import theme from 'src/styles/theme';
import AppRouter from './AppRouter';
import SwiperCore, { Autoplay } from 'swiper';

const App: React.FC = (): JSX.Element => {
    SwiperCore.use([Autoplay]);

    return (
        <RecoilRoot>
            <ThemeProvider theme={theme}>
                <AppRouter />
            </ThemeProvider>
        </RecoilRoot>
    );
};

export default App;
