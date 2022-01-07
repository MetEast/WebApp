import React from 'react';
import { Stack, Typography } from '@mui/material';

interface ComponentProps {
    description: string;
}

const ProjectDescription: React.FC<ComponentProps> = ({description}): JSX.Element => {
    return (
        <Stack spacing={1}>
            <Typography fontSize={22} fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                Project description
            </Typography>
            <Typography fontSize={14} fontWeight={400}>
                {description}
            </Typography>
        </Stack>
    );
};

export default ProjectDescription;
