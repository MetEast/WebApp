import React from 'react';
import { Box, Button } from '@mui/material';
import { H2Typography, H5Typography } from 'src/core/typographies';
import { WalletButtonIconContainer, WalletConnectionButton } from './styledComponents';

const WalletConnection: React.FC = (): JSX.Element => {
    return (
        <Box sx={{ paddingTop: '60px' }}>
            <Box sx={{ marginBottom: '60px', textAlign: 'center' }}>
                <H2Typography>Choose Wallet</H2Typography>
            </Box>
            <Box pl={4} pr={4}>
                <WalletConnectionButton fullWidth>
                    <Box>
                        <WalletButtonIconContainer>
                            <img src="/assets/icons/elastos-essential.svg" alt="" />
                        </WalletButtonIconContainer>
                        <H5Typography>Elastos Essentials</H5Typography>
                    </Box>
                </WalletConnectionButton>
                <Box mt={6}>
                    <WalletConnectionButton fullWidth>
                        <Box>
                            <WalletButtonIconContainer>
                                <img src="/assets/icons/metamask-alt.svg" alt="" />
                            </WalletButtonIconContainer>
                            <H5Typography>Metamask</H5Typography>
                        </Box>
                    </WalletConnectionButton>
                </Box>
            </Box>
            <Box sx={{ marginTop: '50px', textAlign: 'center' }}>
                <Button variant="contained">Close</Button>
            </Box>
        </Box>
    );
};

export default WalletConnection;
