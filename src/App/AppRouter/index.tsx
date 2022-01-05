import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BuyNow from 'src/components/BuyNow';
import TransactionPending from 'src/components/TransactionPending';
import BuyNowSummary from 'src/components/BuyNowSummary';
import Layout from 'src/components/Layout';
import HomePage from 'src/pages/HomePage';
import ExplorePage from 'src/pages/ExplorePage';
import SingleNFTFixedPrice from 'src/pages/SingleNFTFixedPrice';
import SingleNFTAuction from 'src/pages/SingleNFTAuction';
import BlindBoxPage from 'src/pages/BlindBoxPage';
import BlindBoxProduct from 'src/pages/BlindBoxProduct';
import ProfilePage from 'src/pages/ProfilePage';
import MyNFTBuyNow from 'src/pages/MyNFT/BuyNow';
import MyNFTAuction from 'src/pages/MyNFT/Auction';
import MyNFTCreated from 'src/pages/MyNFT/Created';
import MyNFTSold from 'src/pages/MyNFT/Sold';
import TransactionSuccess from 'src/components/TransactionSuccess';
import BlindBoxBuyNow from 'src/components/BlindBoxBuyNow';
import ChooseAmount from 'src/components/ChooseAmount';
import BlindBuyNowSummary from 'src/components/BlindBuyNowSummary';
import EditProfile from 'src/components/profile/EditProfile';

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
                    path="/explore/single-nft/fixed-price/:id"
                    element={
                        <Layout>
                            <SingleNFTFixedPrice />
                        </Layout>
                    }
                />
                <Route
                    path="/explore/single-nft/auction/:id"
                    element={
                        <Layout>
                            <SingleNFTAuction />
                        </Layout>
                    }
                />
                <Route
                    path="/blind-box/product/:id"
                    element={
                        <Layout>
                            <BlindBoxProduct />
                        </Layout>
                    }
                />
                <Route
                    path="/mynft/buynow/:id"
                    element={
                        <Layout>
                            <MyNFTBuyNow />
                        </Layout>
                    }
                />
                <Route
                    path="/mynft/auction/:id"
                    element={
                        <Layout>
                            <MyNFTAuction />
                        </Layout>
                    }
                />
                <Route
                    path="/mynft/created/:id"
                    element={
                        <Layout>
                            <MyNFTCreated />
                        </Layout>
                    }
                />
                {/* <Route
                    path="/mynft/sold/:id"
                    element={
                        <Layout>
                            <MyNFTSold />
                        </Layout>
                    }
                /> */}

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
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
