import { useState } from "react";
import API from "../api/api";

function PdfUpload() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Please select a PDF file");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("file", file);

            const response = await API.post(
                "/api/mcq/generate-from-pdf",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setResult(response.data);
        } catch (error) {
            console.error("FULL ERROR:", error);
            console.error("RESPONSE:", error.response);
            console.error("DATA:", error.response?.data);
            alert("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mt-8">
            <h2 className="text-xl font-semibold mb-4">
                Upload Study Material (PDF)
            </h2>

            <form onSubmit={handleUpload} className="space-y-4">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-300
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-lg file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-600 file:text-white
                     hover:file:bg-blue-700"
                />

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded-lg font-semibold"
                >
                    {loading ? "Generating MCQs..." : "Upload & Generate"}
                </button>
            </form>

            {result && (
                <div className="mt-6 bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Generated MCQs:</h3>
                    <pre className="text-sm text-gray-300 overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default PdfUpload;