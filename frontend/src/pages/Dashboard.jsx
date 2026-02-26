import { motion } from "framer-motion";
import { BookOpen, FileText, Target, TrendingUp } from "lucide-react";

function Dashboard() {
    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white px-6 py-20">

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >

                {/* HEADER BLOCK */}
                <div className="relative mb-20">

                    {/* Accent bar */}
                    <div className="absolute -left-6 top-2 w-1 h-16 bg-indigo-600 rounded-full"></div>

                    <h1 className="text-5xl font-extrabold tracking-tight">
                        Dashboard
                    </h1>

                    <p className="text-gray-400 mt-6 text-lg max-w-2xl leading-relaxed">
                        Track performance. Identify weak areas. Optimize revision using intelligent AI feedback.
                    </p>
                </div>

                {/* STATS GRID */}
                <div className="grid md:grid-cols-4 gap-10">

                    {[
                        {
                            title: "Subjects",
                            value: "12",
                            icon: <BookOpen size={22} />,
                            color: "from-indigo-600 to-indigo-800"
                        },
                        {
                            title: "MCQs Generated",
                            value: "340",
                            icon: <FileText size={22} />,
                            color: "from-purple-600 to-purple-800"
                        },
                        {
                            title: "Accuracy",
                            value: "87%",
                            icon: <Target size={22} />,
                            color: "from-blue-600 to-blue-800"
                        },
                        {
                            title: "Improvement",
                            value: "+12%",
                            icon: <TrendingUp size={22} />,
                            color: "from-emerald-600 to-emerald-800"
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -8 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative rounded-2xl overflow-hidden border border-[#2E3A59]"
                        >
                            {/* Top Accent Strip */}
                            <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>

                            <div className="bg-[#1E293B] p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <p className="text-gray-400 text-sm tracking-wide uppercase">
                                        {item.title}
                                    </p>
                                    <div className="text-indigo-400">
                                        {item.icon}
                                    </div>
                                </div>

                                <h2 className="text-4xl font-extrabold">
                                    {item.value}
                                </h2>
                            </div>
                        </motion.div>
                    ))}

                </div>

                {/* SECTION SPACING */}
                <div className="my-24"></div>

                {/* AI INSIGHT PANEL */}
                <motion.div
                    whileHover={{ y: -6 }}
                    className="relative border border-indigo-600 rounded-2xl overflow-hidden"
                >

                    {/* Left Highlight Panel */}
                    <div className="absolute left-0 top-0 h-full w-2 bg-indigo-600"></div>

                    <div className="bg-[#1E293B] p-12">

                        <p className="text-indigo-400 text-sm tracking-widest mb-6">
                            AI INSIGHT
                        </p>

                        <h3 className="text-2xl font-bold mb-4">
                            You are weak in Data Normalization
                        </h3>

                        <p className="text-gray-400 mb-10 max-w-xl leading-relaxed">
                            Your recent test performance shows low accuracy in normalization concepts.
                            Focused practice can improve conceptual clarity significantly.
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-indigo-600 hover:bg-indigo-700 px-10 py-4 rounded-lg font-semibold transition shadow-lg shadow-indigo-800/40"
                        >
                            Generate 25 Targeted MCQs
                        </motion.button>

                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
}

export default Dashboard;