import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { motion } from "framer-motion";

function QuizSubjects() {
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await API.get("/api/subjects");
                setSubjects(res.data);
            } catch (error) {
                console.error("Error fetching subjects", error);
            }
        };

        fetchSubjects();
    }, []);

    return (
        <div className="min-h-screen px-6 py-16 text-white">
            <div className="max-w-4xl mx-auto">

                <h1 className="text-3xl font-bold mb-10">
                    Select Subject for Quiz
                </h1>

                <div className="grid md:grid-cols-2 gap-6">
                    {subjects.map((subject) => (
                        <motion.div
                            key={subject.id}
                            whileHover={{ y: -5 }}
                            className="bg-[#1E293B] p-6 rounded-xl border border-[#2E3A59] cursor-pointer hover:border-indigo-500 transition"
                            onClick={() => navigate(`/quiz/${subject.id}`)}
                        >
                            <h2 className="text-xl font-semibold">
                                {subject.name}
                            </h2>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default QuizSubjects;