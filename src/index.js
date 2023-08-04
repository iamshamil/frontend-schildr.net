import App from './App';

import {
  Root,
  MuiThemeProvider,
  ConfigProvider,
  TableProvider,
  ToastContainer
} from './providers';

import 'react-toastify/dist/ReactToastify.css';

import { checkAccessToken } from './utilis/auth';

const renderApp = (user) => {
  Root.render(
    <ConfigProvider user={user}>
      <MuiThemeProvider>
        <TableProvider user={user}>
          <App />
          <ToastContainer />
        </TableProvider>
      </MuiThemeProvider>
    </ConfigProvider>
  );
}

(async () => renderApp(await checkAccessToken()))()