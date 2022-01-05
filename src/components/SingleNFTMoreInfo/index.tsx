import React from 'react';
import { Grid } from '@mui/material';
import { SpacingProps } from '@mui/system';
import AboutAuthor from './AboutAuthor';
import ProjectDescription from './ProjectDescription';
import ChainDetails from './ChainDetails';

interface ComponentProps extends SpacingProps {
    vertically?: boolean;
}

const SingleNFTMoreInfo: React.FC<ComponentProps> = ({ vertically = false, ...otherProps }): JSX.Element => {
    return (
        <Grid container columnSpacing={5} rowGap={5} {...otherProps}>
            <Grid item xs={vertically ? 12 : 4} order={vertically ? 2 : 1}>
                <AboutAuthor />
            </Grid>
            <Grid item xs={vertically ? 12 : 4} order={vertically ? 1 : 2}>
                <ProjectDescription />
            </Grid>
            <Grid item xs={vertically ? 12 : 4} order={3}>
                <ChainDetails />
            </Grid>
        </Grid>
    );
};

export default SingleNFTMoreInfo;
