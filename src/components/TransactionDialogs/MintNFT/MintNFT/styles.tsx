import { styled, Button } from '@mui/material';
import { DropzoneArea } from 'material-ui-dropzone';

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

export const SelectBtn = styled(Button)<{ isOpen: boolean }>`
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #f0f1f2;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #0a0b0c;
    .arrow-icon {
        margin-left: 4px;
        transform: ${({ isOpen }) => (isOpen ? 'rotate(-180deg)' : 'rotate(0deg)')};
        transition: transform 200ms linear;
    }
`;
