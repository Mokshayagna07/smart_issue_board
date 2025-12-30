import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { issueService } from "../services/db";
import Layout from "../components/Layout";
import IssueCard from "../components/IssueCard";
import Spinner from "../components/Spinner";
import { Filter } from "lucide-react";

export default function Dashboard() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");

    useEffect(() => {
        fetchIssues();
    }, []);

    async function fetchIssues() {
        try {
            const data = await issueService.getIssues();
            setIssues(data);
        } catch (err) {
            setError("Failed to load issues from database.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const filteredIssues = issues.filter(issue => {
        return (statusFilter === "All" || issue.status === statusFilter) &&
            (priorityFilter === "All" || issue.priority === priorityFilter);
    });

    if (loading) return <Layout><Spinner /></Layout>;

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Issue Dashboard</h1>
                <p className="text-slate-500">Overview of all tracked issues</p>
            </div>

            {error && <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

            <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Filter size={20} />
                    <span>Filters:</span>
                </div>
                <div className="flex gap-4 flex-wrap">
                    <select
                        className="input-field max-w-[200px]"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>

                    <select
                        className="input-field max-w-[200px]"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="All">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>

            {filteredIssues.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 mb-4">No issues found matching your filters.</p>
                    <Link to="/create-issue" className="btn btn-primary inline-flex items-center gap-2">
                        Create New Issue
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIssues.map(issue => (
                        <IssueCard key={issue.id} issue={issue} />
                    ))}
                </div>
            )}
        </Layout>
    );
}
