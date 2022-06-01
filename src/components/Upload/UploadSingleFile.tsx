// import { isString } from 'lodash';
// import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
// material
import { styled } from '@mui/material/styles';
import { Box, Typography, Stack } from '@mui/material';
import { SxProps } from '@mui/system';
import { Icon } from '@iconify/react';
import { ImageBox } from './styles';

// utils
// import { fData } from '../../utils/formatNumber';
//
// import { UploadIllustration } from '../../assets';

// ----------------------------------------------------------------------

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

const UploadSingleFile: React.FC<ComponentProps> = ({ error, file, sx, ...other }): JSX.Element => {
    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        // , fileRejections
        multiple: false,
        ...other,
    });

    return (
        <Box sx={{ width: '100%', background: file ? 'none' : '#E8F4FF', ...sx }}>
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
                {file ? (
                    <ImageBox sx={{ justifyContent: 'center' }}>
                        <img src={file.preview} alt="" />
                    </ImageBox>
                ) : (
                    <Stack justifyContent="center" alignItems="center">
                        <Typography fontSize={14} fontWeight={500} color="#1890FF">
                            File types supported:PNG,JPEG,JPG,GIF
                        </Typography>
                        <Icon icon="ph:cloud-arrow-up" fontSize={24} color="#1890FF" />
                        <Typography fontSize={14} fontWeight={500} color="#1890FF">
                            Upload Image
                        </Typography>
                    </Stack>
                )}
            </DropZoneStyle>

            {/* {fileRejections.length > 0 && <ShowRejectionItems />} */}
        </Box>
    );
};

export default UploadSingleFile;
