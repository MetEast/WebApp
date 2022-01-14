import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom';
import { Stack, Grid, Typography } from '@mui/material';
import { enumBadgeType, enumSingleNFTType, TypeNewProduct } from 'src/types/product-types'; 
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import { PrimaryButton } from 'src/components/Buttons/styles';
import AboutAuthor from 'src/components/SingleNFTMoreInfo/AboutAuthor';
import ProjectDescription from 'src/components/SingleNFTMoreInfo/ProjectDescription';
import ChainDetails from 'src/components/SingleNFTMoreInfo/ChainDetails';
import ProductTransHistory from 'src/components/ProductTransHistory';
import { getThumbnail, getTime, getUTCTime, reduceHexAddress } from 'src/services/sleep'; 

const MyNFTCreated: React.FC = (): JSX.Element => {
    // get product details from server
    const params = useParams(); // params.id
    const [productDetail, setProductDetail] = useState({id: "", name: "", image: "", price_ela: 0, price_usd: 0, likes: 0, views: 0, author: {name: "", description: "", img: ""}, description: "", details: {tokenId: "", owner: "", createTime: "", royalties: ""}, type: enumSingleNFTType.BuyNow, saleTime: ""});
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/getCollectibleByTokenId?tokenId=${params.id}`).then(response => {
            response.json().then(jsonProductDetails => {
                // console.log(jsonProductDetails);
                var item: TypeNewProduct = jsonProductDetails.data;
                var product: any = {id: "", name: "", image: "", price_ela: 0, price_usd: 0, likes: 0, views: 0, author: {name: "", description: "", img: ""}, description: "", details: {tokenId: "", owner: "", createTime: "", royalties: ""}, type: enumSingleNFTType.BuyNow, saleTime: ""};
                product.id = item.tokenId;
                product.name = item.name;
                product.image = getThumbnail(item.asset);
                product.price_ela = item.blockNumber % 1000;
                product.price_usd = product.price_ela * 3.44;
                product.likes = parseInt(item.createTime) % 10000;
                product.views = parseInt(item.createTime) * 7 % 10000;
                product.author.name = item.name + "'s nickname";
                product.author.description = item.name + "one sentence description here";
                product.author.img = getThumbnail(item.asset);
                product.description = item.description;
                product.type = parseInt(item.createTime) % 2 === 0 ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
                let saleTime = getTime(item.createTime);
                product.saleTime = saleTime.date + " " + saleTime.time;
                product.details.tokenId = reduceHexAddress(item.tokenIdHex, 5);
                product.details.owner = reduceHexAddress(item.holder, 4);
                product.details.royalties = parseInt(item.royalties) / 1e4;
                let createTime = getUTCTime(item.createTime);
                product.details.createTime = createTime.date + "" + createTime.time;
                setProductDetail(product);
            });
        }).catch(err => {
            console.log(err)
        });
    }, [params.id]);

    return (
        <>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <ProductImageContainer imgurl={productDetail.image} />
                </Grid>
                <Grid item xs={6}>
                    <Typography fontSize={56} fontWeight={700}>
                        {productDetail.name}
                    </Typography>
                    <ProductSnippets nickname="Nickname" likes={productDetail.likes} views={productDetail.views} />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={enumBadgeType.Created} />
                        <ProductBadge badgeType={enumBadgeType.Museum} />
                    </Stack>
                    {/* <ELAPrice ela_price={199} usd_price={480} marginTop={3} /> */}
                    <PrimaryButton sx={{ marginTop: 3, width: '100%' }}>Sell</PrimaryButton>
                </Grid>
            </Grid>
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <Stack spacing={3}>
                        <AboutAuthor name={productDetail.author.name} description={productDetail.author.description} img={productDetail.author.img} />
                        <ProductTransHistory sold={false} bought={false} />
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={3}>
                        <ProjectDescription description={productDetail.description} />
                        <ChainDetails tokenId={productDetail.details.tokenId} owner={productDetail.details.owner} royalties={productDetail.details.royalties} createTime={productDetail.details.createTime} />
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};

export default MyNFTCreated;
