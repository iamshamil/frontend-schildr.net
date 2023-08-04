import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import '../assets/css/index.css';
import useConfig from '../hooks/useConfig';

import { dark, light } from '../config/theme';

// ** Declare Theme Provider
const MuiThemeProvider = ({ children }) => {
    const { isDark, user } = useConfig();
    let baseTheme = isDark ? dark : light;
    baseTheme.palette.background.default = user?.color ? user?.color : '#999';
    const theme = createTheme(baseTheme);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default MuiThemeProvider;
