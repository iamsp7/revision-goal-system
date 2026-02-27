import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/api";
import StudyBeacon from "../assets/StudyBeacon.png";

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
            const token = res.data.token;

            localStorage.setItem("token", token);

            navigate("/dashboard");

        } catch (err) {
            setErrors({ general: "Invalid credentials" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#0B0F1A]">

            {/* LEFT FORM AREA */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 relative overflow-hidden">

                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 80, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute w-full max-w-md bg-[#111827] border border-[#1F2937] rounded-2xl p-10 shadow-xl"
                >
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
                                className={`w-full px-4 py-3 rounded-lg bg-[#0B0F1A] text-white border ${errors.email ? "border-red-500" : "border-gray-700"
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-2">
                                    {errors.email}
                                </p>
                            )}
                        </div>

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
                                className={`w-full px-4 py-3 rounded-lg bg-[#0B0F1A] text-white border ${errors.password ? "border-red-500" : "border-gray-700"
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
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
                            className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold transition shadow-md shadow-indigo-900/40"
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
                </motion.div>
            </div>

            {/* RIGHT HERO */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-indigo-800 to-[#0B0F1A]" />
                <div className="relative z-10 flex flex-col justify-center px-20 text-white">
                    <h1 className="text-5xl font-extrabold mb-6">
                        StudyBeacon
                    </h1>
                    <p className="text-lg text-indigo-200 max-w-md">
                        Track progress. Identify weak topics. Master concepts smarter.
                        Your AI-powered revision partner.
                    </p>
                </div>
                <div className="absolute bottom-0 w-full h-40 bg-[#0B0F1A] rounded-t-[100%]" />
            </div>

        </div>
    );
}

export default Login;