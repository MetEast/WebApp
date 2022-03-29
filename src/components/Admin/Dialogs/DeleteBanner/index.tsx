import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
// import { useStyles } from './styles';
import { DialogTitleTypo } from '../../../TransactionDialogs/styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { useSignInContext } from 'src/context/SignInContext';
import { useSnackbar } from 'notistack';
import { deleteAdminBanner } from 'src/services/fetch';

export interface ComponentProps {
    bannerId: number;
    handleBannerUpdates: () => void;
    onClose: () => void;
}

const DeleteBanner: React.FC<ComponentProps> = ({ bannerId, handleBannerUpdates, onClose }): JSX.Element => {
    // const classes = useStyles();
    const [signInDlgState] = useSignInContext();
    const { enqueueSnackbar } = useSnackbar();
    const [onProgress, setOnProgress] = useState<boolean>(false);

    const handleDelete = () => {
        if (bannerId === undefined) return;
        setOnProgress(true);
        deleteAdminBanner(signInDlgState.token, bannerId)
            .then((success: boolean) => {
                if (success) {
                    enqueueSnackbar('Deleted!', {
                        variant: 'success',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                } else {
                    enqueueSnackbar('Error', {
                        variant: 'error',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                }
            })
            .catch((error) => {
                enqueueSnackbar('Delete banner error.', {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
            })
            .finally(() => {
                setOnProgress(false);
                handleBannerUpdates();
                onClose();
            });
    };

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Are you Sure?</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400}>
                    Do you really want to delete this banner?
                </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
                <PrimaryButton btn_color="secondary" fullWidth onClick={onClose}>
                    Back
                </PrimaryButton>
                <PrimaryButton btn_color="pink" fullWidth disabled={onProgress} onClick={handleDelete}>
                    Delete
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default DeleteBanner;
