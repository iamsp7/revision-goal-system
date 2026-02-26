import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/api";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const validate = () => {
        let newErrors = {};

        if (!form.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
            newErrors.password = "Minimum 6 characters required";
        }

        return newErrors;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setSubmitting(true);
            const res = await API.post("/api/users/login", form);
            localStorage.setItem("token", res.data.token);
            navigate("/");
        } catch (err) {
            setErrors({ general: "Invalid credentials" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] px-6">

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md border border-[#2E3A59] rounded-2xl overflow-hidden"
            >
                {/* Accent Strip */}
                <div className="h-2 bg-indigo-600"></div>

                <div className="bg-[#1E293B] p-10">

                    <h2 className="text-3xl font-bold text-white mb-2">
                        Welcome Back
                    </h2>

                    <p className="text-gray-400 mb-8">
                        Sign in to continue your smart revision journey.
                    </p>

                    {errors.general && (
                        <p className="text-red-400 mb-6 text-sm">
                            {errors.general}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email */}
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className={`w-full px-4 py-3 rounded-lg bg-[#0B0F1A] text-white placeholder-gray-500 border ${errors.email
                                    ? "border-red-500"
                                    : "border-[#2E3A59]"
                                    } focus:outline-none focus:border-indigo-500 transition`}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-2">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={`w-full px-4 py-3 rounded-lg bg-[#0B0F1A] text-white placeholder-gray-500 border ${errors.password
                                    ? "border-red-500"
                                    : "border-[#2E3A59]"
                                    } focus:outline-none focus:border-indigo-500 transition`}
                            />
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-2">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={submitting}
                            className={`w-full font-semibold py-3 rounded-lg transition ${submitting
                                ? "bg-indigo-800 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-800/40"
                                }`}
                        >
                            {submitting ? "Signing In..." : "Sign In"}
                        </motion.button>

                    </form>

                    <p className="text-gray-400 text-center mt-8 text-sm">
                        Don’t have an account?{" "}
                        <Link
                            to="/register"
                            className="text-indigo-400 hover:text-indigo-300 transition"
                        >
                            Create one
                        </Link>
                    </p>

                </div>
            </motion.div>

        </div>
    );
}

export default Login;