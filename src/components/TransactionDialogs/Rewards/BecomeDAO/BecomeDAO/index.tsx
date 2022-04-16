import React from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../../components/WarningTypo';

export interface ComponentProps {
    onClose: () => void;
}

const BecomeDAO: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    return (
        <Stack spacing={5} width={550}>
            <Stack alignItems="center">
                <DialogTitleTypo>Become DAO</DialogTitleTypo>
            </Stack>
        </Stack>
    );
};

export default BecomeDAO;
