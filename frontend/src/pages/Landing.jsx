import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, Target, TrendingUp } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import Tilt from "react-parallax-tilt";
import { useRef } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import logo from "../assets/logo.png";

function Landing() {
    const navigate = useNavigate();
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    // ✅ FIXED PARTICLES (No more loadFull error)
    const particlesInit = async (engine) => {
        await loadSlim(engine);
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div ref={ref} className="relative bg-[#0B0F1A] text-white overflow-hidden">

            {/* ================= NAVBAR ================= */}
            <nav className="sticky top-0 z-50 bg-[#0B0F1A] border-b border-[#2E3A59] px-6 lg:px-16 py-4 flex justify-between items-center">

                {/* Logo + Brand */}
                <div
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <img
                        src={logo}
                        alt="StudyBeacon Logo"
                        className="w-10 h-10 object-contain"
                    />

                    <span className="text-xl font-bold tracking-tight transition group-hover:text-indigo-400">
                        StudyBeacon
                    </span>
                </div>

                {/* Right Buttons */}
                <div className="flex items-center gap-6">

                    <button
                        onClick={() => navigate("/login")}
                        className="text-gray-300 hover:text-white transition"
                    >
                        Login
                    </button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/register")}
                        className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg font-medium transition shadow-md shadow-indigo-800/40"
                    >
                        Get Started
                    </motion.button>

                </div>
            </nav>

            {/* ================= BACKGROUND EFFECTS ================= */}

            {/* Gradient Blobs */}
            <motion.div
                style={{ y }}
                className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-indigo-700 rounded-full opacity-20"
            />
            <motion.div
                style={{ y }}
                className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-purple-700 rounded-full opacity-20"
            />

            {/* Subtle Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.03)_1px,_transparent_0)] [background-size:40px_40px] -z-20" />

            {/* Particles */}
            <Particles
                init={particlesInit}
                className="absolute inset-0 -z-10"
                options={{
                    particles: {
                        number: { value: 40 },
                        size: { value: 2 },
                        move: { enable: true, speed: 0.5 },
                        opacity: { value: 0.25 },
                        color: { value: "#6366f1" }
                    }
                }}
            />

            {/* ================= HERO ================= */}
            <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 lg:px-16">

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl mx-auto">
                        StudyBeacon <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">
                            <Typewriter
                                words={[
                                    "AI Personalized Revision",
                                    "Smart Goal Tracking",
                                    "Performance Optimization"
                                ]}
                                loop
                                cursor
                                cursorStyle="|"
                                typeSpeed={70}
                                deleteSpeed={40}
                                delaySpeed={2000}
                            />
                        </span>
                    </h1>

                    <p className="mt-8 text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        An intelligent revision system that analyzes your weaknesses,
                        generates targeted practice, and helps you achieve academic goals efficiently.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/register")}
                        className="mt-12 bg-indigo-600 hover:bg-indigo-700 px-10 py-4 rounded-full font-semibold transition shadow-lg shadow-indigo-800/40"
                    >
                        Start Smart Revision
                    </motion.button>
                </motion.div>
            </section>

            {/* ================= FEATURES ================= */}
            <section className="py-32 px-6 lg:px-20 bg-[#0F172A]">

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16 text-center"
                >
                    {[
                        {
                            icon: <Brain size={36} />,
                            title: "AI Weakness Detection",
                            desc: "Automatically identifies weak concepts based on your performance."
                        },
                        {
                            icon: <Target size={36} />,
                            title: "Goal-Based Planning",
                            desc: "Set revision goals and let AI create personalized strategies."
                        },
                        {
                            icon: <TrendingUp size={36} />,
                            title: "Performance Insights",
                            desc: "Track trends and continuously improve your academic performance."
                        }
                    ].map((item, i) => (
                        <Tilt
                            key={i}
                            scale={1.05}
                            tiltMaxAngleX={12}
                            tiltMaxAngleY={12}
                            className="rounded-2xl"
                        >
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="p-10 rounded-2xl bg-[#1E293B] border border-[#2E3A59] transition duration-300 hover:border-indigo-500"
                            >
                                <motion.div
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                    className="mx-auto mb-6 text-indigo-400"
                                >
                                    {item.icon}
                                </motion.div>

                                <h3 className="text-xl font-bold mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        </Tilt>
                    ))}
                </motion.div>
            </section>

            {/* ================= FINAL CTA ================= */}
            <section className="py-32 text-center px-6 bg-[#0B0F1A]">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold">
                        Ready to achieve your academic goals?
                    </h2>

                    <p className="mt-6 text-gray-400 max-w-xl mx-auto">
                        Join StudyBeacon and experience AI-driven personalized revision.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        onClick={() => navigate("/register")}
                        className="mt-10 bg-indigo-600 hover:bg-indigo-700 px-12 py-4 rounded-full font-semibold transition shadow-lg shadow-indigo-800/40"
                    >
                        Create Free Account
                    </motion.button>
                </motion.div>
            </section>

        </div>
    );
}

export default Landing;