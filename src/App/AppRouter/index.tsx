import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from 'src/components/Layout';
import HomePage from 'src/pages/HomePage';
import ExplorePage from 'src/pages/ExplorePage';
import SingleNFTFixedPrice from 'src/pages/SingleNFTFixedPrice';
import SingleNFTAuction from 'src/pages/SingleNFTAuction';
import MysteryBoxPage from 'src/pages/MysteryBoxPage';
import BlindBoxProduct from 'src/pages/BlindBoxProduct';
import RewardsPage from 'src/pages/RewardsPage';
import ProfilePage from 'src/pages/ProfilePage';
import MyNFTBuyNow from 'src/pages/MyNFT/BuyNow';
import MyNFTAuction from 'src/pages/MyNFT/Auction';
import MyNFTCreated from 'src/pages/MyNFT/Created';
import MyNFTSold from 'src/pages/MyNFT/Sold';
import AdminNFTs from 'src/pages/Admin/NFTs';
import AdminBannedUsers from 'src/pages/Admin/Users/BannedUsers';
import AdminUserModerators from 'src/pages/Admin/Users/Moderators';
import AdminUserAdmins from 'src/pages/Admin/Users/Admins';
import AdminBlindBoxes from 'src/pages/Admin/BlindBoxes';
import AdminHomePopular from 'src/pages/Admin/HomePopular';
import AdminHomeUpcoming from 'src/pages/Admin/HomeUpcoming';
import AdminOrderNFTs from 'src/pages/Admin/OrderNFTs';
import AdminOrderBlindBoxes from 'src/pages/Admin/OrderBlindBoxes';
import AdminBids from 'src/pages/Admin/Bids';
import AdminBanners from 'src/pages/Admin/Banners';
import AdminNotifications from 'src/pages/Admin/Notifications';
import User from 'src/components/User';
import MyNFTPurchased from 'src/pages/MyNFT/Purchased';
import NotificationsPage from 'src/pages/Notifications';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const AppRouter: React.FC = (): JSX.Element => {
    const theme = useTheme();
    const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));

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
                            <MysteryBoxPage />
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
                    path="/rewards"
                    element={
                        <Layout>
                            <RewardsPage />
                        </Layout>
                    }
                />
                {matchDownSm && (
                    <Route
                        path="/notifications"
                        element={
                            <Layout showFooter={false}>
                                <NotificationsPage />
                            </Layout>
                        }
                    />
                )}
                {/* <Route
                    path="/admin"
                    element={
                        <Layout>
                            <AdminPage />
                        </Layout>
                    }
                /> */}
                <Route
                    path="/admin/nfts"
                    element={
                        <Layout>
                            <AdminNFTs />
                        </Layout>
                    }
                />
                <Route
                    path="/admin/users/admins"
                    element={
                        <Layout>
                            <AdminUserAdmins />
                        </Layout>
                    }
                />
                <Route
                    path="/admin/users/moderators"
                    element={
                        <Layout>
                            <AdminUserModerators />
                        </Layout>
                    }
                />
                <Route
                    path="/admin/users/bannedusers"
                    element={
                        <Layout>
                            <AdminBannedUsers />
                        </Layout>
                    }
                />
                <Route
                    path="/admin/blindboxes"
                    element={
                        <Layout>
                            <AdminBlindBoxes />
                        </Layout>
                    }
                />
                <Route
                    path="/admin/home-popular"
                    element={
                        <Layout>
                            <AdminHomePopular />
                        </Layout>
                    }
                />
                <Route
                    path="/admin/home-upcoming"
                    element={
                        <Layout>
                            <AdminHomeUpcoming />
                        </Layout>
                    }
                />
                <Route
                    path="/admin/orders-nfts"
                    element={
                        <Layout>
                            <AdminOrderNFTs />
                        </Layout>
                    }
                />
                <Route
                    path="/admin/orders-blindboxes"
                    element={
                        <Layout>
                            <AdminOrderBlindBoxes />
                        </Layout>
                    }
                />
                <Route
                    path="/admin/bids"
                    element={
                        <Layout>
                            <AdminBids />
                        </Layout>
                    }
                />
                <Route
                    path="/admin/banners"
                    element={
                        <Layout>
                            <AdminBanners />
                        </Layout>
                    }
                />
                <Route
                    path="/admin/notifications"
                    element={
                        <Layout>
                            <AdminNotifications />
                        </Layout>
                    }
                />
                <Route path="" element={<User />}>
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
                    <Route
                        path="/mynft/purchased/:id"
                        element={
                            <Layout>
                                <MyNFTPurchased />
                            </Layout>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
