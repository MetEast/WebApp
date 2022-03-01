import React, { useState, useMemo } from 'react';
import { Stack } from '@mui/material';
import { AdminTableColumn, AdminBidsItemType } from 'src/types/admin-table-data-types';
import Table from 'src/components/Admin/Table';
import CustomTextField from 'src/components/TextField';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { Icon } from '@iconify/react';

const AdminUsers: React.FC = (): JSX.Element => {
    return (
        <Stack height="100%" spacing={4}>
            <Stack direction="row" alignItems="flex-end" columnGap={1}>
                <CustomTextField placeholder="Search anything..." sx={{ width: 320 }} />
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
        </Stack>
    );
};

export default AdminUsers;
