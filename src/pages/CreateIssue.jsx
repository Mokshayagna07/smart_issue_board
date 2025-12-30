import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { issueService } from "../services/db";
import Layout from "../components/Layout";
import IssueModal from "../components/IssueModal";
import { AlertCircle, Save } from "lucide-react";

export default function CreateIssue() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "Low",
        assignedTo: "",
        status: "Open"
    });

    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const [similarIssues, setSimilarIssues] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function checkSimilar() {
        if (!formData.title.trim()) return;

        setChecking(true);
        const similar = await issueService.findSimilarIssues(formData.title);
        setChecking(false);

        if (similar.length > 0) {
            setSimilarIssues(similar);
            setShowModal(true);
            return true; // Found similar
        }
        return false; // No similar found
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        // Check similarity first
        const hasSimilar = await checkSimilar();
        if (hasSimilar) return; // Modal will show, stop here

        // Proceed if no similar or confirmed via modal
        await createIssue();
    }

    async function createIssue() {
        setLoading(true);
        try {
            await issueService.createIssue({
                ...formData,
                createdBy: currentUser.email,
                assignedTo: formData.assignedTo || currentUser.email // Default to self if empty
            });
            navigate("/dashboard");
        } catch (err) {
            setError("Failed to create issue");
            console.error(err);
            setLoading(false);
        }
    }

    // Called when user confirms inside modal
    async function handleConfirmCreate() {
        setShowModal(false);
        await createIssue();
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Create New Issue</h1>
                    <p className="text-slate-500">Report a bug, feature request, or task.</p>
                </div>

                {error && <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2"><AlertCircle size={18} /> {error}</div>}

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                className="input-field"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Brief summary of the issue"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-red-500">*</span></label>
                            <textarea
                                name="description"
                                rows="4"
                                className="input-field resize-none"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="Detailed explanation..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Assign To (Email)</label>
                                <input
                                    type="email"
                                    name="assignedTo"
                                    className="input-field"
                                    value={formData.assignedTo}
                                    onChange={handleChange}
                                    placeholder={currentUser.email}
                                />
                                <p className="text-xs text-slate-400 mt-1">Leave blank to assign to yourself</p>
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
                                disabled={loading || checking}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                {loading ? "Creating..." : checking ? "Checking..." : (
                                    <>
                                        <Save size={18} /> Create Issue
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <IssueModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmCreate}
                similarIssues={similarIssues}
            />
        </Layout>
    );
}
