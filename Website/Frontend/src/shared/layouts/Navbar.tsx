import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, Menu, X, User, Mail, Shield } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { logout } from "@/features/authentication/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const dropdownRef = useRef<HTMLLIElement>(null);

    const getRoleLabel = (role: string) => {
        switch (role) {
            case "S": return "Student";
            case "A": return "Admin";
            case "I": return "Instructor";
            case "P": return "Applicant";
            default: return "User";
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "S": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "A": return "bg-red-500/10 text-red-500 border-red-500/20";
            case "I": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "P": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    const isActive = (path: string) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    const handleLogout = async () => {
        await dispatch(logout());
        navigate("/authentication/login");
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="w-full bg-white border-b border-border-primary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img src="/iti-logo.png" alt="logo" className="h-12" loading="lazy" />
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Desktop Menu */}
                        <ul className="hidden md:flex items-center gap-4 lg:gap-8">


                            {user ? (
                                <li className="relative" ref={dropdownRef}>
                                    <button
                                        className="flex items-center gap-1 text-sm font-medium text-font-gray hover:text-font-white transition"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                    >
                                        Hello, {user.username || "User"} <ChevronDown className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {dropdownOpen && (
                                        <ul className="absolute right-0 mt-2 w-64 bg-primary border border-border-primary rounded-md shadow-lg overflow-hidden z-50">
                                            {/* User Info Section */}
                                            <li className="px-4 py-3 border-b border-border-primary bg-secondary/30">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                                                        <User className="w-5 h-5 text-red-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-font-white truncate">
                                                            {user.fName} {user.lName}
                                                        </p>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${getRoleBadgeColor(user.role)}`}>
                                                                {getRoleLabel(user.role)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>

                                            {/* Email Section */}
                                            <li className="px-4 py-2.5 border-b border-border-primary">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-font-gray shrink-0" />
                                                    <span className="text-xs text-font-gray truncate" title={user.email}>
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </li>

                                            {/* Actions */}
                                            <li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-font-gray hover:bg-secondary hover:text-font-white transition"
                                                >
                                                    <LogOut className="w-4 h-4" /> Logout
                                                </button>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            ) : (
                                <></>
                            )}
                        </ul>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-font-gray p-2 rounded-full hover:bg-secondary transition"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle menu"
                    >
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden bg-primary border-t border-border-primary">
                    <div className="px-4 pt-2 pb-4 space-y-2">


                        {user ? (
                            <>
                                <div className="border-t border-border-primary pt-2"></div>

                                {/* Mobile User Info */}
                                <div className="px-3 py-3 bg-secondary/30 rounded-md mb-2">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-font-white truncate">
                                                {user.fName} {user.lName}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <Shield className="w-3 h-3 text-font-gray" />
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getRoleBadgeColor(user.role)}`}>
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-2">
                                                <Mail className="w-3 h-3 text-font-gray" />
                                                <span className="text-xs text-font-gray truncate">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to="/dashboard"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-font-gray hover:text-font-white hover:bg-secondary/30 flex items-center gap-2"
                                    onClick={() => setOpen(false)}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>

                                <button
                                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-font-gray hover:text-font-white hover:bg-secondary/30 flex items-center gap-2"
                                    onClick={() => { handleLogout(); setOpen(false); }}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/authentication/login"
                                className={`block px-3 py-2 rounded-md text-base font-medium transition 
                  ${isActive("/authentication/login")
                                        ? "text-font-primary bg-secondary"
                                        : "text-font-gray hover:text-font-white hover:bg-secondary/30"
                                    }`}
                                onClick={() => setOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
