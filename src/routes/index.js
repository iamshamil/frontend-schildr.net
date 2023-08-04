import { useRoutes, Navigate } from 'react-router-dom';

// routes
import { MainRoutes, InviteRoutes, AuthRoutes, CertifiedRoutes, OpenInvoiceRoutes } from './MainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([MainRoutes, InviteRoutes, AuthRoutes, OpenInvoiceRoutes, CertifiedRoutes, { path: '*', element: <Navigate to="/auth/login" /> }]);
}
