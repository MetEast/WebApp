import React from 'react';
import { RecoilRoot } from 'recoil';
import AppRouter from './AppRouter';

const App: React.FC = (): JSX.Element => {
  return (
    <RecoilRoot>
      <AppRouter />
    </RecoilRoot>
  );
}

export default App;
