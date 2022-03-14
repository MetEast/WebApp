import React from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Box, Menu, MenuItem, Tooltip } from '@mui/material';
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { IconBtn } from './styles';
import { useNavigate } from 'react-router-dom';
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share';
// import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
// import FullscreenIcon from '@mui/icons-material/Fullscreen';

const ReportBtnTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        fontSize: 14,
        borderRadius: 8,
    },
}));

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
                        <FacebookShareButton
                            url={window.location.href}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <FacebookIcon size={32} round />
                            &nbsp;&nbsp;Share on Facebook
                        </FacebookShareButton>
                        {/* <Link
                            href={`https://s.meteast.io/eluGI?u=${window.location.href}`}
                            target="_blank"
                            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}
                        >
                            <FacebookIcon size={32} round />
                            &nbsp;&nbsp;Share on Facebook
                        </Link> */}
                    </MenuItem>
                    <MenuItem onClick={handleCloseSharePopup}>
                        <TwitterShareButton
                            url={window.location.href}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <TwitterIcon size={32} round />
                            &nbsp;&nbsp;Share on Twitter
                        </TwitterShareButton>
                        {/* <Link
                            href={`https://s.meteast.io/gguQ3?url=${window.location.href}`}
                            target="_blank"
                            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}
                        >
                            <TwitterIcon size={32} round />
                            &nbsp;&nbsp;Share on Twitter
                        </Link> */}
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
                        <ReportBtnTooltip title="Coming Soon">
                            <PrimaryButton btn_type="pink" size="small" sx={{ paddingX: 2.5, marginTop: 0.5 }}>
                                <Icon
                                    icon="ph:megaphone"
                                    fontSize={20}
                                    color="#eb5757"
                                    style={{ marginLeft: -4, marginRight: 8, marginBottom: 2 }}
                                />
                                Report
                            </PrimaryButton>
                        </ReportBtnTooltip>
                    </Box>
                </Box>
            </Stack>
        </Stack>
    );
};

export default ProductPageHeader;
