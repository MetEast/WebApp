import React from 'react';
import { Stack } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {
    onClose: () => void;
}

const NoBids: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    return (
        <Stack spacing={3} width={280} alignItems="center">
            <Stack alignItems="center">
                <DialogTitleTypo>No Bids Yet</DialogTitleTypo>
            </Stack>
            <img
                src="/assets/images/transactionsdlg/no-bids-yet.svg"
                alt="Looks Empty Here"
                style={{ width: 180, height: 160 }}
            />
            <PrimaryButton fullWidth onClick={onClose}>
                Close
            </PrimaryButton>
        </Stack>
    );
};

export default NoBids;
