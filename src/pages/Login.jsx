import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError("Failed to log in. Please check your credentials.");
            console.error(err);
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-slate-100">
                <div className="flex flex-col items-center mb-6">
                    <div className="p-3 bg-blue-100 rounded-full text-primary mb-3">
                        <LogIn size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
                    <p className="text-slate-500 text-sm">Sign in with your registered email</p>
                </div>

                {error && <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button disabled={loading} className="w-full btn btn-primary flex justify-center py-2.5">
                        {loading ? "Logging In..." : "Log In"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    Need an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}
