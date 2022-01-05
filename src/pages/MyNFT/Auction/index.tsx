import React from 'react';
import { Stack, Grid, Typography } from '@mui/material';
import { enumBadgeType } from 'src/types/product-types';
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton } from 'src/components/Buttons/styles';
import SingleNFTMoreInfo from 'src/components/SingleNFTMoreInfo';
import SingleNFTBidsTable from 'src/components/SingleNFTBidsTable';
import SingleNFTTransactionTable from 'src/components/SingleNFTTransactionTable';
import PriceHistoryView from 'src/components/PriceHistoryView';
import { TypeSingleNFTTransaction, TypeSingleNFTBid } from 'src/types/product-types';
import { singleNFTTransactions, singleNFTBids } from 'src/constants/dummyData';

const MyNFTAuction: React.FC = (): JSX.Element => {
    return (
        <>
            <ProductPageHeader />
            MyNFTAuction
        </>
    );
};

export default MyNFTAuction;
