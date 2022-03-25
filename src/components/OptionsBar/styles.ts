import { styled, Button, Box } from '@mui/material';
import { BaseButton } from 'src/components/Buttons/styles';

export const FilterButton = styled(Button)`
    min-width: 40px;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #e8f4ff;
    padding: 0 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    color: #1890ff;
    :focus {
        background: #e8f4ff;
    }
    ${(props) => props.theme.breakpoints.down('md')} {
        justify-content: center;
        padding: 0;
    }
`;

export const FiltersBox = styled(Box)`
    position: absolute;
    top: 40px;
    right: 0;
    padding-top: 8px;
    z-index: 10;
    ${(props) => props.theme.breakpoints.down('sm')} {
        width: 100vw;
        height: 100vh;
        padding-top: 0;
        position: fixed;
        inset: 0;
        z-index: 30;
    }
`;

export const SortByBtn = styled(Button)<{ isopen: number }>`
    min-width: 40px;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #e8f4ff;
    padding: 0 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    color: #1890ff;
    :focus {
        background: #e8f4ff;
    }
    .arrow-icon {
        transform: ${({ isopen }) => (isopen ? 'rotate(-180deg)' : 'rotate(0deg)')};
        transition: transform 200ms linear;
    }
    ${(props) => props.theme.breakpoints.down('md')} {
        justify-content: center;
        padding: 0;
    }
`;

export const GridButton = styled(BaseButton)<{ selected: boolean }>`
    min-width: 40px;
    color: ${({ selected }) => (selected ? 'white' : '#1890ff')};
    background: ${({ selected }) => (selected ? '#1890ff' : '#e8f4ff')};
    :focus {
        background: #1890ff;
    }
`;
