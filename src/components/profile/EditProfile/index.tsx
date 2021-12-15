import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { H2Typography, H6Typography } from 'src/core/typographies';
import { Person24Filled, Wallet24Filled } from '@fluentui/react-icons';

export interface IEditProfileProps {}

const EditProfile: React.FC<IEditProfileProps> = (): JSX.Element => {
    const [nickname, setNickname] = useState<string>('');
    const navigate = useNavigate();

    const handleClickBack = () => {
        navigate('/profile');
    };

    const handleChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    };

    const handleClickConfirm = () => {
        navigate('/profile');
    };

    return (
        <Box>
            <Box>
                <Button variant="outlined" onClick={handleClickBack}>
                    Back
                </Button>
            </Box>
            <Box mt={2.5}>
                <H2Typography mb={1}>Edit Profile</H2Typography>
                <H6Typography sx={{ fontWeight: 600 }}>Your Nickname</H6Typography>
                <TextField value={nickname} onChange={handleChangeNickname} />
            </Box>
            <Box display="flex" mt={2.5}>
                <Box display="flex">
                    <Box display="flex" alignItems="center" pr={1.5}>
                        <Person24Filled />
                    </Box>
                    <Box>
                        <H6Typography>Elastos DID</H6Typography>
                        <H6Typography>0x8d1...19Ff</H6Typography>
                    </Box>
                </Box>
                <Box ml={4}>
                    <Button variant="outlined">Log Out</Button>
                </Box>
            </Box>
            <Box display="flex" mt={2.5}>
                <Box display="flex">
                    <Box display="flex" alignItems="center" pr={1.5}>
                        <Wallet24Filled />
                    </Box>
                    <Box>
                        <H6Typography>Wallet address</H6Typography>
                        <H6Typography>0x8d1...19Ff</H6Typography>
                    </Box>
                </Box>
                <Box ml={4}>
                    <Button variant="outlined">Disconnect</Button>
                </Box>
            </Box>
            <Box mt={2.5}>
                <Box>
                    <H6Typography>Avatar Picture</H6Typography>
                </Box>
                <Box mt={2.5}>
                    <H6Typography>Profile Cover Picture</H6Typography>
                </Box>
            </Box>
            <Box mt={6}>
                <Button variant="contained" fullWidth onClick={handleClickConfirm}>
                    Confirm
                </Button>
            </Box>
        </Box>
    );
};

export default EditProfile;
