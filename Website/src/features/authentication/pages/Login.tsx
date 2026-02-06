import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux'; // Assuming standard hooks usage or I should use typed hooks from store
import { useNavigate } from 'react-router-dom';
import { loginUser, loginDummyUser } from '../slices/authSlice';
import { type AppDispatch, type RootState } from '@/store'; // Need to check if RootState is exported from store/index
import { z } from 'zod'; // zod is in dependencies
import { zodResolver } from '@hookform/resolvers/zod';

// Define schema
const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'), // Password requirements can be added here
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = (data: LoginFormInputs) => {
        dispatch(loginUser(data));
    };

    return (
        <div className="flex h-[90vh] items-center justify-center relative overflow-hidden">
            {/* Background decoration possible here if needed */}
            <div className="absolute top-0 left-0 w-full h-full bg-primary -z-10"></div>

            <div className="w-full max-w-md p-8 bg-card-primary rounded-2xl border border-border-primary orange-glow fade-in z-10">
                <h2 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-[image:var(--color-text-linear)]">
                    Welcome Back
                </h2>
                <p className="text-center text-font-gray mb-8">
                    Enter your credentials to access the exams
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-font-gray mb-1">
                            Username
                        </label>
                        <input
                            {...register('username')}
                            type="text"
                            className={`w-full px-4 py-3 bg-secondary border ${errors.username ? 'border-red-500' : 'border-border-primary'
                                } rounded-lg text-font-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-btn-primary-color1 transition-all duration-200`}
                            placeholder="Enter your username"
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-font-gray mb-1">
                            Password
                        </label>
                        <input
                            {...register('password')}
                            type="password"
                            className={`w-full px-4 py-3 bg-secondary border ${errors.password ? 'border-red-500' : 'border-border-primary'
                                } rounded-lg text-font-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-btn-primary-color1 transition-all duration-200`}
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-[var(--color-btn-primary-color1)] to-[var(--color-btn-primary-color2)] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btn-primary-color1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                {/* Simple Spinner */}
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            'Login'
                        )}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border-primary"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-card-primary text-font-gray">Or for testing</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => dispatch(loginDummyUser())}
                        className="w-full py-3 px-4 bg-secondary border border-border-primary text-font-gray hover:text-font-primary hover:border-font-primary font-semibold rounded-lg shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-font-primary"
                    >
                        Test Login (Admin Access)
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
