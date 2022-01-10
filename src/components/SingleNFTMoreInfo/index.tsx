import React from 'react';
import { Grid } from '@mui/material';
import { SpacingProps } from '@mui/system';
import AboutAuthor from './AboutAuthor';
import ProjectDescription from './ProjectDescription';
import ChainDetails from './ChainDetails';
import SingleNFTBidsTable from 'src/components/SingleNFTBidsTable';
import { TypeSingleNFTBid } from 'src/types/product-types';

interface ComponentProps extends SpacingProps {
    author: {name: string, description: string, img: string};
    description: string;
    details: {tokenId: string, owner: string, royalties: string, createTime: string};
    vertically?: boolean;
    bidsList?: Array<TypeSingleNFTBid>;
}

const SingleNFTMoreInfo: React.FC<ComponentProps> = ({ author, description, details, bidsList = [], vertically = false, ...otherProps }): JSX.Element => {
    return (
        // <Grid container columnSpacing={5} rowGap={5} {...otherProps}>
        //     <Grid item xs={vertically ? 12 : 4} order={vertically ? 1 : 2}>
        //         <ProjectDescription description={description} />
        //     </Grid>
        //     <Grid item xs={vertically ? 12 : 4} order={vertically ? 2 : 1}>
        //         <AboutAuthor name={author.name} description={author.description} img={author.img} />
        //     </Grid>
        //     <Grid item xs={vertically ? 12 : 4} order={3}>
        //         <ChainDetails />
        //     </Grid>
        // </Grid>
        <Grid container columnSpacing={5} rowGap={5} {...otherProps}>
            <Grid item xs={12}>
                <ProjectDescription description={description} />
            </Grid>
            <Grid item xs={12} display={{xs:'block', sm:'none', md:'none', lg:'none'}}>
                <SingleNFTBidsTable bidsList={bidsList} />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
                <AboutAuthor name={author.name} description={author.description} img={author.img} />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
                <ChainDetails tokenId={details.tokenId} owner={details.owner} royalties={details.royalties} createTime={details.createTime} />
            </Grid>
        </Grid>
    );
};

export default SingleNFTMoreInfo;
