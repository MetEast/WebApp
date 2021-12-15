import React from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface IEditProfileProps {}

const EditProfile: React.FC<IEditProfileProps> = (): JSX.Element => {
    const navigate = useNavigate();

    const handleClickBack = () => {
        navigate('/profile');
    };
    
    return (
        <Box>
            <Box>
                <Button variant="outlined" onClick={handleClickBack}>
                    Back
                </Button>
            </Box>
        </Box>
    );
};

export default EditProfile;
