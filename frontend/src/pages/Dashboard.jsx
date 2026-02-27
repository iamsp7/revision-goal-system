import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, Target, TrendingUp, Calendar } from "lucide-react";
import API from "../api/api";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

function Dashboard() {

    const [stats, setStats] = useState({
        subjects: 0,
        mcqs: 0,
        accuracy: 0,
        improvement: 0
    });

    const [trendData, setTrendData] = useState([]);
    const [dueTopics, setDueTopics] = useState([]);

    useEffect(() => {

        const fetchDashboardData = async () => {
            try {

                // 🔹 Subjects
                const subjectsRes = await API.get("/api/subjects");

                // 🔹 Sessions
                const sessionsRes = await API.get("/api/sessions/me");
                const sessions = sessionsRes.data || [];

                // 🔹 Daily Revision
                const dueRes = await API.get("/api/revision/daily");
                setDueTopics(dueRes.data || []);

                let totalCorrect = 0;
                let totalQuestions = 0;

                sessions.forEach(s => {
                    totalCorrect += s.correctAnswers || 0;
                    totalQuestions += s.totalQuestions || 0;
                });

                const accuracy = totalQuestions > 0
                    ? ((totalCorrect / totalQuestions) * 100).toFixed(1)
                    : 0;

                const improvement =
                    sessions.length > 1
                        ? (
                            (sessions[sessions.length - 1].totalScore || 0) -
                            (sessions[sessions.length - 2].totalScore || 0)
                        ).toFixed(1)
                        : 0;

                const trend = sessions.slice(-5).map((s, index) => ({
                    name: `Quiz ${index + 1}`,
                    score: s.totalScore || 0
                }));

                setStats({
                    subjects: subjectsRes.data.length,
                    mcqs: totalQuestions,
                    accuracy,
                    improvement
                });

                setTrendData(trend);

            } catch (err) {
                console.error("Dashboard load error:", err);
            }
        };

        fetchDashboardData();

    }, []);

    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white px-6 py-20">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-5xl font-extrabold mb-16">
                    Dashboard
                </h1>

                {/* STATS */}
                <div className="grid md:grid-cols-4 gap-10 mb-20">

                    {[
                        {
                            title: "Subjects",
                            value: stats.subjects,
                            icon: <BookOpen size={22} />
                        },
                        {
                            title: "Total Questions Attempted",
                            value: stats.mcqs,
                            icon: <FileText size={22} />
                        },
                        {
                            title: "Accuracy",
                            value: `${stats.accuracy}%`,
                            icon: <Target size={22} />
                        },
                        {
                            title: "Improvement",
                            value: `${stats.improvement}%`,
                            icon: <TrendingUp size={22} />
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -8 }}
                            className="bg-[#1E293B] p-8 rounded-2xl border border-[#2E3A59]"
                        >
                            <div className="flex justify-between mb-6">
                                <p className="text-gray-400 text-sm uppercase">
                                    {item.title}
                                </p>
                                <div className="text-indigo-400">
                                    {item.icon}
                                </div>
                            </div>

                            <h2 className="text-4xl font-bold">
                                {item.value}
                            </h2>
                        </motion.div>
                    ))}
                </div>

                {/* PERFORMANCE TREND */}
                <div className="bg-[#1E293B] p-10 rounded-2xl border border-[#2E3A59] mb-12">
                    <h2 className="text-2xl font-bold mb-8">
                        Performance Trend (Last 5 Quizzes)
                    </h2>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <CartesianGrid stroke="#2E3A59" />
                            <XAxis dataKey="name" stroke="#aaa" />
                            <YAxis stroke="#aaa" />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#6366F1"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* DAILY REVISION SECTION */}
                <div className="bg-[#1E293B] p-10 rounded-2xl border border-[#2E3A59]">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="text-indigo-400" />
                        <h2 className="text-2xl font-bold">
                            Today's Revision
                        </h2>
                    </div>

                    {dueTopics.length === 0 ? (
                        <p className="text-gray-400">
                            🎉 No topics due today. You're ahead!
                        </p>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {dueTopics.map((topic, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-[#0B0F1A] p-6 rounded-xl border border-indigo-500"
                                >
                                    📚 {topic}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Dashboard;