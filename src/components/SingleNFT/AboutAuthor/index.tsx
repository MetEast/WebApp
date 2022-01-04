import React from 'react';
import { Stack, Typography } from '@mui/material';

interface ComponentProps {}

const AboutAuthor: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={1}>
            <Typography fontSize={22} fontWeight={700}>
                About the author
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
                <img src="/assets/images/avatar-template.png" width={24} alt="" />
                <Typography fontSize={14} fontWeight={700}>
                    {`Author’s nickName`}
                </Typography>
            </Stack>
            <Typography fontSize={14} fontWeight={400}>
                One Sentence Introduction. One Sentence Introduction. One Sentence Introduction. One Sentence
                Introduction. One Sentence Introduction. One Sentence Introduction.
            </Typography>
        </Stack>
    );
};

export default AboutAuthor;
