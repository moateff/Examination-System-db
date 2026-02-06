import { lazy, Suspense } from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Loading, ErrorPage } from "@/shared";
import AppLayout from "@/layouts/AppLayout";
import ProtectedRoutes from "./features/authentication/components/ProtectedRoutes";
import AuthProvider from "./features/authentication/providers/authProvider";

const Login = lazy(() => import("@/features/authentication/pages/Login"));
// Dashboard Pages
const ExaminerDashboard = lazy(() => import("@/features/examiner-dashboard/pages/Dashboard"));
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
                        <ExaminerDashboard />
                    </ProtectedRoutes>
                ),
            },
            {
                path: "exam/:examId",
                element: (
                    <ProtectedRoutes>
                        <ExamPage />
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
        ]
    }
]);

const AppRouter = () => {
    return <RouterProvider router={router} />;
};

export default AppRouter;
