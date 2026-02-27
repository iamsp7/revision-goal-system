import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import StudyBeacon from "../assets/StudyBeacon.png";
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
                <div
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    {/* Logo */}
                    <img
                        src={StudyBeacon}
                        alt="StudyBeacon Logo"
                        className="w-10 h-10 object-contain"
                    />

                    {/* Text */}
                    <h2 className="text-2xl font-bold text-white tracking-tight transition group-hover:text-indigo-400">
                        StudyBeacon
                    </h2>
                </div>

                {/* Links */}
                <div className="flex items-center gap-3">

                    {[

                        { label: "Subjects", path: "/subjects" },
                        { label: "My MCQs", path: "/my-mcqs" },
                        { label: "Quiz", path: "/quiz" },
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