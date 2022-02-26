import { useDropzone } from 'react-dropzone';
// material
import { styled } from '@mui/material/styles';
import { Box, Typography, Stack } from '@mui/material';
import { SxProps } from '@mui/system';
import { Icon } from '@iconify/react';

const DropZoneStyle = styled('div')(({ theme }) => ({
    outline: 'none',
    display: 'flex',
    overflow: 'hidden',
    textAlign: 'center',
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    // padding: theme.spacing(5, 0),
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create('padding'),
    // backgroundColor: theme.palette.background.neutral,
    // border: `1px dashed ${theme.palette.grey[500_32]}`,
    '&:hover': {
        opacity: 0.72,
        cursor: 'pointer',
    },
    [theme.breakpoints.up('md')]: { textAlign: 'left', flexDirection: 'row' },
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
                {!file && (
                    <Stack justifyContent="center" alignItems="center">
                        <Icon icon="ph:user" fontSize={80} color="#1890FF" />
                    </Stack>
                )}
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
            </DropZoneStyle>
        </Box>
    );
};

export default UserAvatarBox;
