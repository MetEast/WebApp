import React, { useState } from 'react';
import { Stack, Typography, Grid, Box } from '@mui/material';
import { useStyles } from './styles';
import { DialogTitleTypo } from '../../../TransactionDialogs/styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { Icon } from '@iconify/react';

export interface ComponentProps {
    onClose: () => void;
}

const CreateBanner: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    // const classes = useStyles();

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
                                <PrimaryButton btn_type="pink" fullWidth size="small">
                                    <Icon icon="ph:trash" fontSize={20} style={{ marginBottom: 2, marginRight: 4 }} />
                                    {`Delete`}
                                </PrimaryButton>
                                <PrimaryButton btn_type="secondary" fullWidth size="small">
                                    <Icon
                                        icon="ph:pencil-simple"
                                        fontSize={20}
                                        style={{ marginBottom: 4, marginRight: 4 }}
                                    />
                                    {`Edit`}
                                </PrimaryButton>
                            </Stack>
                        </Stack>
                        <CustomTextField title="URL" placeholder="Enter Banner URL" changeHandler={(value) => {}} />
                    </Grid>
                    <Grid item xs={6} display="flex" flexDirection="column" rowGap={3}>
                        <Stack spacing={0.5}>
                            <Typography fontSize={12} fontWeight={700}>
                                Location
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    btn_type={location === 'home' ? 'primary' : 'secondary'}
                                    onClick={() => setLocation('home')}
                                >
                                    Home
                                </PrimaryButton>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    btn_type={location === 'explore' ? 'primary' : 'secondary'}
                                    onClick={() => setLocation('explore')}
                                >
                                    Explore
                                </PrimaryButton>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    btn_type={location === 'blindbox' ? 'primary' : 'secondary'}
                                    onClick={() => setLocation('blindbox')}
                                >
                                    Blind Box
                                </PrimaryButton>
                            </Stack>
                        </Stack>
                        <Stack spacing={0.5}>
                            <Typography fontSize={12} fontWeight={700}>
                                Banner Status
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    btn_type={blindboxStatus === 'offline' ? 'primary' : 'secondary'}
                                    onClick={() => setBlindboxStatus('offline')}
                                >
                                    Offline
                                </PrimaryButton>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    btn_type={blindboxStatus === 'online' ? 'primary' : 'secondary'}
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
                <PrimaryButton btn_type="secondary" fullWidth onClick={onClose}>
                    close
                </PrimaryButton>
                <PrimaryButton fullWidth>Confirm</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default CreateBanner;
