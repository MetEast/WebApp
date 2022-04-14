import React from 'react';
import { Stack, Typography } from '@mui/material';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { SxProps } from '@mui/system';

interface ComponentProps {
    sx?: SxProps;
}

const ClaimBox: React.FC<ComponentProps> = ({ sx }): JSX.Element => {
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
                    1000
                </Typography>
                <Typography fontSize={10} fontWeight={400} color="#0A0B0C" marginLeft={1} marginRight="auto">
                    ~$4,10
                </Typography>
            </Stack>
            <PrimaryButton
                size="small"
                sx={{ width: 130, borderRadius: 0, fontSize: { xs: 15, md: 18 }, fontWeight: { xs: 600, md: 700 } }}
            >
                claim
            </PrimaryButton>
        </Stack>
    );
};

export default ClaimBox;
