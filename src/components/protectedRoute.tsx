import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

const getToken = () => localStorage.getItem('admin_token');

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = getToken();

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedRoute;