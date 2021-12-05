import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from 'src/components/pages/HomePage';
import ProfilePage from 'src/components/pages/ProfilePage';
import RequireAuth from './RequireAuth';

const AppRouter: React.FC = (): JSX.Element => {

    return <BrowserRouter>
        <Routes>
            <Route index element={<HomePage />} />
            <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        </Routes>
    </BrowserRouter>
};

export default AppRouter;