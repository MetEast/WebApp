import { styled, Typography, Box } from '@mui/material';

export const TblHeaderTypo = styled(Typography)({
    fontSize: 14,
    fontWeight: 700,
    textTransform: 'uppercase',
});

export const TblBodyTypo = styled(Typography)({
    fontSize: 16,
    fontWeight: 400,
});

export const MobileImageBox = styled(Box)<{ selected: boolean }>`
    width: 100%;
    padding-top: 75%;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    .image_box {
        position: absolute;
        inset: 0;
        background: gray;
        img { 
            width: 100%;
            height: 100%;
            object-fit: cover;
        },
    }
    .skeleton_box {
        position: absolute;
        inset: 0;
    }
    .check_box {
        position: absolute;
        top: 8px;
        left: 8px;
        place-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: ${({ selected }) => (selected ? 'grid' : 'none')};
        border: ${({ selected }) => (selected ? '1px solid transparent' : '1px solid white')};
        background: ${({ selected }) => (selected ? '#E8F4FF' : '#90909080')};
    },
`;
export const ImageBox = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 72px;
    height: 50px;
    border-radius: 8px;
    overflow: hidden;
    img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 8px;
    }
`;
