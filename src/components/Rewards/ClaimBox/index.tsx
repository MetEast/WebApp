import React from 'react';
import { Stack, Typography } from '@mui/material';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { SxProps } from '@mui/system';
import useAnimateNumber from 'react-hook-animate-number'

interface ComponentProps {
    sx?: SxProps;
    rewardToken: number;
    rewardPrice: number;
    handleReceiveReward: () => void;
}

const ClaimBox: React.FC<ComponentProps> = ({ sx, rewardToken, rewardPrice, handleReceiveReward }): JSX.Element => {
    const animatedNumber = useAnimateNumber({ number: rewardToken })

    return (
        <Stack direction="row" borderRadius={3} sx={{ overflow: 'hidden', ...sx }}>
            <Stack
                direction="row"
                alignItems="center"
                height={40}
                flexGrow={1}
                paddingLeft={1.5}
                border="1px solid #1890FF"
                boxSizing="border-box"
                sx={{ background: 'white', borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}
            >
                <Typography fontSize={16} fontWeight={600} color="#0A0B0C">
                    {animatedNumber.number}
                </Typography>
                {/* <Typography fontSize={10} fontWeight={400} color="#0A0B0C" marginLeft={1} marginRight="auto">
                    ~${rewardPrice}
                </Typography> */}
            </Stack>
            <PrimaryButton
                size="small"
                sx={{ width: 130, borderRadius: 0, fontSize: { xs: 15, md: 18 }, fontWeight: { xs: 600, md: 700 } }}
                disabled={rewardToken ? false : true}
                onClick={() => {
                    handleReceiveReward();
                    rewardToken = 0;
                }}
            >
                claim
            </PrimaryButton>
        </Stack>
    );
};

export default ClaimBox;
