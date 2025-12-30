import { AlertTriangle, X } from "lucide-react";

export default function IssueModal({ isOpen, onClose, onConfirm, similarIssues }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-3 text-warning mb-4">
                        <div className="p-2 bg-warning/10 rounded-full">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Similar Issues Detected</h3>
                    </div>

                    <p className="text-slate-600 mb-4">
                        We found existing issues that look similar to yours. Please check if your issue has already been reported.
                    </p>

                    <div className="bg-slate-50 rounded-lg p-3 max-h-48 overflow-y-auto mb-6 border border-slate-100">
                        <ul className="space-y-2">
                            {similarIssues.map((issue) => (
                                <li key={issue.id} className="text-sm border-b border-slate-200 last:border-0 pb-2 last:pb-0">
                                    <span className="font-medium text-slate-700">{issue.title}</span>
                                    <span className="block text-xs text-slate-500 mt-1">Status: {issue.status}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="btn btn-primary"
                        >
                            Create Anyway
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
