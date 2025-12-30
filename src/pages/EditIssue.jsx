import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { issueService } from "../services/db";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import { AlertCircle, Save, ArrowLeft } from "lucide-react";

export default function EditIssue() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState(null);
    const [originalStatus, setOriginalStatus] = useState("");

    useEffect(() => {
        async function fetchIssue() {
            try {
                const data = await issueService.getIssue(id);
                if (data) {
                    setFormData(data);
                    setOriginalStatus(data.status);
                } else {
                    setError("Issue not found");
                }
            } catch (err) {
                setError("Failed to load issue");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchIssue();
    }, [id]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSaving(true);

        try {
            // Validate status change
            if (originalStatus === "Open" && formData.status === "Done") {
                throw new Error("Cannot move directly from Open to Done. Please move to 'In Progress' first.");
            }

            await issueService.updateIssue(id, formData);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Failed to update issue");
            console.error(err);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <Layout><Spinner /></Layout>;
    if (!formData && error) return <Layout><div className="text-center text-red-600 mt-20">{error}</div></Layout>;

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <button onClick={() => navigate("/dashboard")} className="mb-4 text-slate-500 hover:text-primary flex items-center gap-1 text-sm">
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Edit Issue</h1>
                    <p className="text-slate-500">Update issue details and status.</p>
                </div>

                {error && <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2"><AlertCircle size={18} /> {error}</div>}

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    className="input-field bg-slate-50 font-medium"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                                <select
                                    name="priority"
                                    className="input-field bg-white"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                className="input-field"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-red-500">*</span></label>
                            <textarea
                                name="description"
                                rows="6"
                                className="input-field resize-none"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Assigned To</label>
                            <input
                                type="email"
                                name="assignedTo"
                                className="input-field"
                                value={formData.assignedTo}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-500 grid grid-cols-2 gap-4">
                            <div>
                                <span className="block font-medium text-slate-700">Created By</span>
                                {formData.createdBy}
                            </div>
                            <div>
                                <span className="block font-medium text-slate-700">Created Time</span>
                                {formData.createdAt?.toLocaleString()}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                {saving ? "Saving..." : (
                                    <>
                                        <Save size={18} /> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
