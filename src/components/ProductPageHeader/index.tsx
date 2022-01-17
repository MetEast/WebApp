import React from 'react';
import { Stack } from '@mui/material';
import { Icon } from '@iconify/react';
import { PrimaryBtn, IconBtn } from './styles';
import { useNavigate } from 'react-router-dom';

const ProductPageHeader: React.FC = (): JSX.Element => {
    const navigate = useNavigate();

    return (
        <Stack direction="row" justifyContent="space-between">
            <PrimaryBtn
                startIcon={<Icon icon="ph:caret-left-bold" color="#1890FF" />}
                onClick={() => {
                    navigate(-1);
                }}
            >
                Back
            </PrimaryBtn>
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
