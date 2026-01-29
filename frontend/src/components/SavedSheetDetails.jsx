import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api_sevices/middleware"; 
import useWorkspaceStore from "../store/workspaceStore";



export default function SavedSheetDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sheet, setSheet] = useState(null);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`/problems/sheets/${id}`);
                setSheet(res.data.sheet);
                setProblems(res.data.problems);
            } catch (err) {
                console.error(err);
                alert("Error fetching sheet details");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
    if (!sheet) return <div className="text-center mt-10 text-white">Sheet not found</div>;

    return (
        <div className="w-full min-h-screen bg-[var(--primary)] flex justify-center py-10">
            <div className="w-[70vw] bg-[var(--secondary)] rounded-xl shadow-lg p-6">
                <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline">← Back to Profile</button>
                <h1 className="text-3xl font-bold mb-6 text-center">{sheet.name}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {problems.map((p, index) => (
                        <a key={index} href={p.url} target="_blank" rel="noopener noreferrer" className="block">
                            <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
                                <h2 className="font-bold">{p.title}</h2>
                                <p className="text-sm">Difficulty: {p.difficulty}</p>
                                <p className="text-xs text-gray-500 mt-1 uppercase">{p.platform}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}