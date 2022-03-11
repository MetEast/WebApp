import React, { useState } from 'react';
import { Stack, Typography, Grid, Box } from '@mui/material';
import { useStyles } from './styles';
import { DialogTitleTypo } from '../../../TransactionDialogs/styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { Icon } from '@iconify/react';

export interface ComponentProps {
    onClose: () => void;
}

const CreateBanner: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    const classes = useStyles();

    const [blindboxStatus, setBlindboxStatus] = useState<'offline' | 'online'>('offline');
    const [location, setLocation] = useState<'home' | 'explore' | 'blindbox'>('home');

    return (
        <Stack
            spacing={5}
            width={720}
            // maxHeight={'60vh'}
            // sx={{ overflowY: 'auto', overflowX: 'hidden' }}
            // className={classes.container}
        >
            <Stack alignItems="center">
                <DialogTitleTypo>Create Banner</DialogTitleTypo>
            </Stack>
            <Box>
                <Grid container columnSpacing={4}>
                    <Grid item xs={6} display="flex" flexDirection="column" rowGap={3}>
                        <Stack spacing={1}>
                            <Typography fontSize={12} fontWeight={700}>
                                Image
                            </Typography>
                            <img
                                src="/assets/images/blindbox/blindbox-nft-template2.png"
                                style={{ borderRadius: '18px' }}
                                alt=""
                            />
                            <Stack direction="row" spacing={1}>
                                <SecondaryButton
                                    fullWidth
                                    size="small"
                                    sx={{ background: '#FDEEEE', color: '#EB5757' }}
                                >
                                    <Icon icon="ph:trash" fontSize={20} style={{ marginBottom: 2, marginRight: 4 }} />
                                    {`Delete`}
                                </SecondaryButton>
                                <SecondaryButton fullWidth size="small">
                                    <Icon
                                        icon="ph:pencil-simple"
                                        fontSize={20}
                                        style={{ marginBottom: 4, marginRight: 4 }}
                                    />
                                    {`Edit`}
                                </SecondaryButton>
                            </Stack>
                        </Stack>
                        <CustomTextField title="URL" placeholder="Enter URL" changeHandler={(value) => {}} />
                    </Grid>
                    <Grid item xs={6} display="flex" flexDirection="column" rowGap={3}>
                        <Stack spacing={1}>
                            <Typography fontSize={12} fontWeight={700}>
                                Location
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    sx={{
                                        background: location === 'home' ? 'auto' : '#E8F4FF',
                                        color: location === 'home' ? 'auto' : '#1890FF',
                                    }}
                                    onClick={() => setLocation('home')}
                                >
                                    Home
                                </PrimaryButton>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    sx={{
                                        background: location === 'explore' ? 'auto' : '#E8F4FF',
                                        color: location === 'explore' ? 'auto' : '#1890FF',
                                    }}
                                    onClick={() => setLocation('explore')}
                                >
                                    Explore
                                </PrimaryButton>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    sx={{
                                        background: location === 'blindbox' ? 'auto' : '#E8F4FF',
                                        color: location === 'blindbox' ? 'auto' : '#1890FF',
                                    }}
                                    onClick={() => setLocation('blindbox')}
                                >
                                    Blind Box
                                </PrimaryButton>
                            </Stack>
                        </Stack>
                        <Stack spacing={1}>
                            <Typography fontSize={12} fontWeight={700}>
                                Status
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    sx={{
                                        background: blindboxStatus === 'offline' ? 'auto' : '#E8F4FF',
                                        color: blindboxStatus === 'offline' ? 'auto' : '#1890FF',
                                    }}
                                    onClick={() => setBlindboxStatus('offline')}
                                >
                                    Offline
                                </PrimaryButton>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    sx={{
                                        background: blindboxStatus === 'online' ? 'auto' : '#E8F4FF',
                                        color: blindboxStatus === 'online' ? 'auto' : '#1890FF',
                                    }}
                                    onClick={() => setBlindboxStatus('online')}
                                >
                                    Online
                                </PrimaryButton>
                            </Stack>
                        </Stack>
                        <CustomTextField title="Sort" inputValue="10" placeholder="" changeHandler={(value) => {}} />
                    </Grid>
                </Grid>
            </Box>
            <Stack width="100%" direction="row" spacing={2}>
                <SecondaryButton fullWidth onClick={onClose}>
                    Back
                </SecondaryButton>
                <PrimaryButton fullWidth>Confirm</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default CreateBanner;
