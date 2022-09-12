import React from 'react';
import { Stack, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { PinkButton } from 'src/components/Buttons/styles';
import { TypeNotification } from 'src/types/notification-types';
import { removeNotifications } from 'src/services/fetch';
import { useNotificationContext } from 'src/context/NotificationContext';
import { Markup } from 'interweave';
import { useSignInContext } from '../../../context/SignInContext';

interface ComponentProps {
    data: TypeNotification;
}

const NotificationItem: React.FC<ComponentProps> = ({ data }): JSX.Element => {
    const [notificationState, setNotificationState] = useNotificationContext();
    const [signInDlgState] = useSignInContext();

    const handleDelete = async () => {
        let unmounted = false;
        const removeNote = async () => {
            const result = await removeNotifications(signInDlgState.token, data._id);
            if (!unmounted && result) {
                const notesList = notificationState.notesList;
                const id = notesList.findIndex((item: TypeNotification) => item._id === data._id);
                notesList.splice(id, 1);
                setNotificationState({
                    ...notificationState,
                    notesUnreadCnt:
                        data.isRead === true ? notificationState.notesUnreadCnt : notificationState.notesUnreadCnt - 1,
                    notesList: notesList,
                });
            }
        };
        removeNote().catch(console.error);
        return () => {
            unmounted = true;
        };
    };

    return (
        <Stack spacing={0.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography fontSize={16} fontWeight={700} sx={{ textTransform: 'capitalize' }} noWrap>
                    {data.title}
                </Typography>
                {!data.isRead && (
                    <Typography
                        fontSize={11}
                        fontWeight={500}
                        color="#1890FF"
                        paddingX={1}
                        paddingTop="2px"
                        paddingBottom="0"
                        border="1px solid #1890FF"
                        borderRadius={2}
                        noWrap
                    >
                        Unread
                    </Typography>
                )}
                <Typography fontSize={14} fontWeight={400} flexGrow={1} textAlign="right">
                    {data.date}
                </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={4}>
                <Typography fontSize={14} fontWeight={400}>
                    <Markup content={data.content} />
                </Typography>
                <PinkButton sx={{ minWidth: 40, height: 32, borderRadius: 2.5 }} onClick={handleDelete}>
                    <Icon icon="ph:trash" color="#EB5757" />
                </PinkButton>
            </Stack>
        </Stack>
    );
};

export default NotificationItem;
