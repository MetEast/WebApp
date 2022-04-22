import React from 'react';
import { Stack, Typography } from '@mui/material';
import { Markup } from 'interweave';

interface ComponentProps {
    description: string;
}

const ProjectDescription: React.FC<ComponentProps> = ({ description }): JSX.Element => {
    return (
        <Stack spacing={1}>
            <Typography fontSize={22} fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                Description
            </Typography>
            <Typography fontSize={16} fontWeight={400}>
                <Markup content={description} />
            </Typography>
        </Stack>
    );
};

export default ProjectDescription;
