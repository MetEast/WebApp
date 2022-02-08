// import { isString } from 'lodash';
// import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
// material
import { styled } from '@mui/material/styles';
import { Box, Typography, Stack } from '@mui/material';
import { SxProps } from '@mui/system';
import { Icon } from '@iconify/react';

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
  padding: theme.spacing(5, 0),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  // backgroundColor: theme.palette.background.neutral,
  // border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': {
    opacity: 0.72,
    cursor: 'pointer'
  },
  [theme.breakpoints.up('md')]: { textAlign: 'left', flexDirection: 'row' }
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
    ...other
  });

  // const ShowRejectionItems = () => (
  //   <Paper
  //     variant="outlined"
  //     sx={{
  //       py: 1,
  //       px: 2,
  //       mt: 3,
  //       borderColor: 'error.light',
  //       bgcolor: (theme) => alpha(theme.palette.error.main, 0.08)
  //     }}
  //   >
  //     {/* {fileRejections.map(({ file, errors }) => {
  //       const { path, size } = file;
  //       return (
  //         <Box key={path} sx={{ my: 1 }}>
  //           <Typography variant="subtitle2" noWrap>
  //             {path} - {fData(size)}
  //           </Typography>
  //           {errors.map((e) => (
  //             <Typography key={e.code} variant="caption" component="p">
  //               - {e.message}
  //             </Typography>
  //           ))}
  //         </Box>
  //       );
  //     })} */}
  //   </Paper>
  // );

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter'
          }),
          ...(file && { padding: '12% 0' })
        }}
      >
        <input {...getInputProps()} />

        {/* <UploadIllustration sx={{ width: 220 }} /> */}

        {/* <Box sx={{ p: 3, ml: { md: 2 } }}>
          <Typography gutterBottom variant="h5">
            Drop or Select file
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Drop files here or click&nbsp;
            <Typography variant="body2" component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>
              browse
            </Typography>
            &nbsp;thorough your machine
          </Typography>
        </Box> */}
        <Stack
          justifyContent="center"
          alignItems="center"
        >
          <Icon icon="ph:cloud-arrow-up" fontSize={24} color="#1890FF" />
          <Typography fontSize={14} fontWeight={500} color="#1890FF">
              Upload Image
          </Typography>
        </Stack> 

        {file && (
          <Box
            component="img"
            alt="file preview"
            src={file.preview}
            // src={isString(file) ? file : file.preview}
            sx={{
              width:"100%",
              height:"100%",
              borderRadius: "2vw",
              objectFit: 'cover',
              position: 'absolute',
            }}
          />
        )}
      </DropZoneStyle>

      {/* {fileRejections.length > 0 && <ShowRejectionItems />} */}
    </Box>
  );
}

export default UploadSingleFile;
