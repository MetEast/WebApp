import React from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../../components/WarningTypo';
import CustomTextField from 'src/components/TextField';

export interface ComponentProps {
    onClose: () => void;
}

const BecomeDAO: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    return (
        <Stack spacing={5} width={420}>
            <Stack alignItems="center" spacing={1}>
                <DialogTitleTypo>Become DAO</DialogTitleTypo>
                <Typography fontSize={15} fontWeight={400} color="black" textAlign="center">
                    Locking-up 10,000{' '}
                    <Typography fontSize={15} fontWeight={500} color="#1890FF" display="inline">
                        ME
                    </Typography>
                    , you can get 10% rewards when you trade NFTs.
                </Typography>
            </Stack>
            <Stack spacing={0.5}>
                <Typography fontSize={12} fontWeight={700} color="black">
                    Amount of{' '}
                    <Typography fontSize={12} fontWeight={700} color="#1890FF" display="inline">
                        ME
                    </Typography>{' '}
                    to lock-up.
                </Typography>
                <CustomTextField number={true} />
            </Stack>
            <Stack alignItems="center" spacing={1}>
                <Typography fontSize={14} fontWeight={600}>
                    Available: 1,300{' '}
                    <Typography fontSize={14} fontWeight={600} color="#1890FF" display="inline">
                        ME
                    </Typography>
                </Typography>
                <Stack direction="row" width="100%" spacing={2}>
                    <PrimaryButton fullWidth btn_color="secondary">
                        Close
                    </PrimaryButton>
                    <PrimaryButton fullWidth>Lock-up</PrimaryButton>
                </Stack>
                <WarningTypo width={240}>
                    In case of payment problems, please contact the official customer service
                </WarningTypo>
            </Stack>
        </Stack>
    );
};

export default BecomeDAO;
