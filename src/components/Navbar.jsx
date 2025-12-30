import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, PlusCircle, LayoutDashboard } from "lucide-react";

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
            navigate("/login");
        } catch {
            console.error("Failed to log out");
        }
    }

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-primary">
                            <LayoutDashboard size={24} />
                            <span>IssueBoard</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-slate-600 hidden md:block">
                            {currentUser?.email}
                        </div>

                        <Link to="/create-issue" className="btn btn-primary flex items-center gap-2 text-sm">
                            <PlusCircle size={18} />
                            <span className="hidden sm:inline">New Issue</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-500 hover:text-danger transition-colors rounded-full hover:bg-slate-50"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
