import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BuyNow from 'src/components/BuyNow';
import Layout from 'src/components/Layout';
import BlindBoxPage from 'src/components/pages/BlindBoxPage';
import ExplorePage from 'src/components/pages/ExplorePage';
import HomePage from 'src/components/pages/HomePage';
import ProfilePage from 'src/components/pages/ProfilePage';

const AppRouter: React.FC = (): JSX.Element => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    index
                    element={
                        <Layout>
                            <HomePage />
                        </Layout>
                    }
                />
                <Route
                    path="/explore"
                    element={
                        <Layout>
                            <ExplorePage />
                        </Layout>
                    }
                />
                <Route
                    path="/blind-box"
                    element={
                        <Layout>
                            <BlindBoxPage />
                        </Layout>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <Layout>
                            <ProfilePage />
                        </Layout>
                    }
                />
                <Route
                    path="/buy-now/:id"
                    element={
                        <Layout>
                            <BuyNow />
                        </Layout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
