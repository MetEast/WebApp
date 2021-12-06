import { ThemeProvider } from '@mui/system';
import React from 'react';
import { RecoilRoot } from 'recoil';
import theme from 'src/styles/theme';
import AppRouter from './AppRouter';

const App: React.FC = (): JSX.Element => {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <AppRouter />
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;
