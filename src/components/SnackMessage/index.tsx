import React, { forwardRef, useCallback } from 'react';
import { useSnackbar, SnackbarContent } from 'notistack';
import { Stack, Typography, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import CloseIcon from '@mui/icons-material/Close';

export interface ComponentProps {
    id: string | number;
    title?: string;
    message: string | React.ReactNode;
    variant: 'success' | 'warning' | 'error' | 'info';
}

const variantStyles = {
    success: {
        backgroundColor: '#1EA557',
        icon: 'ph:confetti',
    },
    warning: {
        backgroundColor: '#E0822C',
        icon: 'ph:warning',
    },
    error: {
        backgroundColor: '#EB5757',
        icon: 'ph:x-square',
    },
    info: {
        backgroundColor: '#1890FF',
        icon: 'ph:info',
    },
};

const SnackMessage = forwardRef<HTMLDivElement, ComponentProps>(({ id, title, message, variant }, ref) => {
    const { closeSnackbar } = useSnackbar();

    const handleDismiss = useCallback(() => {
        closeSnackbar(id);
    }, [id, closeSnackbar]);

    return (
        <SnackbarContent ref={ref}>
            <Stack
                direction="row"
                alignItems="center"
                padding={2}
                borderRadius={3}
                spacing={1}
                maxWidth={350}
                sx={{ background: variantStyles[variant].backgroundColor }}
            >
                <Icon icon={variantStyles[variant].icon} fontSize={32} color="white" />
                <Stack>
                    {title && (
                        <Typography fontSize={18} fontWeight={700} color="white">
                            {title}
                        </Typography>
                    )}
                    <Typography fontSize={14} fontWeight={500} color="white">
                        {message}
                    </Typography>
                </Stack>
                <IconButton onClick={handleDismiss}>
                    <CloseIcon style={{ color: 'white' }} />
                </IconButton>
            </Stack>
        </SnackbarContent>
    );
});

export default SnackMessage;
