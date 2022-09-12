import React, { useState, useMemo, useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import { AdminTableColumn, AdminBannersItemType } from 'src/types/admin-table-data-types';
import Table from 'src/components/Admin/Table';
import { Icon } from '@iconify/react';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ModalDialog from 'src/components/ModalDialog';
import CreateBanner from 'src/components/Admin/Dialogs/CreateBanner';
import EditBanner from 'src/components/Admin/Dialogs/EditBanner';
import DeleteBanner from 'src/components/Admin/Dialogs/DeleteBanner';
import { getAdminBannerList } from 'src/services/fetch';
import { blankAdminBannerItem } from 'src/constants/init-constants';
import { useSignInContext } from '../../../context/SignInContext';

const AdminBanners: React.FC = (): JSX.Element => {
    const columns: AdminTableColumn[] = [
        {
            id: 'banner_id',
            label: 'Banner ID',
            width: 100,
        },
        {
            id: 'image',
            label: 'Image',
            cell: (props) => (
                <Stack borderRadius={2} width={60} overflow="hidden">
                    <img src={props.value} alt="" />
                </Stack>
            ),
        },
        {
            id: 'url',
            label: 'URL',
            cell: (props) => (
                <Typography display="inline-block" fontSize={14} fontWeight={500} color="#1890FF">
                    {props.value}
                </Typography>
            ),
        },
        {
            id: 'sort',
            label: 'Sort',
        },
        {
            id: 'location',
            label: 'Location',
        },
        // {
        //     id: 'status',
        //     label: 'Status',
        //     cell: (props) => (
        //         <Typography
        //             display="inline-block"
        //             fontSize={14}
        //             fontWeight={500}
        //             paddingX={1}
        //             paddingY={0.5}
        //             borderRadius={2}
        //             color="#1EA557"
        //             sx={{ background: '#C9F5DC' }}
        //         >
        //             {props.value}
        //         </Typography>
        //     ),
        // },
        {
            id: 'created',
            label: 'Created',
            width: 160,
        },
        {
            id: 'others',
            label: '',
            cell: (props) => (
                <Stack direction="row" spacing={1}>
                    <PrimaryButton
                        size="small"
                        btn_color="pink"
                        sx={{ minWidth: 40 }}
                        onClick={(event: React.MouseEvent) => onDeleteBanner(event, props.data)}
                    >
                        <Icon icon="ph:trash" fontSize={20} color="#EB5757" />
                    </PrimaryButton>
                    <PrimaryButton
                        size="small"
                        btn_color="secondary"
                        sx={{ minWidth: 40 }}
                        onClick={(event: React.MouseEvent) => onEditBanner(event, props.data)}
                    >
                        <Icon icon="ph:pencil-simple" fontSize={20} color="#1890FF" />
                    </PrimaryButton>
                </Stack>
            ),
        },
    ];

    const data: AdminBannersItemType[] = useMemo(() => [...Array(1).keys()].map((item) => blankAdminBannerItem), []);
    const [signInDlgState] = useSignInContext();
    const [totalCount, setTotalCount] = useState<number>(0);
    const [pageNum, setPageNum] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(5);
    const [tabledata, setTableData] = useState(data);
    const [showCreateBannerDlg, setShowCreateBannerDlg] = useState<boolean>(false);
    const [showEditBannerDlg, setShowEditBannerDlg] = useState<boolean>(false);
    const [showDeleteBannerDlg, setShowDeleteBannerDlg] = useState<boolean>(false);
    const [id2Edit, setId2Edit] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            setIsLoading(true);
            const _adminBannerList = await getAdminBannerList(pageNum + 1, pageSize, signInDlgState.token);
            if (!unmounted) {
                setTotalCount(_adminBannerList.totalCount);
                setTableData(_adminBannerList.data);
                setIsLoading(false);
            }
        };
        getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [reload, pageNum, pageSize, signInDlgState.token]);

    const onEditBanner = (event: React.MouseEvent, data: AdminBannersItemType) => {
        event.stopPropagation();
        setId2Edit(tabledata.findIndex((value: AdminBannersItemType) => value.id === data.id));
        setShowEditBannerDlg(true);
    };

    const onDeleteBanner = (event: React.MouseEvent, data: AdminBannersItemType) => {
        event.stopPropagation();
        setId2Edit(tabledata.findIndex((value: AdminBannersItemType) => value.id === data.id));
        setShowDeleteBannerDlg(true);
    };

    return (
        <>
            <Stack height="100%" spacing={4}>
                <Stack direction="row" alignItems="flex-end" columnGap={1}>
                    <PrimaryButton
                        size="small"
                        sx={{ paddingX: 3 }}
                        onClick={() => {
                            setShowCreateBannerDlg(true);
                        }}
                    >
                        <Icon icon="ph:plus" fontSize={20} color="white" style={{ marginBottom: 2, marginRight: 4 }} />
                        {`New Banner`}
                    </PrimaryButton>
                </Stack>
                <Table
                    totalCount={totalCount}
                    pageNum={pageNum}
                    pageSize={pageSize}
                    tabledata={tabledata}
                    columns={columns}
                    checkable={false}
                    isLoading={isLoading}
                    height="calc(100% - 40px - 32px)"
                    emptyString="No Listed Banners"
                    setPageNum={setPageNum}
                    setPageSize={setPageSize}
                />
            </Stack>
            <ModalDialog
                open={showCreateBannerDlg}
                onClose={() => {
                    setShowCreateBannerDlg(false);
                }}
            >
                <CreateBanner
                    bannerList={tabledata}
                    onClose={() => {
                        setShowCreateBannerDlg(false);
                    }}
                    handleBannerUpdates={() => setReload(!reload)}
                />
            </ModalDialog>
            <ModalDialog
                open={showEditBannerDlg}
                onClose={() => {
                    setShowEditBannerDlg(false);
                }}
            >
                <EditBanner
                    bannerList={tabledata}
                    banner2Edit={tabledata.length === 0 ? blankAdminBannerItem : tabledata[id2Edit]}
                    onClose={() => {
                        setShowEditBannerDlg(false);
                    }}
                    handleBannerUpdates={() => setReload(!reload)}
                />
            </ModalDialog>
            <ModalDialog
                open={showDeleteBannerDlg}
                onClose={() => {
                    setShowDeleteBannerDlg(false);
                }}
            >
                <DeleteBanner
                    bannerId={tabledata.length === 0 ? 0 : tabledata[id2Edit].id}
                    onClose={() => {
                        setShowDeleteBannerDlg(false);
                    }}
                    handleBannerUpdates={() => setReload(!reload)}
                />
            </ModalDialog>
        </>
    );
};

export default AdminBanners;
