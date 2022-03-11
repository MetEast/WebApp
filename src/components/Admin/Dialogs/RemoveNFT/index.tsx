import React from 'react';
import { Stack } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { PinkButton, SecondaryButton } from 'src/components/Buttons/styles';
import SearchTextField from '../components/SearchTextField';
import CustomTextField from 'src/components/TextField';

export interface ComponentProps {
    onClose: () => void;
}

const RemoveNFT: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    return (
        <Stack spacing={5} width={520}>
            <Stack alignItems="center">
                <DialogTitleTypo>Are you Sure?</DialogTitleTypo>
            </Stack>
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
