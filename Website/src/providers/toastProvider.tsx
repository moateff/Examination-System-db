import { Toaster } from 'react-hot-toast';
import type React from 'react';

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={12}
                toastOptions={{
                    // Default options
                    duration: 4000,
                    style: {
                        background: '#131720',
                        color: '#F8FAFC',
                        border: '1px solid #222A3A',
                        borderRadius: '0.5rem',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        padding: '12px 16px',
                    },
                    // Default options for specific types
                    success: {
                        duration: 4000,
                        style: {
                            background: '#131720',
                            color: '#F8FAFC',
                            border: '1px solid #10B981',
                            borderRadius: '0.5rem',
                        },
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#F8FAFC',
                        },
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: '#131720',
                            color: '#F8FAFC',
                            border: '1px solid #EF4444',
                            borderRadius: '0.5rem',
                        },
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#F8FAFC',
                        },
                    },
                    loading: {
                        duration: Infinity,
                        style: {
                            background: '#131720',
                            color: '#F8FAFC',
                            border: '1px solid #FA890F',
                            borderRadius: '0.5rem',
                        },
                        iconTheme: {
                            primary: '#FA890F',
                            secondary: '#F8FAFC',
                        },
                    },
                }}
            />
            {children}
        </>
    );
};

export default ToastProvider;
