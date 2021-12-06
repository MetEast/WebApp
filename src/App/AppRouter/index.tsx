import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from 'src/components/Layout';
import HomePage from 'src/components/pages/HomePage';
import ProfilePage from 'src/components/pages/ProfilePage';

const AppRouter: React.FC = (): JSX.Element => {
    return (
        <Layout>
            <BrowserRouter>
                <Routes>
                    <Route index element={<HomePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </BrowserRouter>
        </Layout>
    );
};

export default AppRouter;
