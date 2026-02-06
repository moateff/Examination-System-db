import { Settings } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center bg-card-primary border border-border-primary rounded-2xl p-12 shadow-lg">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary rounded-full mb-6">
                        <Settings size={40} className="text-font-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-font-white mb-4">
                        Admin Dashboard
                    </h1>
                    <p className="text-xl text-font-gray mb-2">
                        Coming Soon
                    </p>
                    <p className="text-sm text-font-gray max-w-md mx-auto">
                        The admin dashboard is currently under development.
                        You'll be able to manage users, courses, and system settings here.
                    </p>
                </div>
            </div>
        </div>
    );
}
