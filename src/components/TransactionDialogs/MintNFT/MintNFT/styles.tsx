import { styled, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DropzoneArea } from 'material-ui-dropzone';

export const useStyles = makeStyles((theme: any) => ({
    container: {
        '&::-webkit-scrollbar': {
            width: 36,
        },
        '&::-webkit-scrollbar-thumb': {
            border: '14px solid rgba(0, 0, 0, 0)',
            backgroundClip: 'padding-box',
            borderRadius: '9999px',
            backgroundColor: '#AAAAAA',
        },
    },
}));

export const CustomeDropzoneArea = styled(DropzoneArea)`
    width: "100%";
    height: 112;
    justifyContent: "center";
    alignItems="center" ;
    marginTop: 1;
    borderRadius: 2;
    background: '#E8F4FF';
    cursor: 'pointer';
`;

export const SelectBtn = styled(Button)<{ isopen: number }>`
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #f0f1f2;
    font-size: 14px;
    font-weight: 500;
    color: #0a0b0c;
    .arrow-icon {
        margin-left: 4px;
        transform: ${({ isopen }) => (isopen ? 'rotate(-180deg)' : 'rotate(0deg)')};
        transition: transform 200ms linear;
    }
`;
