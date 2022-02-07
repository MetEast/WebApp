import { styled, Button } from '@mui/material';
import { BaseButton } from 'src/components/Buttons/styles';

export const FilterButton = styled(Button)`
    background: #e8f4ff;
    padding: 15px 20px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    color: #1890ff;
    ${(props) => props.theme.breakpoints.down('sm')} {
        min-width: 45px !important;
        min-height: 40px !important;
        padding: 10px 5px !important;
    }
`;

export const SortByBtn = styled(Button)<{ isopen: number }>`
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #e8f4ff;
    padding: 13px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    color: #1890ff;
    img {
        width: 20px;
        height: 20px;
        margin-right: 6px;
    }
    .arrow-icon {
        transform: ${({ isopen }) => (isopen ? 'rotate(-180deg)' : 'rotate(0deg)')};
        transition: transform 200ms linear;
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
        min-width: 15px;
        padding: 13px 10px;
    }
`;

export const GridButton = styled(BaseButton)``;
