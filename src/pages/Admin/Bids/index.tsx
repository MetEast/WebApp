import React, { useState, useMemo } from 'react';
import { Stack } from '@mui/material';
import { AdminTableColumn, AdminBidsItemType } from 'src/types/admin-table-data-types';
import Table from 'src/components/Admin/Table';
import CustomTextField from 'src/components/TextField';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { Icon } from '@iconify/react';

const AdminBids: React.FC = (): JSX.Element => {
    const columns: AdminTableColumn[] = [
        {
            id: 'id',
            label: 'ID',
        },
        {
            id: 'nft_identity',
            label: 'NFT Identity',
        },
        {
            id: 'project_title',
            label: 'project  Title',
            width: 160,
        },
        {
            id: 'buyer',
            label: 'Buyer',
        },
        {
            id: 'buyer_id',
            label: 'Buyer ID',
        },
        {
            id: 'state',
            label: 'State',
        },
        {
            id: 'created',
            label: 'Created',
            width: 160,
        },
    ];

    const data: AdminBidsItemType[] = useMemo(
        () =>
            [...Array(162).keys()].map(
                (item) =>
                    ({
                        id: 84560673 + item,
                        nft_identity: 'NFT Identity',
                        project_title: 'Project Title',
                        buyer: 'Nickname',
                        buyer_id: '8456080',
                        state: 'Streamed',
                        created: '2022-06-18  08:50:00',
                    } as AdminBidsItemType),
            ),
        [],
    );

    const [tabledata] = useState(data);

    return (
        <Stack height="100%" spacing={4}>
            <Stack direction="row" alignItems="flex-end" columnGap={1}>
                <CustomTextField title="Project Name" placeholder="Enter Name" />
                <PrimaryButton size="small" sx={{ paddingX: 3 }}>
                    <Icon
                        icon="ph:magnifying-glass"
                        fontSize={20}
                        color="white"
                        style={{ marginBottom: 2, marginRight: 4 }}
                    />
                    {`Search`}
                </PrimaryButton>
            </Stack>
            <Table tabledata={tabledata} columns={columns} />
        </Stack>
    );
};

export default AdminBids;
