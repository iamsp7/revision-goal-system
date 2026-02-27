import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import API from "../api/api";

function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [form, setForm] = useState({
        name: "",
        description: ""
    });

    const [deleteId, setDeleteId] = useState(null);

    const navigate = useNavigate();

    const fetchSubjects = async () => {
        try {
            const res = await API.get("/api/subjects");
            setSubjects(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error(error);
            setSubjects([]);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await API.post("/api/subjects", form);
        setForm({ name: "", description: "" });
        fetchSubjects();
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        await API.delete(`/api/subjects/${deleteId}`);
        setDeleteId(null);
        fetchSubjects();
    };

    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white relative">

            <div className="max-w-6xl mx-auto px-6 py-16">

                {/* Header */}
                <h1 className="text-4xl font-bold mb-12">
                    My Subjects
                </h1>

                {/* Create Subject */}
                <motion.form
                    onSubmit={handleSubmit}
                    className="bg-[#1E293B] border border-[#2E3A59] p-8 rounded-2xl mb-16 grid md:grid-cols-3 gap-6"
                >
                    <input
                        placeholder="Subject Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        className="bg-[#0B0F1A] border border-[#2E3A59] px-4 py-3 rounded-lg"
                        required
                    />

                    <input
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        className="bg-[#0B0F1A] border border-[#2E3A59] px-4 py-3 rounded-lg"
                    />

                    <button className="bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold">
                        Create
                    </button>
                </motion.form>

                {/* Subjects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {subjects.map((sub) => (
                        <motion.div
                            key={sub.id}
                            whileHover={{ y: -8 }}
                            className="cursor-pointer border border-[#2E3A59] rounded-2xl overflow-hidden relative group"
                        >
                            <div
                                onClick={() => navigate(`/subjects/${sub.id}`)}
                            >
                                <div className="h-2 bg-indigo-600"></div>

                                <div className="bg-[#1E293B] p-6">
                                    <h2 className="text-xl font-semibold mb-3">
                                        {sub.name}
                                    </h2>

                                    <p className="text-gray-400 text-sm">
                                        {sub.description || "No description"}
                                    </p>
                                </div>
                            </div>

                            {/* Delete Icon */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId(sub.id);
                                }}
                                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition"
                            >
                                <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600" />
                            </button>
                        </motion.div>
                    ))}
                </div>

            </div>

            {/* Modern Delete Dialog */}
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
                                Delete Subject?
                            </h2>

                            <p className="text-gray-400 mb-6 text-sm">
                                This will permanently delete the subject and all its MCQs.
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

export default Subjects;