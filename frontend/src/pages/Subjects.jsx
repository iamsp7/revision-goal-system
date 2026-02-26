import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/api";


function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [form, setForm] = useState({
        name: "",
        description: ""
    });

    const navigate = useNavigate();

    const fetchSubjects = async () => {
        const res = await API.get("/api/subjects");
        setSubjects(res.data);
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

    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white">




            <div className="max-w-6xl mx-auto px-6 py-16">

                {/* Header */}
                <div className="mb-16 relative">
                    <div className="absolute -left-6 top-2 w-1 h-14 bg-indigo-600 rounded-full"></div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        My Subjects
                    </h1>
                    <p className="text-gray-400 mt-4 max-w-xl">
                        Organize your subjects and generate targeted AI-based revision.
                    </p>
                </div>

                {/* Create Subject Section */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#1E293B] border border-[#2E3A59] p-8 rounded-2xl mb-16 grid md:grid-cols-3 gap-6"
                >
                    <input
                        placeholder="Subject Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        className="bg-[#0B0F1A] border border-[#2E3A59] px-4 py-3 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                    />

                    <input
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        className="bg-[#0B0F1A] border border-[#2E3A59] px-4 py-3 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                    />

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition shadow-md shadow-indigo-800/40"
                    >
                        Create Subject
                    </motion.button>
                </motion.form>

                {/* Subjects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {subjects.map((sub, index) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -8 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                                navigate(`/subjects/${sub.id}`)
                            }
                            className="cursor-pointer border border-[#2E3A59] rounded-2xl overflow-hidden"
                        >
                            {/* Accent Strip */}
                            <div className="h-2 bg-indigo-600"></div>

                            <div className="bg-[#1E293B] p-6">
                                <h2 className="text-xl font-semibold mb-3">
                                    {sub.name}
                                </h2>

                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {sub.description || "No description provided."}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Subjects;