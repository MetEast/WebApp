import React from 'react';
import { Stack, Typography } from '@mui/material';

interface ComponentProps {
    description: string;
}

const ProjectDescription: React.FC<ComponentProps> = ({description}): JSX.Element => {
    return (
        <Stack spacing={1}>
            <Typography fontSize={{sm:22, xs:18}} fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                Description
            </Typography>
            <Typography fontSize={16} fontWeight={400}>
                {description}
            </Typography>
        </Stack>
    );
};

export default ProjectDescription;
