import React from 'react';
import { Stack, Typography } from '@mui/material';
import { PrimaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {}

const LooksEmptyBox: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            width="100%"
            paddingTop={4}
            paddingBottom={6}
            borderRadius={5}
            sx={{ background: '#E8F4FF' }}
        >
            <Typography fontSize={32} fontWeight={700}>
                Looks Empty Here
            </Typography>
            <img src="/assets/images/profile/looks-empty-here.svg" alt="Looks Empty Here" style={{ marginTop: 16 }} />
            <PrimaryButton sx={{ width: 250, marginTop: 4 }}>GET YOUR FIRST NFT</PrimaryButton>
        </Stack>
    );
};

export default LooksEmptyBox;
