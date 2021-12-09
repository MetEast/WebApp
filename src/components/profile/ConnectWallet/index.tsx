import { Box, Button, Grid } from '@mui/material';
import { Chat24Filled, Person24Filled } from '@fluentui/react-icons';
import React from 'react';
import { ProfileCoverImage, ProfileImage } from './styledComponents';
import { H2Typography, H6Typography } from 'src/core/typographies';

export interface IConnectWalletProps {
    onClickConnect: () => void;
    onClickNotifications: () => void;
}

const ConnectWallet: React.FC<IConnectWalletProps> = ({ onClickConnect, onClickNotifications }): JSX.Element => {
    return (
        <>
            <Button onClick={onClickNotifications} color='inherit'><Chat24Filled /></Button>
            <Box pt={2.5} pb={2.5}>
                <ProfileCoverImage src="https://www.freecodecamp.org/news/content/images/size/w2000/2021/03/Advanced-NFT-Deployment---1-.png" />
            </Box>
            <Box>
                <ProfileImage src="https://miro.medium.com/focal/58/58/50/50/0*sViPWB4sXg5xE1TT" />
            </Box>
            <H2Typography>Nickname</H2Typography>
            <Grid container pt={2.25}>
                <Grid item xs={6} display={'flex'}>
                    <Box display="flex" alignItems="center" pr={1.5}>
                        <Person24Filled />
                    </Box>
                    <Box>
                        <H6Typography>Elastos DID</H6Typography>
                        <H6Typography>0x8d1...19Ff</H6Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="outlined">Edit Profile</Button>
                </Grid>
            </Grid>
            <Box mt={2.5}>
                <Button variant="contained" fullWidth onClick={onClickConnect}>
                    Connect Wallet
                </Button>
            </Box>
        </>
    );
};

export default ConnectWallet;
