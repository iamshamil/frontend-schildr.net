import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';

import MuiThemeProvider from './theme';
import ConfigProvider from './config';
import TableProvider from './table';

const Root = createRoot(document.getElementById('app-root'));

export {
    Root,
    MuiThemeProvider,
    ConfigProvider,
    TableProvider,
    ToastContainer
};
