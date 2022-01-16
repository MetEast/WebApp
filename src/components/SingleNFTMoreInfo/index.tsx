import React from 'react';
import { Grid } from '@mui/material';
import { SpacingProps } from '@mui/system';
import AboutAuthor from './AboutAuthor';
import ProjectDescription from './ProjectDescription';
import ChainDetails from './ChainDetails';
import SingleNFTBidsTable from 'src/components/SingleNFTBidsTable';
import { TypeSingleNFTBid } from 'src/types/product-types';

interface ComponentProps extends SpacingProps {
    author: string, 
    authorDescription: string,
    authorImg: string,
    authorAddress: string,
    description: string;
    detailTokenIdHex: string, 
    detailOwnerName: string, 
    detailOwnerAddress: string, 
    detailRoyalties: number, 
    detailCreateTime: string,
    vertically?: boolean,
    bidsList?: Array<TypeSingleNFTBid>,
    myBidsList?: Array<TypeSingleNFTBid>,
    isLoggedIn?: boolean
}   

const SingleNFTMoreInfo: React.FC<ComponentProps> = ({
    author, 
    authorDescription, 
    authorImg, 
    authorAddress,
    description, 
    detailTokenIdHex, 
    detailOwnerName,
    detailOwnerAddress, 
    detailRoyalties, 
    detailCreateTime, 
    bidsList,
    myBidsList = [],
    isLoggedIn = false, 
    vertically = false, 
    ...otherProps }): JSX.Element => {
    
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
            {bidsList && <Grid item xs={12} display={{xs:'block', sm:'block', md:'none', lg:'none'}}>
                <SingleNFTBidsTable isLoggedIn={isLoggedIn} myBidsList={myBidsList} bidsList={bidsList} onlyShowDownSm={true} />
            </Grid>}
            <Grid item xs={12} sm={6} md={12}>
                <AboutAuthor name={author} address={authorAddress} description={authorDescription} img={authorImg} />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
                <ChainDetails tokenId={detailTokenIdHex} ownerName={detailOwnerName} ownerAddress={detailOwnerAddress} royalties={detailRoyalties} createTime={detailCreateTime} />
            </Grid>
        </Grid>
    );
};

export default SingleNFTMoreInfo;
