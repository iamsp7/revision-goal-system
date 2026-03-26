import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";
import axios from "axios";
import { motion } from "framer-motion";

function Recommendation() {

    const { topic } = useParams();
    const navigate = useNavigate();

    const decodedTopic = decodeURIComponent(topic);

    const [resources, setResources] = useState([]);
    const [explanation, setExplanation] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("video");

    useEffect(() => {

        const fetchData = async () => {
            try {

                const [topicName, subjectName] = decodedTopic.split("||");

                const res = await API.get(
                    `/api/recommend?topic=${encodeURIComponent(topicName)}&subject=${encodeURIComponent(subjectName)}`
                );

                setResources(res.data.resources || []);

                const explainRes = await axios.get(
                    `http://localhost:8000/api/explain?topic=${encodeURIComponent(topicName)}&subject=${encodeURIComponent(subjectName)}`
                );

                setExplanation(explainRes.data.content);

            } catch (err) {
                console.error(err);
                setExplanation("⚠ Could not load explanation.");
            }

            setLoading(false);
        };

        fetchData();

    }, [decodedTopic]);

    if (loading) {
        return (
            <div className="text-white flex justify-center items-center min-h-screen">
                Loading...
            </div>
        );
    }

    const videos = resources.filter(r => r.type === "video");
    const articles = resources.filter(r => r.type === "article");

    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white px-6 py-20">

            <div className="max-w-6xl mx-auto">

                {/* 🔙 BACK BUTTON */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 px-5 py-2 rounded-lg bg-[#1E293B] hover:bg-[#2E3A59] transition shadow-md"
                >
                    ← Back
                </button>

                {/* TITLE */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold mb-10 tracking-wide"
                >
                    Learn: <span className="text-indigo-400">{decodedTopic}</span>
                </motion.h1>

                {/* TABS */}
                <div className="flex gap-3 mb-10 flex-wrap">
                    {["video", "articles", "explanation"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${activeTab === tab
                                    ? "bg-indigo-500 shadow-lg"
                                    : "bg-[#1E293B] hover:bg-[#2E3A59]"
                                }`}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* 🎥 VIDEOS */}
                {activeTab === "video" && (
                    <div className="grid md:grid-cols-2 gap-8">

                        {videos.length === 0 ? (
                            <p className="text-gray-400">No videos available.</p>
                        ) : (
                            videos.map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-[#1E293B] p-5 rounded-2xl border border-indigo-500 shadow-md"
                                >
                                    <h3 className="text-lg mb-4 font-semibold">
                                        {item.title}
                                    </h3>

                                    <iframe
                                        width="100%"
                                        height="220"
                                        src={item.embedUrl}
                                        title={item.title}
                                        allowFullScreen
                                        className="rounded-xl"
                                    />
                                </motion.div>
                            ))
                        )}

                    </div>
                )}

                {/* 📄 ARTICLES */}
                {activeTab === "articles" && (
                    <div className="grid md:grid-cols-2 gap-6">

                        {articles.length === 0 ? (
                            <p className="text-gray-400">No articles available.</p>
                        ) : (
                            articles.map((item, index) => (
                                <motion.a
                                    key={index}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05 }}
                                    className="block bg-[#1E293B] p-6 rounded-xl border border-indigo-500 shadow-md hover:shadow-indigo-500/20 transition"
                                >
                                    <h3 className="text-lg font-semibold text-indigo-400">
                                        📄 {item.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mt-2">
                                        Click to open →
                                    </p>
                                </motion.a>
                            ))
                        )}

                    </div>
                )}

                {/* 🧠 EXPLANATION */}
                {activeTab === "explanation" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-[#1E293B] p-8 rounded-2xl border border-indigo-500 shadow-md"
                    >
                        <pre className="whitespace-pre-wrap leading-7 text-gray-300">
                            {explanation}
                        </pre>
                    </motion.div>
                )}

            </div>
        </div>
    );
}

export default Recommendation;