import { useRouteError, useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export default function ErrorPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = useRouteError() as any;
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="max-w-md w-full rounded-lg shadow-lg p-8 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />

                <h1 className="text-3xl font-bold text-white-900 mb-2">
                    Oops! Something went wrong
                </h1>

                <p className="text-gray-600 mb-6">
                    {error?.statusText || error?.message || "An unexpected error occurred"}
                </p>

                {error?.status && (
                    <p className="text-gray-500 mb-6">
                        Error Code: <span className="font-mono font-bold">{error.status}</span>
                    </p>
                )}

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Home size={18} />
                        Go Home
                    </button>

                </div>
            </div>
        </div>
    );
}