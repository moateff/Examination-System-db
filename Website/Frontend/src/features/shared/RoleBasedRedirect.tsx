import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { Loading } from '@/shared';
import { UserRole } from '../authentication/types';

export default function RoleBasedRedirect() {
    const navigate = useNavigate();
    const { user, loading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!loading && user) {
            switch (user.role) {
                case UserRole.ADMIN:
                    navigate('/admin/dashboard', { replace: true });
                    break;
                case UserRole.INSTRUCTOR:
                    navigate('/instructor/dashboard', { replace: true });
                    break;
                case UserRole.STUDENT:
                case UserRole.APPLICANT:
                    navigate('/examiner/dashboard', { replace: true });
                    break;
                default:
                    navigate('/authentication/login', { replace: true });
            }
        }
    }, [user, loading, navigate]);

    return <Loading />;
}
