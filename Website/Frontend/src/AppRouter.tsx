import { lazy, Suspense } from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Loading, ErrorPage } from "@/shared";
import AppLayout from "@/layouts/AppLayout";
import ProtectedRoutes from "./features/authentication/components/ProtectedRoutes";
import AuthProvider from "./features/authentication/providers/authProvider";
import RoleBasedRedirect from "./features/shared/RoleBasedRedirect";

const Login = lazy(() => import("@/features/authentication/pages/Login"));
// Dashboard Pages
const ExaminerDashboard = lazy(() => import("@/features/examiner-dashboard/pages/Dashboard"));
const AdminDashboard = lazy(() => import("@/features/admin-dashboard/pages/Dashboard"));
const InstructorDashboard = lazy(() => import("@/features/instructor-dashboard/pages/Dashboard"));
const ExamPage = lazy(() => import("@/features/examiner-dashboard/pages/ExamPage"));

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Suspense fallback={<Loading />}>
                <AuthProvider>
                    <AppLayout />
                </AuthProvider>
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoutes>
                        <RoleBasedRedirect />
                    </ProtectedRoutes>
                ),
            },
            {
                path: "examiner/dashboard",
                element: (
                    <ProtectedRoutes allowedRoles={["S", "P"]}>
                        <ExaminerDashboard />
                    </ProtectedRoutes>
                ),
            },
            {
                path: "admin/dashboard",
                element: (
                    <ProtectedRoutes allowedRoles={["A"]}>
                        <AdminDashboard />
                    </ProtectedRoutes>
                ),
            },
            {
                path: "instructor/dashboard",
                element: (
                    <ProtectedRoutes allowedRoles={["I"]}>
                        <InstructorDashboard />
                    </ProtectedRoutes>
                ),
            },
            {
                path: "authentication",
                element: (
                    <Outlet />
                ),
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: "login",
                        element: <Login />,
                    }
                ]
            }
        ],
    },
    {
        path: "exam/:courseId/:examId",
        element: (
            <ProtectedRoutes allowedRoles={["S", "P"]}>
                <ExamPage />
            </ProtectedRoutes>
        ),
    },

]);

const AppRouter = () => {
    return <RouterProvider router={router} />;
};

export default AppRouter;
