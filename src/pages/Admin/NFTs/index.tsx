import React, { useState, useMemo } from 'react';
import Table from 'src/components/Admin/Table';
import { AdminNFTItemType, AdminTableHeadCell } from 'src/types/admin-table-data-types';
import ELAPrice from 'src/components/ELAPrice';
import { Typography } from '@mui/material';

const AdminNFTs: React.FC = (): JSX.Element => {
    const headCells: AdminTableHeadCell[] = [
        {
            id: 'rulenumber',
            label: 'Rule Number',
        },
        {
            id: 'nftid',
            label: 'NFT ID',
        },
        {
            id: 'nfttitle',
            label: 'NFT Title',
        },
        {
            id: 'state',
            label: 'State',
            cell: (props) => (
                <Typography
                    display="inline-block"
                    fontSize={14}
                    fontWeight={500}
                    paddingX={1}
                    borderRadius={2}
                    color="#1EA557"
                    sx={{ background: '#C9F5DC' }}
                >
                    {props.value}
                </Typography>
            ),
        },
        {
            id: 'classification',
            label: 'Classification',
        },
        {
            id: 'original_price',
            label: 'Original Price',
            cell: (props) => <ELAPrice price_ela={props.value} />,
        },
        {
            id: 'original_owner',
            label: 'original owner',
        },
    ];

    const data: AdminNFTItemType[] = useMemo(
        () =>
            [...Array(278).keys()].map(
                (item) =>
                    ({
                        id: item,
                        rulenumber: String(item + 1).padStart(5, '0'),
                        nftid: String(item + 1).padStart(5, '0'),
                        nfttitle: 'NFT Title',
                        state: 'online',
                        classification: 'Blind Box',
                        original_price: 199,
                        original_owner: 'Nickname',
                    } as AdminNFTItemType),
            ),
        [],
    );

    const [tabledata, setTabledata] = useState(data);

    return <Table tabledata={tabledata} headCells={headCells} />;
};

export default AdminNFTs;
