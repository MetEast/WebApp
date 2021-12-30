import React from 'react';
import { Stack } from '@mui/material';
import { Icon } from '@iconify/react';
import { PrimaryBtn, IconBtn } from './styles';

const ProductPageHeader: React.FC = (): JSX.Element => {
    return (
        <Stack direction="row" justifyContent="space-between">
            <PrimaryBtn startIcon={<Icon icon="ph:caret-left-bold" color="#1890FF" />}>Back</PrimaryBtn>
            <Stack direction="row" spacing={1}>
                <PrimaryBtn startIcon={<Icon icon="ph:share-network-bold" color="#1890FF" />}>Share</PrimaryBtn>
                <IconBtn>
                    <Icon icon="ph:dots-three-vertical-bold" color="#1890FF" />
                </IconBtn>
            </Stack>
        </Stack>
    );
};

export default ProductPageHeader;
