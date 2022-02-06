import React from 'react';
import { Stack, Box } from '@mui/material';
import { Icon } from '@iconify/react';
import { SecondaryButton, PinkButton } from 'src/components/Buttons/styles';
import { IconBtn } from './styles';
import { useNavigate } from 'react-router-dom';

const ProductPageHeader: React.FC = (): JSX.Element => {
    const navigate = useNavigate();
    const [showReportBtn, setShowReportBtn] = React.useState<boolean>(false);

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
                <SecondaryButton size="small" sx={{ paddingX: 2.5 }}>
                    <Icon
                        icon="ph:share-network-bold"
                        fontSize={20}
                        color="#1890FF"
                        style={{ marginLeft: -4, marginRight: 8 }}
                    />
                    Share
                </SecondaryButton>
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
