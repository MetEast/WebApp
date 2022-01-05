import React from 'react';
import { Stack, Typography } from '@mui/material';

interface ComponentProps {}

const ProjectDescription: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={1}>
            <Typography fontSize={22} fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                Project description
            </Typography>
            <Typography fontSize={14} fontWeight={400}>
                One Sentence Introduction. One Sentence Introduction. One Sentence Introduction. One Sentence
                Introduction. One Sentence Introduction. One Sentence Introduction.One Sentence Introduction. One
                Sentence Introduction. One Sentence Introduction.One Sentence Introduction. One Sentence Introduction.
                One Sentence Introduction.One Sentence Introduction. One Sentence Introduction. One Sentence
                Introduction.One Sentence Introduction. One Sentence Introduction. One Sentence Introduction.
            </Typography>
        </Stack>
    );
};

export default ProjectDescription;
