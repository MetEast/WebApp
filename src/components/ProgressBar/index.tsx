import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Container } from '@mui/material';

import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const useStyles = makeStyles({
    bar: {
        transitionDuration: `100ms`,
    },
    container: () => ({
        position: 'fixed',
        top: 0,
        width: '100%',
        maxWidth: 'unset',
        padding: 0,
        zIndex: 100000,
        pointerEvents: 'none',
        transition: `opacity 100ms linear`,
    }),
});

const BorderProgressBar = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    borderRadius: 1,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 1,
        backgroundColor: theme.palette.mode === 'light' ? '#FF5082' : '#308fe8',
    },
}));

interface ProgressBarProps {
    isFinished: boolean;
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isFinished, progress }) => {
    const classes = useStyles({ isFinished });

    return (
        <Container classes={{ root: classes.container }} sx={{ opacity: isFinished ? 0 : 1 }}>
            <BorderProgressBar value={progress} variant="determinate" />
        </Container>
    );
};
export default ProgressBar;
