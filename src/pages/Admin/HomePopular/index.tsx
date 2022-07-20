import React, { useState, useMemo } from 'react';
import { Stack, IconButton } from '@mui/material';
import { AdminHomeItemType, AdminTableColumn } from 'src/types/admin-table-data-types';
import Table from 'src/components/Admin/Table';
import { Icon } from '@iconify/react';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ModalDialog from 'src/components/ModalDialog';
import AddPopularItem from 'src/components/Admin/Dialogs/AddPopularItem';
import EditPopularItem from 'src/components/Admin/Dialogs/EditPopularItem';

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
        {
            id: 'edits',
            label: '',
            cell: (props) => (
                <Stack direction="row" spacing={1}>
                    <IconButton sx={{ height: 40, borderRadius: 3, background: '#FDEEEE' }}>
                        <Icon icon="ph:trash" color="#EB5757" />
                    </IconButton>
                    <IconButton sx={{ height: 40, borderRadius: 3, background: '#E8F4FF' }} onClick={onItemEdit}>
                        <Icon icon="ph:pencil-simple" color="#1890FF" />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    const data: AdminHomeItemType[] = useMemo(
        () =>
            [...Array(164).keys()].map(
                (item) =>
                    ({
                        id: 84560673 + item,
                        project_title: 'Project Title',
                        project_type: 'Mystery Box',
                        sort: 10,
                        created: '2022-06-18  08:50:00',
                    } as AdminHomeItemType),
            ),
        [],
    );

    const [tabledata] = useState(data);

    const [showAddPoularItemDlg, setShowAddPoularItemDlg] = useState<boolean>(false);
    const [showEditPoularItemDlg, setShowEditPoularItemDlg] = useState<boolean>(false);

    const onItemEdit = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowEditPoularItemDlg(true);
    };

    return (
        <>
            <Stack height="100%" spacing={4}>
                <Stack direction="row">
                    <PrimaryButton
                        size="small"
                        sx={{ paddingX: 3 }}
                        onClick={() => {
                            setShowAddPoularItemDlg(true);
                        }}
                    >
                        <Icon icon="ph:plus" fontSize={20} color="white" style={{ marginBottom: 2, marginRight: 4 }} />
                        {`Add popular item`}
                    </PrimaryButton>
                </Stack>
                <Table tabledata={tabledata} columns={columns} />
            </Stack>
            <ModalDialog
                open={showAddPoularItemDlg}
                onClose={() => {
                    setShowAddPoularItemDlg(false);
                }}
            >
                <AddPopularItem />
            </ModalDialog>
            <ModalDialog
                open={showEditPoularItemDlg}
                onClose={() => {
                    setShowEditPoularItemDlg(false);
                }}
            >
                <EditPopularItem />
            </ModalDialog>
        </>
    );
};

export default AdminHomePopular;
