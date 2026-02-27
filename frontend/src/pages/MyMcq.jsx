import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import API from "../api/api";

function MyMcq() {

    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [mcqs, setMcqs] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔥 Fetch Subjects First
    const fetchSubjects = async () => {
        try {
            const res = await API.get("/api/subjects");
            setSubjects(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 Fetch MCQs by Subject
    const fetchMcqsBySubject = async (subjectId) => {
        try {
            const res = await API.get(`/api/mcq/subject/${subjectId}`);
            setMcqs(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const confirmDelete = async () => {
        if (!deleteId) return;

        await API.delete(`/api/mcq/${deleteId}`);
        setDeleteId(null);

        // refresh current subject
        fetchMcqsBySubject(selectedSubject.id);
    };

    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white px-6 py-16">
            <div className="max-w-6xl mx-auto space-y-16">

                <h1 className="text-4xl font-bold">
                    My MCQs
                </h1>

                {/* SUBJECT LIST */}
                {!selectedSubject && !loading && (
                    <div className="grid md:grid-cols-3 gap-8">
                        {subjects.map((sub) => (
                            <motion.div
                                key={sub.id}
                                whileHover={{ y: -8 }}
                                onClick={() => {
                                    setSelectedSubject(sub);
                                    fetchMcqsBySubject(sub.id);
                                }}
                                className="cursor-pointer border border-[#2E3A59] rounded-2xl overflow-hidden"
                            >
                                <div className="h-2 bg-indigo-600"></div>

                                <div className="bg-[#1E293B] p-8">
                                    <h2 className="text-xl font-semibold mb-2">
                                        {sub.name}
                                    </h2>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* MCQ LIST */}
                {selectedSubject && (
                    <div className="space-y-10">

                        <button
                            onClick={() => {
                                setSelectedSubject(null);
                                setMcqs([]);
                            }}
                            className="bg-[#1E293B] border border-[#2E3A59] px-6 py-3 rounded-lg hover:border-indigo-500 transition"
                        >
                            ← Back
                        </button>

                        <h2 className="text-3xl font-bold text-indigo-400">
                            {selectedSubject.name}
                        </h2>

                        <div className="space-y-8">
                            {mcqs.map((mcq, index) => (
                                <motion.div
                                    key={mcq.id}
                                    whileHover={{ y: -4 }}
                                    className="border border-[#2E3A59] rounded-2xl overflow-hidden relative group"
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

                                    {/* Delete Icon */}
                                    <button
                                        onClick={() => setDeleteId(mcq.id)}
                                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                )}

            </div>

            {/* DELETE MODAL */}
            <AnimatePresence>
                {deleteId && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-[#1E293B] p-8 rounded-2xl w-96 border border-[#2E3A59]"
                        >
                            <h2 className="text-xl font-semibold mb-4">
                                Delete MCQ?
                            </h2>

                            <p className="text-gray-400 mb-6 text-sm">
                                This action cannot be undone.
                            </p>

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

export default MyMcq;