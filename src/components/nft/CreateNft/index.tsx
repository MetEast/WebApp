import React, { useState } from 'react';
import { Box, Button, TextField, Checkbox } from '@mui/material';
import { H2Typography, H4Typography, H6Typography } from 'src/core/typographies';
import { useNavigate } from 'react-router-dom';

export interface ICreateNftProps {}

const CreateNft: React.FC<ICreateNftProps> = (): JSX.Element => {
    const [title, setTitle] = useState<string>('');
    const [introduction, setIntroduction] = useState<string>('');
    const [aboutAuthor, setAboutAuthor] = useState<string>('');
    const [isForSale, setForSale] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleClickBack = () => {};

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleChangeIntroduction = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIntroduction(e.target.value);
    };

    const handleChangeAboutAuthor = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAboutAuthor(e.target.value);
    };

    const handleChangeForSale = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setForSale(checked);
    };

    const handleClickConfirm = () => {
        navigate('/nft/create/confirm');
    };

    return (
        <Box>
            <Box>
                <Button variant="outlined" onClick={handleClickBack}>
                    Back
                </Button>
            </Box>
            <Box mt={2}>
                <H2Typography>Create NFT</H2Typography>
            </Box>
            <Box mt={5}>
                <H6Typography mb={1}>Project Title</H6Typography>
                <TextField label="Enter Title" fullWidth value={title} onChange={handleChangeTitle} />

                <H6Typography mt={2} mb={1}>
                    Project Introduction
                </H6Typography>
                <TextField
                    multiline
                    label="Enter Introduction"
                    rows={4}
                    fullWidth
                    value={introduction}
                    onChange={handleChangeIntroduction}
                />
            </Box>
            <Box mt={3}>
                <H4Typography mb={2}>Project Properties</H4Typography>
                <H6Typography mb={1}>About the author</H6Typography>
                <TextField
                    multiline
                    label="Placeholder Text"
                    rows={4}
                    fullWidth
                    value={aboutAuthor}
                    onChange={handleChangeAboutAuthor}
                />

                <Box mt={1.5}>
                    <H6Typography>Cover Picture</H6Typography>
                    <H6Typography mt={2}>Source File</H6Typography>
                </Box>
                <Box mt={1.5} display="flex" justifyContent="space-between">
                    <H6Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                        For Sale
                    </H6Typography>
                    <Checkbox checked={isForSale} onChange={handleChangeForSale} />
                </Box>
            </Box>
            <Box textAlign="center" mt={8}>
                <Button variant="contained" onClick={handleClickConfirm}>
                    Confirm
                </Button>
            </Box>
        </Box>
    );
};

export default CreateNft;
