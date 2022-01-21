import React, { useState, useMemo } from 'react';
import { Box, Stack } from '@mui/material';
import { AdminHomeItemType, AdminTableColumn } from 'src/types/admin-table-data-types';
import Table from 'src/components/Admin/Table';

const AdminHomePopular: React.FC = (): JSX.Element => {
    const columns: AdminTableColumn[] = [
        {
            id: 'id',
            label: 'ID',
        },
        {
            id: 'project_title',
            label: 'project Title',
            width: 160,
        },
        {
            id: 'project_type',
            label: 'type',
        },
        {
            id: 'sort',
            label: 'Sort',
            width: 80,
        },
        {
            id: 'created',
            label: 'Created',
        },
    ];

    const data: AdminHomeItemType[] = useMemo(
        () =>
            [...Array(164).keys()].map(
                (item) =>
                    ({
                        id: 84560673 + item,
                        project_title: 'Project Title',
                        project_type: 'Blind Box',
                        sort: 10,
                        created: '2022-06-18  08:50:00',
                    } as AdminHomeItemType),
            ),
        [],
    );

    const [tabledata, setTabledata] = useState(data);

    return (
        <Stack height="100%" spacing={4}>
            <Table tabledata={tabledata} columns={columns} />
        </Stack>
    );
};

export default AdminHomePopular;
