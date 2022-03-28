import React from 'react';
import { Stack, Typography } from '@mui/material';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { SxProps } from '@mui/system';

export interface ComponentProps {
    bannerTitle: string;
    buttonLabel?: string;
    sx?: SxProps;
    onBannerBtnClick?: () => void;
}

const LooksEmptyBox: React.FC<ComponentProps> = ({ bannerTitle, buttonLabel, sx, onBannerBtnClick }): JSX.Element => {
    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            width="100%"
            paddingTop={4}
            paddingBottom={6}
            borderRadius={5}
            sx={{ background: '#E8F4FF', ...sx }}
        >
            <Typography fontSize={32} fontWeight={700} textAlign="center">
                {bannerTitle}
            </Typography>
            <img src="/assets/images/profile/looks-empty-here.svg" alt="Looks Empty Here" style={{ marginTop: 16 }} />
            {buttonLabel && (
                <PrimaryButton sx={{ width: 250, marginTop: 4 }} onClick={onBannerBtnClick}>
                    {buttonLabel}
                </PrimaryButton>
            )}
        </Stack>
    );
};

export default LooksEmptyBox;
