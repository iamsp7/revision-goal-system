import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api/api";

function SubjectDetail() {
    const { id } = useParams();

    const [file, setFile] = useState(null);
    const [topic, setTopic] = useState("");
    const [link, setLink] = useState("");
    const [mcqs, setMcqs] = useState([]);

    const [pdfLoading, setPdfLoading] = useState(false);
    const [topicLoading, setTopicLoading] = useState(false);
    const [linkLoading, setLinkLoading] = useState(false);

    const fetchMcqs = async () => {
        const res = await API.get("/api/mcq");
        const filtered = res.data.filter(
            (mcq) => mcq.subject?.id === parseInt(id)
        );
        setMcqs(filtered);
    };

    useEffect(() => {
        fetchMcqs();
    }, []);

    const handlePdfGenerate = async () => {
        if (!file) return alert("Select a PDF first");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("subjectId", id);

        setPdfLoading(true);
        await API.post("/api/mcq/generate-from-pdf", formData);
        setPdfLoading(false);

        fetchMcqs();
    };

    const handleTopicGenerate = async () => {
        if (!topic) return alert("Enter topic");

        const formData = new FormData();
        formData.append("subjectId", id);
        formData.append("topic", topic);

        setTopicLoading(true);
        await API.post("/api/mcq/generate-from-topic", formData);
        setTopicLoading(false);

        setTopic("");
        fetchMcqs();
    };

    const handleLinkGenerate = async () => {
        if (!link) return alert("Enter website link");

        const formData = new FormData();
        formData.append("subjectId", id);
        formData.append("link", link);

        setLinkLoading(true);
        await API.post("/api/mcq/generate-from-link", formData);
        setLinkLoading(false);

        setLink("");
        fetchMcqs();
    };

    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white px-6 py-16">

            <div className="max-w-6xl mx-auto space-y-20">

                {/* Header */}
                <div className="relative">
                    <div className="absolute -left-6 top-2 w-1 h-14 bg-indigo-600 rounded-full"></div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Subject ID: {id}
                    </h1>
                </div>

                {/* Generation Sections */}
                <div className="grid md:grid-cols-3 gap-10">

                    {/* PDF */}
                    <motion.div
                        whileHover={{ y: -6 }}
                        className="border border-[#2E3A59] rounded-2xl overflow-hidden"
                    >
                        <div className="h-2 bg-indigo-600"></div>

                        <div className="bg-[#1E293B] p-8 space-y-6">
                            <h2 className="text-xl font-semibold">
                                Generate from PDF
                            </h2>

                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full bg-[#0B0F1A] border border-[#2E3A59] px-4 py-3 rounded-lg"
                            />

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePdfGenerate}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold transition"
                            >
                                {pdfLoading ? "Generating..." : "Generate MCQs"}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Topic */}
                    <motion.div
                        whileHover={{ y: -6 }}
                        className="border border-[#2E3A59] rounded-2xl overflow-hidden"
                    >
                        <div className="h-2 bg-indigo-600"></div>

                        <div className="bg-[#1E293B] p-8 space-y-6">
                            <h2 className="text-xl font-semibold">
                                Generate from Topic
                            </h2>

                            <input
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter topic"
                                className="w-full bg-[#0B0F1A] border border-[#2E3A59] px-4 py-3 rounded-lg"
                            />

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleTopicGenerate}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold transition"
                            >
                                {topicLoading ? "Generating..." : "Generate MCQs"}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Link */}
                    <motion.div
                        whileHover={{ y: -6 }}
                        className="border border-[#2E3A59] rounded-2xl overflow-hidden"
                    >
                        <div className="h-2 bg-indigo-600"></div>

                        <div className="bg-[#1E293B] p-8 space-y-6">
                            <h2 className="text-xl font-semibold">
                                Generate from Website
                            </h2>

                            <input
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="Paste website link"
                                className="w-full bg-[#0B0F1A] border border-[#2E3A59] px-4 py-3 rounded-lg"
                            />

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLinkGenerate}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold transition"
                            >
                                {linkLoading ? "Generating..." : "Generate MCQs"}
                            </motion.button>
                        </div>
                    </motion.div>

                </div>

                {/* MCQs */}
                <div className="space-y-8">

                    <h2 className="text-3xl font-bold">
                        Generated MCQs
                    </h2>

                    {mcqs.map((mcq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-[#2E3A59] rounded-2xl overflow-hidden"
                        >
                            <div className="h-2 bg-indigo-600"></div>

                            <div className="bg-[#1E293B] p-8">
                                <h3 className="font-semibold mb-4 text-lg">
                                    {index + 1}. {mcq.question}
                                </h3>

                                <ul className="space-y-2 text-gray-300">
                                    {mcq.options.map((opt, i) => (
                                        <li key={i}>• {opt}</li>
                                    ))}
                                </ul>

                                <p className="text-indigo-400 mt-6 font-medium">
                                    Answer: {mcq.answer}
                                </p>
                            </div>
                        </motion.div>
                    ))}

                </div>

            </div>
        </div>
    );
}

export default SubjectDetail;