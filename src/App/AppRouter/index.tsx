import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BuyNow from 'src/components/BuyNow';
import TransactionPending from 'src/components/TransactionPending';
import BuyNowSummary from 'src/components/BuyNowSummary';
import Layout from 'src/components/Layout';
import BlindBoxPage from 'src/components/pages/BlindBoxPage';
import ExplorePage from 'src/components/pages/ExplorePage';
import HomePage from 'src/components/pages/HomePage';
import ProfilePage from 'src/components/pages/ProfilePage';
import TransactionSuccess from 'src/components/TransactionSuccess';
import BlindBoxBuyNow from 'src/components/BlindBoxBuyNow';
import ChooseAmount from 'src/components/ChooseAmount';
import BlindBuyNowSummary from 'src/components/BlindBuyNowSummary';
import EditProfile from 'src/components/profile/EditProfile';
import CreateNft from 'src/components/nft/CreateNft';
import ConfirmCreateNft from 'src/components/nft/CreateNft/ConfirmCreateNft';
import CreateNftSuccess from 'src/components/nft/CreateNft/CreateNftSuccess';
import CreateNftError from 'src/components/nft/CreateNft/CreateNftError';

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
                    path="/profile/edit"
                    element={
                        <Layout>
                            <EditProfile />
                        </Layout>
                    }
                />
                <Route
                    path="/buy-now/:id/summary"
                    element={
                        <Layout>
                            <BuyNowSummary />
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
                <Route
                    path="/transaction-pending"
                    element={
                        <Layout>
                            <TransactionPending />
                        </Layout>
                    }
                />
                <Route
                    path="/transaction-success"
                    element={
                        <Layout>
                            <TransactionSuccess />
                        </Layout>
                    }
                />
                <Route
                    path="/blind-buy-now/:id"
                    element={
                        <Layout>
                            <BlindBoxBuyNow />
                        </Layout>
                    }
                />
                <Route
                    path="/choose-amount/:id"
                    element={
                        <Layout>
                            <ChooseAmount />
                        </Layout>
                    }
                />
                <Route
                    path="/blind-buy-now/:id/summary"
                    element={
                        <Layout>
                            <BlindBuyNowSummary />
                        </Layout>
                    }
                />
                <Route
                    path="/nft/create"
                    element={
                        <Layout>
                            <CreateNft />
                        </Layout>
                    }
                />
                <Route
                    path="/nft/create/confirm"
                    element={
                        <Layout>
                            <ConfirmCreateNft />
                        </Layout>
                    }
                />
                <Route
                    path="/nft/create/success"
                    element={
                        <Layout>
                            <CreateNftSuccess />
                        </Layout>
                    }
                />
                <Route
                    path="/nft/create/error"
                    element={
                        <Layout>
                            <CreateNftError />
                        </Layout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
