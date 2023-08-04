import { lazy } from 'react';
import AuthGuard from './AuthGrid';
// project imports
import Layout from '../layouts';
import FullLayout from '../layouts/Full';
import AuthLayout from '../layouts/Auth';
import Loadable from '../components/Loadable';

const Main = Loadable(lazy(() => import('../pages/Main')));
const Home = Loadable(lazy(() => import('../pages/Home')));
const UserManagement = Loadable(lazy(() => import('../pages/UserManagement')));
const InvoiceManagement = Loadable(lazy(() => import('../pages/Invoice')));
const LandingInvicePage = Loadable(lazy(() => import('../pages/Invoice/LandingPage')));
const View = Loadable(lazy(() => import('../pages/View')));
const Profile = Loadable(lazy(() => import('../pages/Profile')));
const Certified = Loadable(lazy(() => import('../pages/Certified')));
const Login = Loadable(lazy(() => import('../pages/Auth/Login')));
const Register = Loadable(lazy(() => import('../pages/Auth/Register')));

export const MainRoutes = {
    path: '/',
    element: <Layout />,
    children: [
        {
            path: '/',
            element: (
                <AuthGuard >
                    <Home />
                </AuthGuard>
            )
        },
        {
            path: ':projectId',
            element: (
                <AuthGuard >
                    <Main />
                </AuthGuard>
            )
        },
        {
            path: '/profile',
            element: (
                <AuthGuard >
                    <Profile />
                </AuthGuard>
            )
        },
        {
            path: '/users',
            element: (
                <AuthGuard >
                    <UserManagement />
                </AuthGuard>
            )
        },
        {
            path: '/invoices',
            element: (
                <AuthGuard >
                    <InvoiceManagement />
                </AuthGuard>
            )
        }
    ]
};

export const InviteRoutes = {
    path: '/view',
    element: <FullLayout />,
    children: [
        {
            path: ':id',
            element: (
                <View />
            )
        },
        {
            path: 'invoice/:invoiceId',
            element: (
                <LandingInvicePage />
            )
        },
    ]
};

export const OpenInvoiceRoutes = {
    path: '/invoice',
    element: <FullLayout />,
    children: [
        {
            path: ':invoiceId',
            element: (
                <LandingInvicePage />
            )
        },
    ]
};

export const CertifiedRoutes = {
    path: '/certified',
    element: <FullLayout />,
    children: [
        {
            path: ':certificationId',
            element: (
                <Certified />
            )
        },
    ]
};

export const AuthRoutes = {
    path: '/auth',
    element: <AuthLayout />,
    children: [
        {
            path: 'login',
            element: <Login />
        },
        {
            path: 'signup',
            element: <Register />
        }
    ]
}
