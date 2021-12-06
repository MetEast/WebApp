import { createTheme, ThemeOptions } from '@mui/material';

const themeOptions: ThemeOptions = {};

const theme = createTheme(themeOptions);

theme.components = {
    MuiTypography: {
        styleOverrides: {
            root: {
                color: 'black',
            },
        },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                textTransform: 'none',
            },
        },
    },
};

export default theme;
