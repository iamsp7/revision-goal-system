import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-[#0B0F1A] border-b border-[#2E3A59]">

            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

                {/* Logo */}
                <h2
                    onClick={() => navigate("/dashboard")}
                    className="text-2xl font-bold text-white cursor-pointer tracking-tight hover:text-indigo-400 transition"
                >
                    StudyBeacon
                </h2>

                {/* Links */}
                <div className="flex items-center gap-3">

                    {[
                        { label: "Dashboard", path: "/dashboard" },
                        { label: "Subjects", path: "/subjects" },
                        { label: "My MCQs", path: "/my-mcqs" },
                    ].map((item) => (
                        <motion.button
                            key={item.path}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate(item.path)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                ${isActive(item.path)
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-800/30"
                                    : "text-gray-300 hover:bg-[#1E293B] hover:text-white"
                                }`}
                        >
                            {item.label}
                        </motion.button>
                    ))}

                    {/* Logout */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="ml-4 flex items-center gap-2 bg-[#1E293B] hover:bg-indigo-600 px-4 py-2 rounded-lg transition text-sm font-medium border border-[#2E3A59]"
                    >
                        <LogOut size={16} />
                        Logout
                    </motion.button>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;