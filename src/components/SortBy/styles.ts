import { styled, Box, Button } from '@mui/material';

export const SortByBtn = styled(Button)<{ isOpenned: boolean }>`
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #e8f4ff;
    padding: 13px 20px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    color: #1890ff;
    img {
        width: 20px;
        height: 20px;
        margin-right: 6px;
    }
    .arrow-icon {
        transform: ${({ isOpenned }) => (isOpenned ? 'rotate(-180deg)' : 'rotate(0deg)')};
        transition: transform 200ms linear;
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
        min-width: 15px;
        padding: 13px 10px;
    }
`;

export const ListItemsWrapper = styled(Box)<{ isOpenned: boolean }>`
    display: ${({ isOpenned }) => (isOpenned ? 'block' : 'none')};
    position: absolute;
    background: white;
    border-radius: 4px;
    z-index: 10;
`;
