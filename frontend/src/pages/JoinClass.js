import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function JoinClass() {
    const { api } = useAuth();
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [joined, setJoined] = useState(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await api.post("/classes/join", { class_code: code });
            setJoined(data.class);
        } catch (e) {
            setError(e.response?.data?.detail || "Failed to join class");
        } finally { setLoading(false); }
    };

    if (joined) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] p-4">
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#6D5AC1]/15 shadow-sm text-center max-w-md w-full">
                    <div className="w-16 h-16 rounded-2xl bg-[#6D5AC1]/10 flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-3xl text-[#6D5AC1]">check_circle</span>
                    </div>
                    <h2 className="font-headline text-xl sm:text-2xl font-extrabold mb-2 text-[#1A1A2E]">Joined Successfully!</h2>
                    <p className="text-gray-500 mb-2">{joined.name}</p>
                    <p className="text-sm text-gray-500 mb-6">{joined.subject} - Teacher: {joined.teacher_name}</p>
                    <button onClick={() => navigate("/dashboard")}
                        className="theme-btn-primary px-8 py-3 text-sm active:scale-[0.98] duration-200">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh] relative p-4">
            {/* Floating key icon */}
            <div className="absolute top-8 sm:top-0 left-1/2 -translate-x-1/2 -translate-y-8 z-20">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-br from-[#6D5AC1]/15 to-[#C9A84C]/10 flex items-center justify-center border border-[#6D5AC1]/15 shadow-sm">
                    <span className="material-symbols-outlined text-2xl sm:text-3xl text-[#6D5AC1]">vpn_key</span>
                </div>
            </div>

            <div className="bg-white p-6 sm:p-8 md:p-12 rounded-2xl border border-gray-200/60 shadow-[0_8px_40px_rgba(109,90,193,0.08)] max-w-xl w-full pt-12 sm:pt-16 mt-8 sm:mt-0">
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="font-headline font-black text-2xl sm:text-3xl tracking-tight mb-2 text-[#1A1A2E]">Join a New Class</h1>
                    <p className="text-gray-500 text-sm">Enter the 6-digit access code provided by your instructor to get started.</p>
                </div>

                {error && (
                    <div data-testid="join-error" className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm text-red-600 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">error</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 block text-center">Access Code</label>
                        <input
                            data-testid="join-class-code-input"
                            value={code}
                            onChange={e => setCode(e.target.value.toUpperCase())}
                            placeholder="XXXXXX"
                            className="w-full bg-white border border-gray-200 rounded-2xl h-14 sm:h-16 px-4 sm:px-6 text-center text-2xl sm:text-3xl font-headline font-bold tracking-[0.2em] sm:tracking-[0.4em] text-[#6D5AC1] focus:outline-none focus:border-[#6D5AC1]/50 focus:ring-2 focus:ring-[#6D5AC1]/10 transition-all uppercase placeholder:text-gray-300"
                            maxLength={6}
                            required
                        />
                    </div>

                    <button data-testid="join-class-submit" type="submit" disabled={loading || code.length < 4}
                        className="w-full theme-btn-primary h-12 text-sm active:scale-[0.98] duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span className="material-symbols-outlined text-lg">verified</span> Verify and Join</>}
                    </button>

                    <p className="text-center text-sm text-gray-400">
                        <span className="material-symbols-outlined text-xs align-middle mr-1">help</span>
                        Need help with your code?
                    </p>
                </form>

                <div className="mt-8 flex justify-center">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#1A1A2E] transition-colors">
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                        Back to Courses
                    </button>
                </div>
            </div>
        </div>
    );
}
