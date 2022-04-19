import { forwardRef, useCallback } from 'react';
import { useSnackbar, SnackbarContent } from 'notistack';
import { Stack, Typography, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@material-ui/core/styles';
import { Markup } from 'interweave';

export interface ComponentProps {
    id: string | number;
    title?: string;
    message: string;
    variant: 'success' | 'warning' | 'error' | 'info';
    isMarkup?: boolean;
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

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: '0 !important',
    },
}));

const SnackMessage = forwardRef<HTMLDivElement, ComponentProps>(({ id, title, message, variant, isMarkup }, ref) => {
    const classes = useStyles();
    const { closeSnackbar } = useSnackbar();

    const handleDismiss = useCallback(() => {
        closeSnackbar(id);
    }, [id, closeSnackbar]);

    return (
        <SnackbarContent ref={ref} className={classes.root}>
            <Stack
                direction="row"
                alignItems="center"
                padding={2}
                borderRadius={3}
                spacing={1}
                maxWidth={350}
                sx={{ background: variantStyles[variant].backgroundColor }}
            >
                <Icon icon={variantStyles[variant].icon} fontSize={20} color="white" />
                <Stack>
                    {title && (
                        <Typography fontSize={18} fontWeight={700} color="white">
                            {title}
                        </Typography>
                    )}
                    <Typography fontSize={14} fontWeight={500} color="white">
                        <Markup content={message} />
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
