import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../utilis/auth';

const AuthGuard = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!getSession()) {
            navigate('/auth/login', { replace: true });
        }
        //eslint-disable-next-line
    }, []);

    return children;
};

export default AuthGuard;
