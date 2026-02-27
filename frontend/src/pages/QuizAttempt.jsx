import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";
import { motion, AnimatePresence } from "framer-motion";

function QuizAttempt() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [mcqs, setMcqs] = useState([]);
    const [answers, setAnswers] = useState({});
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scoreModal, setScoreModal] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);

                console.log("Quiz ID:", id);

                /* -------- Fetch MCQs -------- */
                const mcqRes = await API.get(`/api/mcq/subject/${id}`);
                console.log("MCQs:", mcqRes.data);

                setMcqs(mcqRes.data || []);

                /* -------- Start Session -------- */
                const userId = localStorage.getItem("userId");

                if (!userId) {
                    throw new Error("User ID not found in localStorage");
                }

                const sessionRes = await API.post("/api/sessions/start", {
                    userId: Number(userId),
                    subject: { id: Number(id) }
                });

                console.log("Session created:", sessionRes.data);
                setSessionId(sessionRes.data.id);

            } catch (err) {
                console.error("Initialization error:", err);
                setError("Failed to load quiz. Check backend.");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [id]);

    const handleOptionSelect = (questionId, option) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleSubmit = async () => {
        if (!sessionId) {
            alert("Session not ready yet.");
            return;
        }

        try {
            let correctCount = 0;

            for (let mcq of mcqs) {
                const selected = answers[mcq.id] || null;
                const isCorrect = selected === mcq.answer;

                if (isCorrect) correctCount++;

                await API.post("/api/attempts", {
                    quizSession: { id: sessionId },
                    mcqQuestion: { id: mcq.id },
                    correct: isCorrect,
                    score: isCorrect ? 1 : 0
                });
            }

            const total = mcqs.length;
            const score = (correctCount / total) * 100;

            await API.post(
                `/api/sessions/finish/${sessionId}?totalQuestions=${total}&correctAnswers=${correctCount}&totalScore=${score}`
            );

            setScoreModal(score.toFixed(2));

        } catch (err) {
            console.error("Submit error:", err);
            alert("Error submitting quiz.");
        }
    };

    /* ---------------- UI ---------------- */

    if (loading)
        return <div className="text-white p-10">Loading quiz...</div>;

    if (error)
        return <div className="text-red-400 p-10">{error}</div>;

    if (mcqs.length === 0)
        return <div className="text-yellow-400 p-10">No MCQs found for this subject.</div>;

    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white px-6 py-16">
            <div className="max-w-4xl mx-auto space-y-10">

                <h1 className="text-3xl font-bold">
                    Quiz Attempt
                </h1>

                {mcqs.map((mcq, index) => (
                    <motion.div
                        key={mcq.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-[#1E293B] p-6 rounded-xl border border-[#2E3A59]"
                    >
                        <h3 className="font-semibold mb-4">
                            {index + 1}. {mcq.question}
                        </h3>

                        <div className="space-y-2">
                            {mcq.options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleOptionSelect(mcq.id, opt)}
                                    className={`w-full text-left px-4 py-2 rounded-lg border transition ${answers[mcq.id] === opt
                                            ? "bg-indigo-600 border-indigo-500"
                                            : "bg-[#0B0F1A] border-[#2E3A59] hover:border-indigo-500"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ))}

                <button
                    onClick={handleSubmit}
                    className="w-full bg-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                    Submit Quiz
                </button>
            </div>

            <AnimatePresence>
                {scoreModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
                    >
                        <motion.div className="bg-[#1E293B] p-10 rounded-2xl text-center">
                            <h2 className="text-2xl font-bold mb-4">
                                Quiz Finished 🎉
                            </h2>
                            <p className="text-xl text-indigo-400 mb-6">
                                Score: {scoreModal}%
                            </p>
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="bg-indigo-600 px-6 py-2 rounded-lg"
                            >
                                Go to Dashboard
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default QuizAttempt;