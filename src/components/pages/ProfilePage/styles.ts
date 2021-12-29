import { styled, Typography, Button, Box } from '@mui/material';

export const FilterItemTypography = styled(Typography)`
    border: 1px solid var(--color-base);
    color: var(--color-base);
    border-radius: 8px;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 2px;
    padding-bottom: 2px;
    margin-left: 8px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    line-height: 1rem;
`;

export const FilterButton = styled(Button)<{ selected: boolean }>`
    padding: 0 16px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    background: ${({ selected }) => (selected ? '#e8f4ff' : 'white')};
    color: ${({ selected }) => (selected ? '#1890ff' : 'black')};
    p {
        margin: 8px 0 8px 8px;
        padding: 4px 12px;
        border-radius: 8px;
        background: ${({ selected }) => (selected ? '#1890FF' : '#E8F4FF')};
        color: ${({ selected }) => (selected ? 'white' : '#1890FF')};
    }
`;

export const ProfileImageWrapper = styled(Box)`
    display: grid;
    place-content: center;
    margin-top: -90px;
    position: relative;
    z-index: 10;
`;

export const ProfileImage = styled('img')`
    width: 180px;
    height: 180px;
    padding: 4px;
    border-radius: 50%;
    background: white;
`;

export const ProfilesMainButton = styled(Button)<{ active: boolean }>`
    height: ${({ active }) => (active ? '56px' : '40px')};
    background: ${({ active }) => (active ? '#1890FF' : '#E8F4FF')};
    color: ${({ active }) => (active ? 'white' : '#1890FF')};
    border-radius: ${({ active }) => (active ? '16px' : '12px')};
    padding: ${({ active }) => (active ? '0 32px' : '0 18px')};
    font-size: ${({ active }) => (active ? '18px' : '16px')};
    font-weight: 700;
    &:hover {
        background: ${({ active }) => (active ? '#0870DF' : '#D8E4EF')};
    }
`;
