import { Outlet } from "react-router-dom";
import { Navbar } from "@/shared/";

export default function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <Outlet />
        </div>
    )
}
