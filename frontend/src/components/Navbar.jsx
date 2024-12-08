import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure want to logout?");
        if (confirmLogout) {
            localStorage.removeItem("token");
            localStorage.removeItem("isLoggedIn");

            navigate("/");
        }
    };

    return (
        <nav className="bg-indigo-600 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <Link
                        to="/home"
                        className="text-white text-xl font-bold hover:text-gray-200 transition"
                    >
                        Inventory Management
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <Link
                        to="/home"
                        className="text-white text-sm hover:text-gray-200 transition"
                    >
                        Home
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white text-sm px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
