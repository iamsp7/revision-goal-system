import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";

function Recommendation() {

    const { topic } = useParams();
    const decodedTopic = decodeURIComponent(topic);

    const [resources, setResources] = useState([]);
    const [explanation, setExplanation] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("video");

    useEffect(() => {

        const fetchRecommendations = async () => {

            try {

                const [topicName, subjectName] = decodedTopic.split("||");

                const res = await API.get(
                    `/api/recommend?topic=${encodeURIComponent(topicName)}&subject=${encodeURIComponent(subjectName)}`
                );

                setResources(res.data.resources || []);

            } catch (err) {
                console.error(err);
            }

            setLoading(false);
        };
        fetchRecommendations();

    }, [decodedTopic]);

    if (loading) {
        return (
            <div className="text-white flex justify-center items-center min-h-screen">
                Loading recommendations...
            </div>
        );
    }

    const videoResources = resources.filter(r => r.type === "video");
    const articleResources = resources.filter(r => r.type === "article");

    return (

        <div className="min-h-screen bg-[#0B0F1A] text-white px-6 py-20">

            <div className="max-w-6xl mx-auto">

                {/* TITLE */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold mb-10"
                >
                    Learn: <span className="text-indigo-400">{decodedTopic}</span>
                </motion.h1>

                {/* AI EXPLANATION */}
                {/* <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-[#1E293B] p-8 rounded-2xl border border-[#2E3A59] mb-10"
                >
                    <h2 className="text-2xl font-bold mb-4">🧠 AI Explanation</h2>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {explanation}
                    </p>
                </motion.div> */}

                {/* TABS */}
                <div className="flex gap-4 mb-8">
                    {["video", "articles"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-full transition ${activeTab === tab
                                ? "bg-indigo-500"
                                : "bg-[#1E293B] hover:bg-[#2E3A59]"
                                }`}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* VIDEO TAB */}
                {activeTab === "video" && (
                    <div className="space-y-8">

                        {videoResources.length === 0 ? (
                            <p className="text-gray-400">No video content available.</p>
                        ) : (
                            videoResources.map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-[#1E293B] p-6 rounded-2xl border border-indigo-500"
                                >

                                    <h3 className="text-lg mb-4">{item.title}</h3>

                                    <iframe
                                        width="100%"
                                        height="350"
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

                {/* ARTICLE TAB */}
                {activeTab === "articles" && (
                    <div className="space-y-6">

                        {articleResources.length === 0 ? (
                            <p className="text-gray-400">No articles available.</p>
                        ) : (
                            articleResources.map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-[#1E293B] p-6 rounded-xl border border-indigo-500"
                                >
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-400 underline text-lg"
                                    >
                                        {item.title}
                                    </a>
                                </motion.div>
                            ))
                        )}

                    </div>
                )}

            </div>

        </div>

    );
}

export default Recommendation;