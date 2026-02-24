import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER"
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/api/users/register", form);
            navigate("/login");
        } catch (err) {
            console.error(err.response?.data);
            alert("Registration Failed");
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="bg-gray-950 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">
                <h2 className="text-3xl font-bold text-white text-center mb-6">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold p-3 rounded-lg"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-gray-400 text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;