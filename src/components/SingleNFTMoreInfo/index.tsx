import React from 'react';
import { Grid } from '@mui/material';
import { SpacingProps } from '@mui/system';
import AboutAuthor from './AboutAuthor';
import ProjectDescription from './ProjectDescription';
import ChainDetails from './ChainDetails';

interface ComponentProps extends SpacingProps {
    author: {name: string, description: string, img: string};
    description: string;
    // chainDetail: {name: string, platformId: string, chainId: string};
    vertically?: boolean;
}

const SingleNFTMoreInfo: React.FC<ComponentProps> = ({ author, description, vertically = false, ...otherProps }): JSX.Element => {
    return (
        <Grid container columnSpacing={5} rowGap={5} {...otherProps}>
            <Grid item xs={vertically ? 12 : 4} order={vertically ? 2 : 1}>
                <AboutAuthor name={author.name} description={author.description} img={author.img} />
            </Grid>
            <Grid item xs={vertically ? 12 : 4} order={vertically ? 1 : 2}>
                <ProjectDescription description={description} />
            </Grid>
            <Grid item xs={vertically ? 12 : 4} order={3}>
                <ChainDetails />
            </Grid>
        </Grid>
    );
};

export default SingleNFTMoreInfo;
