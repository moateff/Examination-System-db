import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { Loading } from '@/shared'; // Assuming Loading component exists

interface ProtectedRoutesProps {
    allowedRoles?: string[];
    children?: React.ReactNode;
}

const ProtectedRoutes = ({ allowedRoles, children }: ProtectedRoutesProps) => {
    const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (loading) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/authentication/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to unauthorized page or dashboard if role doesn't match
        // For now, redirecting to login or home
        return <Navigate to="/authentication/login" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoutes;
