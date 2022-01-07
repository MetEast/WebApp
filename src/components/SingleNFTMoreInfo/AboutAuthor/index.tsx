import React from 'react';
import { Stack, Typography } from '@mui/material';

interface ComponentProps {
    name: string;
    description: string;
    img: string;
}

const AboutAuthor: React.FC<ComponentProps> = ({name, description, img}): JSX.Element => {
    return (
        <Stack spacing={1}>
            <Typography fontSize={22} fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                About the author
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
                <img src={img} width={24} height={24} alt="" />
                {/* <img src="/assets/images/avatar-template.png" width={24} alt="" /> */}
                <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }} >
                    {name}
                </Typography>
            </Stack>
            <Typography fontSize={14} fontWeight={400}>
                {description}
            </Typography>
        </Stack>
    );
};

export default AboutAuthor;
