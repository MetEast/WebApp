import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from 'src/components/Layout';
import LoginPage from 'src/pages/LoginPage';
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
import AdminPage from 'src/pages/Admin';
import AdminNFTs from 'src/pages/Admin/NFTs';
import AdminBlindBoxes from 'src/pages/Admin/BlindBoxes';
import AdminHomePopular from 'src/pages/Admin/HomePopular';
import AdminHomeUpcoming from 'src/pages/Admin/HomeUpcoming';
import AdminOrderNFTs from 'src/pages/Admin/OrderNFTs';
import AdminOrderBlindBoxes from 'src/pages/Admin/OrderBlindBoxes';
import AdminBids from 'src/pages/Admin/Bids';
import AdminBanners from 'src/pages/Admin/Banners';
import AdminNotifications from 'src/pages/Admin/Notifications';
import RequireAuth from './RequireAuth';
import User from 'src/components/user';

const AppRouter: React.FC = (): JSX.Element => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <Layout>
                            <LoginPage />
                        </Layout>
                    }
                />
                <Route
                    index
                    element={
                        <Layout>
                            <HomePage />
                        </Layout>
                    }
                />
                <Route
                    path="/products"
                    element={
                        <Layout>
                            <ExplorePage />
                        </Layout>
                    }
                />
                <Route
                    path="/products/fixed-price/:id"
                    element={
                        <Layout>
                            <SingleNFTFixedPrice />
                        </Layout>
                    }
                />
                <Route
                    path="/products/auction/:id"
                    element={
                        <Layout>
                            <SingleNFTAuction />
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
                    path="/blind-box/product/:id"
                    element={
                        <Layout>
                            <BlindBoxProduct />
                        </Layout>
                    }
                />
                <Route path="/admin" element={<AdminPage />} />
                <Route
                    path="/admin/nfts"
                    element={
                        <AdminPage>
                            <AdminNFTs />
                        </AdminPage>
                    }
                />
                <Route
                    path="/admin/blindboxes"
                    element={
                        <AdminPage>
                            <AdminBlindBoxes />
                        </AdminPage>
                    }
                />
                <Route
                    path="/admin/home-popular"
                    element={
                        <AdminPage>
                            <AdminHomePopular />
                        </AdminPage>
                    }
                />
                <Route
                    path="/admin/home-upcoming"
                    element={
                        <AdminPage>
                            <AdminHomeUpcoming />
                        </AdminPage>
                    }
                />
                <Route
                    path="/admin/orders-nfts"
                    element={
                        <AdminPage>
                            <AdminOrderNFTs />
                        </AdminPage>
                    }
                />
                <Route
                    path="/admin/orders-blindboxes"
                    element={
                        <AdminPage>
                            <AdminOrderBlindBoxes />
                        </AdminPage>
                    }
                />
                <Route
                    path="/admin/bids"
                    element={
                        <AdminPage>
                            <AdminBids />
                        </AdminPage>
                    }
                />
                <Route
                    path="/admin/banners"
                    element={
                        <AdminPage>
                            <AdminBanners />
                        </AdminPage>
                    }
                />
                <Route
                    path="/admin/notifications"
                    element={
                        <AdminPage>
                            <AdminNotifications />
                        </AdminPage>
                    }
                />
                <Route
                    path=""
                    element={
                        <RequireAuth>
                            <User />
                        </RequireAuth>
                    }
                >
                    <Route
                        path="/profile"
                        element={
                            <Layout>
                                <ProfilePage />
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
                    <Route
                        path="/mynft/sold/:id"
                        element={
                            <Layout>
                                <MyNFTSold />
                            </Layout>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
