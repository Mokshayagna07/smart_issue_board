import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Calendar, User, ArrowRight } from "lucide-react";

const PriorityBadge = ({ priority }) => {
    const colors = {
        Low: "bg-blue-100 text-blue-700",
        Medium: "bg-yellow-100 text-yellow-700",
        High: "bg-red-100 text-red-700",
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[priority] || colors.Low}`}>
            {priority}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const colors = {
        Open: "bg-slate-100 text-slate-700",
        "In Progress": "bg-purple-100 text-purple-700",
        Done: "bg-green-100 text-green-700",
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || colors.Open}`}>
            {status}
        </span>
    );
};

export default function IssueCard({ issue }) {
    return (
        <div className="card hover:translate-y-[-2px] transition-transform">
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2">
                        <PriorityBadge priority={issue.priority} />
                        <StatusBadge status={issue.status} />
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {issue.createdAt ? formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true }) : 'Just now'}
                    </span>
                </div>

                <Link to={`/edit-issue/${issue.id}`} className="block group">
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                        {issue.title}
                    </h3>
                </Link>

                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {issue.description}
                </p>

                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <User size={14} />
                        <span>{issue.assignedTo}</span>
                    </div>
                    <Link
                        to={`/edit-issue/${issue.id}`}
                        className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                    >
                        Details <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
