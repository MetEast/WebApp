import { useDropzone } from 'react-dropzone';
// material
import { styled } from '@mui/material/styles';
import { Box, Typography, Stack } from '@mui/material';
import { SxProps } from '@mui/system';
import { Icon } from '@iconify/react';

const DropZoneStyle = styled('div')(({ theme }) => ({
    outline: 'none',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: theme.transitions.create('padding'),
    '.hover_box_container': {
        position: 'absolute',
        width: '100%',
        paddingTop: '100%',
        background: '#1890FF',
        cursor: 'pointer',
        opacity: 0,
        '&:hover': {
            opacity: 0.8,
        },
        '.hover_box': {
            position: 'absolute',
            inset: 0,
            alignItems: 'center',
            justifyContent: 'center',
        },
    },
}));

// ----------------------------------------------------------------------
type DropEvent = React.DragEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement> | DragEvent | Event;

interface ComponentProps {
    error?: boolean;
    file: File | string | any;
    sx?: SxProps;
    onDrop?<T extends File>(acceptedFiles: T[], rejectedFiles: T[], event: DropEvent): void;
}

const UserAvatarBox: React.FC<ComponentProps> = ({ error, file, sx, ...other }): JSX.Element => {
    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        // , fileRejections
        multiple: false,
        ...other,
    });

    return (
        <Box sx={{ width: '100%', ...sx }}>
            <DropZoneStyle
                {...getRootProps()}
                sx={{
                    width: '100%',
                    height: '100%',
                    ...(isDragActive && { opacity: 0.72 }),
                    ...((isDragReject || error) && {
                        color: 'error.main',
                        borderColor: 'error.light',
                        bgcolor: 'error.lighter',
                    }),
                    // ...(file && { padding: '12% 0' }),
                }}
            >
                <input name="imgFile" {...getInputProps()} />
                {!file && <Icon icon="ph:user" fontSize={80} color="#1890FF" />}
                {file && (
                    <Box
                        component="img"
                        alt="file preview"
                        src={file.preview}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                )}
                <Box className="hover_box_container">
                    <Stack className="hover_box" spacing={0.5}>
                        <Icon icon="ph:pencil-simple" fontSize={40} color="white" />
                        <Typography fontSize={32} fontWeight={700} color="white">
                            Edit
                        </Typography>
                    </Stack>
                </Box>
            </DropZoneStyle>
        </Box>
    );
};

export default UserAvatarBox;
