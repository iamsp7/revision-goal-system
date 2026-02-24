import { useNavigate } from "react-router-dom";
import PdfUpload from "../components/PdfUpload";

function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">

            {/* Sidebar */}
            <div className="w-64 bg-gray-950 border-r border-gray-800 p-6 hidden md:block">
                <h2 className="text-2xl font-bold mb-8 text-blue-500">
                    StudyBeacon
                </h2>

                <ul className="space-y-4">
                    <li className="hover:text-blue-400 cursor-pointer">Dashboard</li>
                    <li className="hover:text-blue-400 cursor-pointer">Upload PDF</li>
                    <li className="hover:text-blue-400 cursor-pointer">My MCQs</li>
                    <li className="hover:text-blue-400 cursor-pointer">Profile</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">

                {/* Top Navbar */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Dashboard</h1>

                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Welcome Card */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-2">
                        Welcome Back 🚀
                    </h2>
                    <p className="text-gray-400">
                        Upload study material and generate AI-powered MCQs instantly.
                    </p>
                </div>

                {/* PDF Upload Section */}
                <PdfUpload />

            </div>
        </div>
    );
}

export default Dashboard;