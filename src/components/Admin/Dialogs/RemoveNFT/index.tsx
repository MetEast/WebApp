import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { PinkButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { useSignInContext } from 'src/context/SignInContext';
import { AdminNFTItemType } from 'src/types/admin-table-data-types';
import { reduceHexAddress } from 'src/services/common';

export interface ComponentProps {
    token2Remove: AdminNFTItemType;
    handleTokenUpdate: (value: AdminNFTItemType) => void;
    onClose: () => void;
}

const RemoveNFT: React.FC<ComponentProps> = ({ token2Remove, handleTokenUpdate, onClose }): JSX.Element => {
    const [signInDlgState] = useSignInContext();

    const handleRmoveToken = () => {
        alert(token2Remove.tokenId);
        handleTokenUpdate(token2Remove);
    };

    return (
        <Stack spacing={4} width={520}>
            <Stack alignItems="center">
                <DialogTitleTypo>Are you Sure?</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400}>
                    You are deleting the following NFT:
                </Typography>
            </Stack>
            <Box borderRadius={2} width={180} height={120} overflow="hidden" alignSelf="center">
                <img src={token2Remove.nft_image} width="100%" height="100%" style={{ objectFit: 'cover' }} alt="" />
            </Box>
            <CustomTextField title="NFT TITLE" placeholder="NFT TITLE" inputValue={token2Remove.nft_title} disabled />
            <CustomTextField
                title="NFT CREATOR"
                placeholder="NFT CREATOR"
                inputValue={token2Remove.nft_creator}
                disabled
            />
            <CustomTextField title="TOKEN ID" placeholder="TOKEN ID" inputValue={reduceHexAddress(token2Remove.token_id, 20)} disabled />
            <Stack direction="row" spacing={2}>
                <SecondaryButton fullWidth onClick={onClose}>
                    close
                </SecondaryButton>
                <PinkButton fullWidth onClick={handleRmoveToken}>
                    Confirm
                </PinkButton>
            </Stack>
        </Stack>
    );
};

export default RemoveNFT;
