import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, Target, TrendingUp, Calendar } from "lucide-react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

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

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        subjects: 0,
        mcqs: 0,
        accuracy: 0,
        improvement: 0
    });

    const [trendData, setTrendData] = useState([]);
    const [dueTopics, setDueTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔥 FIXED STATE
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                const subjectsRes = await API.get("/api/subjects");
                const sessionsRes = await API.get("/api/sessions/me");
                const dueRes = await API.get("/api/revision/daily");

                const sessions = sessionsRes.data || [];

                // ✅ Backend now returns TopicDTO
                setDueTopics(dueRes.data || []);

                const validSessions = sessions
                    .filter(s => s.finishedAt)
                    .sort((a, b) => new Date(a.finishedAt) - new Date(b.finishedAt));

                let totalCorrect = 0;
                let totalQuestions = 0;

                validSessions.forEach(s => {
                    totalCorrect += s.correctAnswers || 0;
                    totalQuestions += s.totalQuestions || 0;
                });

                const accuracy =
                    totalQuestions > 0
                        ? ((totalCorrect / totalQuestions) * 100).toFixed(1)
                        : 0;

                const improvement =
                    validSessions.length > 1
                        ? (
                            (validSessions[validSessions.length - 1].totalScore || 0) -
                            (validSessions[validSessions.length - 2].totalScore || 0)
                        ).toFixed(1)
                        : 0;

                const trend = validSessions.slice(-5).map((s, index) => ({
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

            setLoading(false);

        };

        fetchDashboardData();

    }, []);

    if (loading) {
        return (
            <div className="text-white flex justify-center items-center min-h-screen">
                Loading Dashboard...
            </div>
        );
    }

    // ✅ FIXED LOGIC
    const visibleTopics = showAll
        ? [...dueTopics]
        : [...dueTopics].slice(0, 2);

    return (

        <div className="min-h-screen bg-[#0B0F1A] text-white px-6 py-20">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-5xl font-extrabold mb-16">
                    Dashboard
                </h1>

                {/* STATS */}
                <div className="grid md:grid-cols-4 gap-10 mb-20">

                    {[
                        { title: "Subjects", value: stats.subjects, icon: <BookOpen size={22} /> },
                        { title: "Total Questions Attempted", value: stats.mcqs, icon: <FileText size={22} /> },
                        { title: "Accuracy", value: `${stats.accuracy}%`, icon: <Target size={22} /> },
                        { title: "Improvement", value: `${stats.improvement}%`, icon: <TrendingUp size={22} /> }
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
                            <YAxis domain={[0, 100]} stroke="#aaa" />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#6366F1"
                                strokeWidth={3}
                                dot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                </div>

                {/* WEAK TOPICS */}
                <div className="bg-[#1E293B] p-10 rounded-2xl border border-[#2E3A59]">

                    <div className="flex justify-between items-center mb-6">

                        <div className="flex items-center gap-3">
                            <Calendar className="text-indigo-400" />
                            <h2 className="text-2xl font-bold">
                                Today's Focus
                            </h2>
                        </div>

                        {/* ✅ FIXED BUTTON */}
                        {dueTopics.length > 2 && (
                            <button
                                onClick={() => setShowAll(prev => !prev)}
                                className="text-indigo-400 hover:text-indigo-300 text-sm"
                            >
                                {showAll
                                    ? "Show Less ↑"
                                    : `View All (${dueTopics.length}) →`}
                            </button>
                        )}

                    </div>

                    {dueTopics.length === 0 ? (

                        <p className="text-gray-400">
                            🎉 No weak topics today. You're doing great!
                        </p>

                    ) : (

                        <div className="grid md:grid-cols-2 gap-6">

                            {visibleTopics.map((topic, index) => {

                                // ✅ CLEAN DTO USAGE
                                const topicName = topic.topic;
                                const subject = topic.subject || "General";

                                return (

                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() =>
                                            navigate(`/recommendation/${encodeURIComponent(topicName + " " + subject)}`)
                                        }
                                        className="bg-[#0B0F1A] p-6 rounded-xl border border-red-500 cursor-pointer hover:border-red-400 transition"
                                    >

                                        <p className="text-red-400 text-sm mb-2">
                                            ⚠ Weak Topic
                                        </p>

                                        <h3 className="text-xl font-semibold mb-1">
                                            {topicName}
                                        </h3>

                                        <p className="text-gray-400 text-sm mb-3">
                                            Subject: {subject}
                                        </p>

                                        <p className="text-sm text-gray-300">
                                            Click to improve this topic →
                                        </p>

                                    </motion.div>

                                );

                            })}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Dashboard;