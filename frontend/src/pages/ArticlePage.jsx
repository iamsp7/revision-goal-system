import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

function ArticlePage() {

    const { data } = useParams();
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const [topic, subject] = decodeURIComponent(data).split("||");

        const fetchArticle = async () => {
            try {
                const res = await API.get(
                    `/api/article?topic=${topic}&subject=${subject}`
                );

                setContent(res.data.content);
            } catch {
                setContent("Failed to load article.");
            }
            setLoading(false);
        };

        fetchArticle();

    }, [data]);

    if (loading) return <div className="text-white p-10">Loading...</div>;

    return (
        <div className="min-h-screen text-white p-10 max-w-3xl mx-auto">

            <h1 className="text-3xl font-bold mb-6">
                Article
            </h1>

            <p className="text-gray-300 whitespace-pre-line leading-7">
                {content}
            </p>

        </div>
    );
}

export default ArticlePage;