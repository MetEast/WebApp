import React from 'react';
import { Stack, Box, Menu, MenuItem, Link } from '@mui/material';
import { Icon } from '@iconify/react';
import { SecondaryButton, PinkButton } from 'src/components/Buttons/styles';
import { IconBtn } from './styles';
import { useNavigate } from 'react-router-dom';
import { FacebookIcon, TwitterIcon } from 'react-share';
// import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share';
// import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
// import FullscreenIcon from '@mui/icons-material/Fullscreen';

const ProductPageHeader: React.FC = (): JSX.Element => {
    const navigate = useNavigate();
    const [showReportBtn, setShowReportBtn] = React.useState<boolean>(false);

    const [isOpenSharePopup, setOpenSharePopup] = React.useState(null);
    const openSharePopupMenu = (event: any) => {
        setOpenSharePopup(event.currentTarget);
    };
    const handleCloseSharePopup = () => {
        setOpenSharePopup(null);
    };

    return (
        <Stack direction="row" justifyContent="space-between">
            <SecondaryButton
                size="small"
                sx={{ paddingX: 2.5 }}
                onClick={() => {
                    navigate(-1);
                }}
            >
                <Icon
                    icon="ph:caret-left-bold"
                    fontSize={20}
                    color="#1890FF"
                    style={{ marginLeft: -4, marginRight: 8 }}
                />
                Back
            </SecondaryButton>
            <Stack direction="row" spacing={1}>
                <SecondaryButton size="small" sx={{ paddingX: 2.5 }} onClick={openSharePopupMenu}>
                    <Icon
                        icon="ph:share-network-bold"
                        fontSize={20}
                        color="#1890FF"
                        style={{ marginLeft: -4, marginRight: 8 }}
                    />
                    Share
                </SecondaryButton>
                <Menu
                    keepMounted
                    id="simple-menu"
                    anchorEl={isOpenSharePopup}
                    onClose={handleCloseSharePopup}
                    open={Boolean(isOpenSharePopup)}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleCloseSharePopup}>
                        {/* <FacebookShareButton
                            url={window.location.href}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <FacebookIcon size={32} round />
                            &nbsp;&nbsp;Share on Facebook
                        </FacebookShareButton> */}
                        <Link
                            href={`https://s.meteast.io/aWz73?u=${window.location.href}&`}
                            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}
                        >
                            <FacebookIcon size={32} round />
                            &nbsp;&nbsp;Share on Facebook
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseSharePopup}>
                        {/* <TwitterShareButton
                            url={window.location.href}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <TwitterIcon size={32} round />
                            &nbsp;&nbsp;Share on Twitter
                        </TwitterShareButton> */}
                        <Link
                            href={`https://s.meteast.io/VqYqq?url=${window.location.href}&`}
                            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}
                        >
                            <TwitterIcon size={32} round />
                            &nbsp;&nbsp;Share on Twitter
                        </Link>
                    </MenuItem>
                </Menu>
                <Box
                    position="relative"
                    onMouseEnter={() => setShowReportBtn(true)}
                    onMouseLeave={() => setShowReportBtn(false)}
                    onClick={() => setShowReportBtn(!showReportBtn)}
                >
                    <IconBtn>
                        <Icon icon="ph:dots-three-vertical-bold" color="#1890FF" />
                    </IconBtn>
                    <Box
                        display={showReportBtn ? 'block' : 'none'}
                        sx={{ position: 'absolute', right: 0, top: '100%' }}
                    >
                        <PinkButton size="small" sx={{ paddingX: 2.5, marginTop: 0.5 }}>
                            <Icon
                                icon="ph:megaphone"
                                fontSize={20}
                                color="#eb5757"
                                style={{ marginLeft: -4, marginRight: 8, marginBottom: 2 }}
                            />
                            Report
                        </PinkButton>
                    </Box>
                </Box>
            </Stack>
        </Stack>
    );
};

export default ProductPageHeader;
