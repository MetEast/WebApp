import { Box, Button, Grid } from '@mui/material';
import { Chat24Filled, Person24Filled, Wallet24Filled } from '@fluentui/react-icons';
import React from 'react';
import { ProfileCoverImage, ProfileImage } from './styledComponents';
import { H2Typography, H4Typography, H5Typography, H6Typography } from 'src/core/typographies';
import NftTabs from './NftTabs';

export interface IPrivateProfileProps {
    onClickNotifications: () => void;
}

const PrivateProfile: React.FC<IPrivateProfileProps> = ({ onClickNotifications }): JSX.Element => {
    return (
        <>
            <Button onClick={onClickNotifications} color="inherit">
                <Chat24Filled />
            </Button>
            <Box pt={2.5} pb={2.5}>
                <ProfileCoverImage src="https://scalablesolutions.io/wp-content/uploads/2021/03/NFTs.png" />
            </Box>
            <Box>
                <ProfileImage src="https://miro.medium.com/focal/58/58/50/50/0*sViPWB4sXg5xE1TT" />
            </Box>
            <H2Typography>Nickname</H2Typography>
            <Grid container pt={2.25}>
                <Grid item xs={6} display={'flex'}>
                    <Box display="flex" alignItems="center" pr={1.5}>
                        <Wallet24Filled />
                    </Box>
                    <Box>
                        <H6Typography>Wallet Address</H6Typography>
                        <H6Typography>0x8d1...19Ff</H6Typography>
                    </Box>
                </Grid>
                <Grid item xs={6} display={'flex'}>
                    <Box display="flex" alignItems="center" pr={1.5}>
                        <Person24Filled />
                    </Box>
                    <Box>
                        <H6Typography>Elastos DID</H6Typography>
                        <H6Typography>0x8d1...19Ff</H6Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid container mt={2.25}>
                <Grid item xs={6}>
                    <Button variant="contained">Create NFT</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="outlined">Edit Profile</Button>
                </Grid>
            </Grid>
            <Box mt={2.25}>
                <H4Typography>Your Earnings</H4Typography>
                <Grid container mt={1}>
                    <Grid item xs={4}>
                        <H5Typography sx={{ fontWeight: 700 }}>240.00</H5Typography>
                        <H6Typography>Total</H6Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <H5Typography sx={{ fontWeight: 700 }}>240.00</H5Typography>
                        <H6Typography>Today</H6Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="outlined">Details</Button>
                    </Grid>
                </Grid>
            </Box>
            <Box mt={2.25}>
                <H4Typography mb={1}>Your NFTs</H4Typography>
                <NftTabs />
            </Box>
        </>
    );
};

export default PrivateProfile;
