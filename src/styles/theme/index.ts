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
                borderRadius: '12px',
                fontWeight: 500,
                fontSize: '1rem',
                lineHeight: '1.125rem',
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
            },
            contained: {
                backgroundColor: 'var(--color-base)',
            },
            outlined: {
                color: 'var(--color-base)',
            },
        },
    },
};

export default theme;
