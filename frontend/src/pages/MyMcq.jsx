import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/api";

function MyMcq() {

    const [mcqs, setMcqs] = useState([]);
    const [groupedBySubject, setGroupedBySubject] = useState({});
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMcqs = async () => {
        try {
            const res = await API.get("/api/mcq");
            setMcqs(res.data);
        } catch (err) {
            console.error("Error fetching MCQs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMcqs();
    }, []);

    useEffect(() => {
        const grouped = mcqs.reduce((acc, mcq) => {
            const subjectName = mcq.subject?.name || "Unknown Subject";
            if (!acc[subjectName]) acc[subjectName] = [];
            acc[subjectName].push(mcq);
            return acc;
        }, {});
        setGroupedBySubject(grouped);
    }, [mcqs]);

    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white px-6 py-16">

            <div className="max-w-6xl mx-auto space-y-16">

                {/* Header */}
                <div className="relative">
                    <div className="absolute -left-6 top-2 w-1 h-14 bg-indigo-600 rounded-full"></div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        My MCQs
                    </h1>
                    <p className="text-gray-400 mt-4">
                        Review all generated MCQs grouped by subject.
                    </p>
                </div>

                {loading && (
                    <p className="text-gray-400">Loading MCQs...</p>
                )}

                {!loading && Object.keys(groupedBySubject).length === 0 && (
                    <div className="border border-[#2E3A59] bg-[#1E293B] p-10 rounded-2xl text-gray-400">
                        No MCQs generated yet.
                    </div>
                )}

                {/* ---------------- SUBJECT LIST ---------------- */}
                {!selectedSubject && !loading && (
                    <div className="grid md:grid-cols-3 gap-8">
                        {Object.keys(groupedBySubject).map((subject, index) => (
                            <motion.div
                                key={subject}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -8 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedSubject(subject)}
                                className="cursor-pointer border border-[#2E3A59] rounded-2xl overflow-hidden"
                            >
                                <div className="h-2 bg-indigo-600"></div>

                                <div className="bg-[#1E293B] p-8">
                                    <h2 className="text-xl font-semibold mb-2">
                                        {subject}
                                    </h2>

                                    <p className="text-gray-400 text-sm">
                                        {groupedBySubject[subject].length} MCQs
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* ---------------- SELECTED SUBJECT ---------------- */}
                {selectedSubject && (
                    <div className="space-y-10">

                        {/* Back Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedSubject(null)}
                            className="bg-[#1E293B] border border-[#2E3A59] px-6 py-3 rounded-lg hover:border-indigo-500 transition"
                        >
                            ← Back to Subjects
                        </motion.button>

                        <h2 className="text-3xl font-bold text-indigo-400">
                            {selectedSubject}
                        </h2>

                        {/* MCQ List */}
                        <div className="space-y-8">
                            {groupedBySubject[selectedSubject].map((mcq, index) => (
                                <motion.div
                                    key={mcq.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="border border-[#2E3A59] rounded-2xl overflow-hidden"
                                >
                                    <div className="h-2 bg-indigo-600"></div>

                                    <div className="bg-[#1E293B] p-8">
                                        <h3 className="font-semibold mb-4 text-lg">
                                            {index + 1}. {mcq.question}
                                        </h3>

                                        <ul className="space-y-2 text-gray-300">
                                            {mcq.options?.map((opt, i) => (
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
                )}

            </div>
        </div>
    );
}

export default MyMcq;