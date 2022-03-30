import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Box, Menu, MenuItem, Tooltip, Link } from '@mui/material';
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { IconBtn } from './styles';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FacebookIcon, TwitterIcon } from 'react-share';
import { getShorternUrl } from 'src/services/fetch';
// import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
// import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useDialogContext } from 'src/context/DialogContext';

type ReportBtnTooltipProps<P> = P & { show: number };

const ReportBtnTooltip = styled(({ className, ...props }: ReportBtnTooltipProps<TooltipProps>) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme, show }) => ({
    marginTop: show ? '12px !important' : '-1000px !important',
    [`& .${tooltipClasses.tooltip}`]: {
        fontSize: 14,
        borderRadius: 8,
    },
}));

const ProductPageHeader: React.FC = (): JSX.Element => {
    const param = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [dialogState, setDialogState] = useDialogContext();
    const [showReportBtn, setShowReportBtn] = useState<boolean>(false);
    const [isOpenSharePopup, setOpenSharePopup] = useState(null);
    const [shortUrl, setShortUrl] = useState<string>('');

    const openSharePopupMenu = (event: any) => {
        setOpenSharePopup(event.currentTarget);
    };
    const handleCloseSharePopup = () => {
        setOpenSharePopup(null);
    };

    useEffect(() => {
        let unmounted = false;
        const getShortUrl = async () => {
            const _shortUrl = await getShorternUrl(window.location.href);
            if (!unmounted) {
                setShortUrl(_shortUrl);
            }
        };
        getShortUrl().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [param.id]);

    let bShowDelBtn: boolean =
        location.pathname.indexOf('/mynft/created') !== -1 || location.pathname.indexOf('/mynft/purchased') !== -1;

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
                            href={`https://www.facebook.com/sharer/sharer.php?u=${shortUrl}`}
                            target="_blank"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                color: 'black',
                            }}
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
                            href={`https://twitter.com/share?url=${shortUrl}`}
                            target="_blank"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                color: 'black',
                            }}
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
                >
                    <IconBtn onClick={() => setShowReportBtn(!showReportBtn)}>
                        <Icon icon="ph:dots-three-vertical-bold" color="#1890FF" />
                    </IconBtn>
                    <Stack
                        direction="row"
                        spacing={1}
                        paddingTop={1}
                        display={showReportBtn ? 'flex' : 'none'}
                        sx={{ position: 'absolute', right: 0, top: '100%' }}
                    >
                        {!bShowDelBtn && (
                            <ReportBtnTooltip title="Coming Soon" show={showReportBtn ? 1 : 0}>
                                <span>
                                    <PrimaryButton disabled btn_color="pink" size="small" sx={{ paddingX: 2.5 }}>
                                        <Icon
                                            icon="ph:megaphone"
                                            fontSize={20}
                                            color="rgba(0, 0, 0, 0.26)"
                                            style={{ marginLeft: -4, marginRight: 8, marginBottom: 2 }}
                                        />
                                        Report
                                    </PrimaryButton>
                                </span>
                            </ReportBtnTooltip>
                        )}
                        {bShowDelBtn && (
                            <PrimaryButton
                                size="small"
                                btn_color="pink"
                                sx={{ paddingX: 2.5 }}
                                onClick={() => {
                                    setDialogState({
                                        ...dialogState,
                                        burnNFTDlgOpened: true,
                                    });
                                }}
                            >
                                <Icon
                                    icon="ph:trash"
                                    fontSize={20}
                                    color="#EB5757"
                                    style={{ marginLeft: -4, marginRight: 8, marginBottom: 2 }}
                                />
                                {'Delete'}
                            </PrimaryButton>
                        )}
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    );
};

export default ProductPageHeader;
