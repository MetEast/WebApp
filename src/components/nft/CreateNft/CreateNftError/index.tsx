import React from 'react';
import { Box, Button } from '@mui/material';
import { H6Typography, H4Typography, H2Typography } from 'src/core/typographies';
import { useNavigate } from 'react-router-dom';

export interface ICreateNftErrorProps {}

const CreateNftError: React.FC<ICreateNftErrorProps> = (): JSX.Element => {
    const navigate = useNavigate();

    const handleClickTryAgain = () => {
        navigate('/nft/create');
    };

    return (
        <Box textAlign="center">
            <H6Typography mt={3} sx={{ fontWeight: 600 }}>
                Error
            </H6Typography>
            <H2Typography mt={3}>Something Went Wrong</H2Typography>
            <H4Typography mt={2.5} sx={{ fontWeight: 400, lineHeight: '1.5rem' }}>
                Sorry, something went wrong. Please try again later.
            </H4Typography>
            <Box mt={2.5} textAlign="center">
                <Button variant="contained" onClick={handleClickTryAgain}>
                    Try Again
                </Button>
            </Box>
        </Box>
    );
};

export default CreateNftError;
