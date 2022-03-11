import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { PinkButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';

export interface ComponentProps {
    onClose: () => void;
}

const RemoveNFT: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    return (
        <Stack spacing={4} width={520}>
            <Stack alignItems="center">
                <DialogTitleTypo>Are you Sure?</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400}>
                    You are deleting the following NFT:
                </Typography>
            </Stack>
            <Box borderRadius={2} width={180} height={120} overflow="hidden" alignSelf="center">
                <img
                    src="/assets/images/blindbox/blindbox-nft-template3.png"
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover' }}
                    alt=""
                />
            </Box>
            <CustomTextField title="NFT TITLE" placeholder="NFT TITLE" />
            <CustomTextField title="NFT CREATOR" placeholder="NFT CREATOR" />
            <CustomTextField title="TOKEN ID" placeholder="TOKEN ID" />
            <Stack direction="row" spacing={2}>
                <SecondaryButton fullWidth onClick={onClose}>
                    close
                </SecondaryButton>
                <PinkButton fullWidth>Confirm</PinkButton>
            </Stack>
        </Stack>
    );
};

export default RemoveNFT;
