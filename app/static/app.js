// CodexAI - Consolidated Unified React Application
// Transpiled on-the-fly in browser via Babel Standalone

const { useState, useEffect, useRef, createContext, useContext } = React;
const { 
    Terminal, Sparkles, ArrowRight, Code2, Trophy, Zap, Award, 
    MessageSquare, CheckCircle2, KeyRound, Mail, AlertCircle, User, 
    Play, ChevronRight, Coins, Flame, Search, Tag, BookOpen, 
    HelpCircle, Sparkle, Loader2, CheckCircle, Clock, ShieldCheck, 
    Heart, Download, ShieldAlert, Trash2, Plus, Menu, LogOut, Settings, Send, Briefcase
} = LucideReact;

// ==========================================
// RENDER MARKDOWN HELPER
// ==========================================
const renderMarkdown = (text) => {
    if (!text) return '';
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
        
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre class="bg-slate-950 border border-slate-850 p-4 rounded-xl my-3 overflow-x-auto font-mono text-xs text-indigo-200"><code class="language-${lang}">${code.trim()}</code></pre>`;
    });

    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded text-indigo-400 font-mono text-xs">$1</code>');
    html = html.replace(/^### (.*$)/gim, '<h4 class="text-sm font-bold text-white mt-4 mb-2">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 class="text-base font-extrabold text-white mt-5 mb-2 font-outfit">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 class="text-lg font-extrabold text-white mt-6 mb-3 font-outfit">$1</h2>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4 list-disc text-slate-300 my-1">$1</li>');

    const paragraphs = html.split('\n');
    let output = '';
    let inList = false;
    
    paragraphs.forEach(line => {
        let trimmed = line.trim();
        if (trimmed.startsWith('<li')) {
            if (!inList) {
                output += '<ul class="space-y-1 my-2">';
                inList = true;
            }
            output += line;
        } else if (trimmed.startsWith('<pre') || trimmed.startsWith('<h') || trimmed === '') {
            if (inList) {
                output += '</ul>';
                inList = false;
            }
            output += line + '\n';
        } else {
            if (inList) {
                output += '</ul>';
                inList = false;
            }
            output += `<p class="my-2 text-slate-305 leading-relaxed">${line}</p>`;
        }
    });
    
    if (inList) {
        output += '</ul>';
    }
    
    return output;
};

// ==========================================
// 1. AUTH CONTEXT
// ==========================================
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMe = async (authToken) => {
        try {
            const res = await fetch('/api/v1/auth/me', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            } else {
                logout();
            }
        } catch (e) {
            console.error("Failed to fetch user profiles", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchMe(token);
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        window.location.hash = '#/login';
    };

    const refreshUser = async () => {
        if (token) {
            await fetchMe(token);
        }
    };

    return (
        <AuthContext.Provider value={{ token, user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

// ==========================================
// 2. LANDING PAGE
// ==========================================
const LandingPage = () => {
    return (
        <div class="relative overflow-hidden min-h-screen flex flex-col justify-between">
            <header class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between z-10">
                <div class="flex items-center gap-2 text-2xl font-bold tracking-tight text-white font-outfit">
                    <div class="bg-indigo-600 p-1.5 rounded-lg text-white glow-indigo">
                        <Terminal size={22} />
                    </div>
                    <span>Prajna</span>
                </div>
                <div class="flex items-center gap-4">
                    <a href="#/login" class="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Sign In</a>
                    <a href="#/register" class="px-4 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white rounded-xl shadow-lg shadow-indigo-600/20">
                        Get Started Free
                    </a>
                </div>
            </header>

            <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
                <div class="flex-1 text-center lg:text-left space-y-6">
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                        <Sparkles size={12} class="animate-pulse" />
                        Next-Gen AI DSA Platform
                    </div>
                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-outfit leading-[1.15]">
                        Master Coding & DSA <br />
                        <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent glow-text">
                            Powered with Gemini AI
                        </span>
                    </h1>
                    <p class="text-slate-400 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed">
                        Solve curated challenges, compile code locally, and receive instant AI explanation, reviews, roadmap planning, and mock interviews from our cutting-edge AI coach.
                    </p>
                    <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <a href="#/register" class="w-full sm:w-auto px-8 py-4 text-center font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group transition-all duration-300">
                            Start Coding Now
                            <ArrowRight size={18} class="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="#/login" class="w-full sm:w-auto px-8 py-4 text-center font-semibold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 rounded-2xl transition-all">
                            Demo Practice
                        </a>
                    </div>
                </div>

                <div class="flex-1 w-full max-w-2xl lg:max-w-none relative">
                    <div class="absolute inset-0 rounded-2xl bg-indigo-500/5 blur-3xl"></div>
                    <div class="glass-card rounded-2xl p-6 glow-indigo relative border border-slate-800/80 overflow-hidden shadow-2xl">
                        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                            <div class="flex items-center gap-1.5">
                                <span class="w-3 h-3 rounded-full bg-red-500/80"></span>
                                <span class="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                                <span class="w-3 h-3 rounded-full bg-green-500/80"></span>
                                <span class="text-slate-500 text-xs ml-2 font-mono">two_sum.py</span>
                            </div>
                            <div class="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-semibold font-mono">Gemini AI Review Active</div>
                        </div>
                        <div class="pt-4 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto min-h-[220px]">
                            <p class="text-slate-500"># Find indices of two numbers that add to target</p>
                            <p><span class="text-indigo-400">def</span> <span class="text-purple-400">twoSum</span>(nums, target):</p>
                            <p class="pl-4">seen = {}</p>
                            <p class="pl-4"><span class="text-indigo-400">for</span> i, num <span class="text-indigo-400">in</span> <span class="text-purple-400">enumerate</span>(nums):</p>
                            <p class="pl-8">compl = target - num</p>
                            <p class="pl-8"><span class="text-indigo-400">if</span> compl <span class="text-indigo-400">in</span> seen:</p>
                            <p class="pl-12 text-emerald-400"><span class="text-indigo-400">return</span> [seen[compl], i]</p>
                            <p class="pl-8">seen[num] = i</p>
                            <p class="pl-4 text-slate-500"># Time Complexity: O(N) | Space Complexity: O(N)</p>
                        </div>
                        <div class="mt-4 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/20 space-y-2">
                            <div class="flex items-center gap-1.5 text-xs text-indigo-400 font-bold">
                                <Sparkles size={14} class="text-indigo-400 animate-spin" />
                                AI CODE COACH
                            </div>
                            <p class="text-xs text-slate-300">
                                This implementation is optimal. Your hash map correctly solves the challenge in a single pass with O(N) time and O(N) space complexity. Excellent work!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-slate-900 relative z-10 w-full">
                <div class="text-center max-w-2xl mx-auto space-y-4 mb-16">
                    <h2 class="text-3xl font-extrabold text-white font-outfit">Packed with Winning Features</h2>
                    <p class="text-slate-400 text-sm sm:text-base">Everything you need to master coding interviews and build technical strength.</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div class="glass-card rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/50 hover:shadow-indigo-500/5 transition-all duration-300 group">
                        <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Code2 size={20} />
                        </div>
                        <h3 class="text-lg font-bold text-white mb-2">Rich Code Playground</h3>
                        <p class="text-slate-400 text-xs sm:text-sm leading-relaxed">Write code using Monaco Editor, execute it instantly, and evaluate output against custom and hidden test cases.</p>
                    </div>

                    <div class="glass-card rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/50 hover:shadow-indigo-500/5 transition-all duration-300 group">
                        <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Sparkles size={20} />
                        </div>
                        <h3 class="text-lg font-bold text-white mb-2">Google Gemini AI Integration</h3>
                        <p class="text-slate-400 text-xs sm:text-sm leading-relaxed">Generate progressive hints, explain code blocks line-by-line, review style/efficiency, and request algorithmic optimizations.</p>
                    </div>

                    <div class="glass-card rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/50 hover:shadow-indigo-500/5 transition-all duration-300 group">
                        <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Trophy size={20} />
                        </div>
                        <h3 class="text-lg font-bold text-white mb-2">Virtual Contest Engine</h3>
                        <p class="text-slate-400 text-xs sm:text-sm leading-relaxed">Participate in weekly timed challenges, climb global XP leaderboards, and review submissions in real-time.</p>
                    </div>

                    <div class="glass-card rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/50 hover:shadow-indigo-500/5 transition-all duration-300 group">
                        <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Zap size={20} />
                        </div>
                        <h3 class="text-lg font-bold text-white mb-2">Company Prep Kits</h3>
                        <p class="text-slate-400 text-xs sm:text-sm leading-relaxed">Curated lists of questions and frequently asked topics for FAANG & top tier companies like Google, Meta, and Amazon.</p>
                    </div>

                    <div class="glass-card rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/50 hover:shadow-indigo-500/5 transition-all duration-300 group">
                        <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Award size={20} />
                        </div>
                        <h3 class="text-lg font-bold text-white mb-2">Gamification System</h3>
                        <p class="text-slate-400 text-xs sm:text-sm leading-relaxed">Earn points, coins, level up, maintain daily activity streaks, and unlock prestigious technical badges.</p>
                    </div>

                    <div class="glass-card rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/50 hover:shadow-indigo-500/5 transition-all duration-300 group">
                        <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <MessageSquare size={20} />
                        </div>
                        <h3 class="text-lg font-bold text-white mb-2">AI Technical Interview Coach</h3>
                        <p class="text-slate-400 text-xs sm:text-sm leading-relaxed">Interact with an AI interviewer in real-time, reply to questions, and receive detailed scoring, feedback, and optimization guidance.</p>
                    </div>
                </div>
            </section>

            <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-slate-900 relative z-10 w-full">
                <div class="max-w-md mx-auto glass-card rounded-3xl p-8 border border-slate-800/80 glow-indigo text-center relative overflow-hidden shadow-2xl">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 rounded-full blur-xl"></div>
                    <span class="px-3 py-1 text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full uppercase">Standard Plan</span>
                    <h3 class="text-2xl font-extrabold text-white mt-4 font-outfit">Free Tier</h3>
                    <div class="mt-6 flex items-baseline justify-center">
                        <span class="text-5xl font-extrabold text-white font-outfit">$0</span>
                        <span class="text-slate-400 text-sm ml-1">/ lifetime</span>
                    </div>
                    <ul class="mt-8 space-y-4 text-left">
                        <li class="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 size={16} class="text-indigo-400 flex-shrink-0" />
                            <span>Access to all 14+ seeded DSA problems</span>
                        </li>
                        <li class="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 size={16} class="text-indigo-400 flex-shrink-0" />
                            <span>Local Python/JS Code Compilation</span>
                        </li>
                        <li class="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 size={16} class="text-indigo-400 flex-shrink-0" />
                            <span>Google Gemini AI Features (Review, Optimize)</span>
                        </li>
                        <li class="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 size={16} class="text-indigo-400 flex-shrink-0" />
                            <span>AI Mock Interviews & Resume Reviews</span>
                        </li>
                        <li class="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 size={16} class="text-indigo-400 flex-shrink-0" />
                            <span>Weekly contests & leaderboards</span>
                        </li>
                    </ul>
                    <a href="#/register" class="block w-full mt-8 py-3 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 active:scale-98 transition-all">
                        Register Free Now
                    </a>
                </div>
            </section>

            <footer class="w-full border-t border-slate-900 py-8 text-center text-xs text-slate-550 z-10 bg-slate-950/40">
                <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div class="text-center sm:text-left space-y-1">
                        <p class="font-extrabold text-slate-300 text-sm font-outfit">Prajna</p>
                        <p class="text-[10px] text-slate-500 italic">Prajna means supreme intelligence, wisdom, or understanding</p>
                        <p class="text-[10px]">© 2026 Prajna. All rights reserved.</p>
                    </div>
                    <div class="flex flex-col items-center sm:items-end gap-2 text-slate-400">
                        <p class="text-[11px] font-bold font-sans">Made by <span class="text-indigo-400 font-extrabold">Nishant Pathak</span></p>
                        <div class="flex gap-4">
                            <a href="https://instagram.com/nishantt.pathakk" target="_blank" rel="noopener noreferrer" class="hover:text-pink-400 transition-colors font-medium">Instagram</a>
                            <a href="https://github.com/YantrikMinds" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors font-medium">GitHub</a>
                            <a href="https://www.linkedin.com/in/nishant-pathak-a55a9231b" target="_blank" rel="noopener noreferrer" class="hover:text-blue-400 transition-colors font-medium">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// ==========================================
// 3. LOGIN PAGE
// ==========================================
const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData.toString()
            });

            if (res.ok) {
                const tokenData = await res.json();
                
                const profileRes = await fetch('/api/v1/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${tokenData.access_token}`
                    }
                });
                
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    login(tokenData.access_token, profileData);
                    window.location.hash = '#/dashboard';
                } else {
                    setError('Failed to load user profile details.');
                }
            } else {
                const errData = await res.json();
                setError(errData.detail || 'Incorrect email or password.');
            }
        } catch (err) {
            setError('Unable to connect to the backend server.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
            <div class="absolute inset-0 bg-dark-950 grid-bg z-[-2]"></div>
            <div class="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-indigo-900/10 blur-[100px] z-[-1]"></div>

            <div class="w-full max-w-md space-y-8 glass-card p-8 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
                <div class="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl"></div>
                
                <div class="text-center space-y-2">
                    <a href="#/" class="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-white font-outfit">
                        <div class="bg-indigo-600 p-1.5 rounded-lg text-white glow-indigo">
                            <Terminal size={20} />
                        </div>
                        <span>Prajna</span>
                    </a>
                    <h2 class="text-xl font-extrabold text-white mt-4 font-outfit">Welcome Back</h2>
                    <p class="text-xs text-slate-400">Enter your credentials to access your dashboard</p>
                </div>

                {error && (
                    <div class="p-3.5 rounded-xl bg-red-950/40 border border-red-500/20 text-xs text-red-300 flex items-start gap-2 animate-shake">
                        <AlertCircle size={15} class="flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form class="space-y-5" onSubmit={handleSubmit}>
                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                <Mail size={16} />
                            </div>
                            <input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-505 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Password</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                <KeyRound size={16} />
                            </div>
                            <input 
                                type="password" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-505 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={submitting}
                        class="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-98 transition-all text-sm font-bold text-white rounded-xl flex items-center justify-center gap-1.5 cursor-pointer font-outfit"
                    >
                        {submitting ? 'Signing In...' : 'Sign In'}
                        {!submitting && <ArrowRight size={15} />}
                    </button>
                </form>

                <div class="text-center pt-4 border-t border-slate-900 text-xs text-slate-400">
                    Don't have an account?{' '}
                    <a href="#/register" class="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2">Register free</a>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 4. REGISTER PAGE
// ==========================================
const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const res = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    full_name: fullName,
                    password
                })
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    window.location.hash = '#/login';
                }, 2000);
            } else {
                const errData = await res.json();
                setError(errData.detail || 'Failed to register account.');
            }
        } catch (err) {
            setError('Unable to connect to the backend server.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
            <div class="absolute inset-0 bg-dark-950 grid-bg z-[-2]"></div>
            <div class="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-purple-900/10 blur-[100px] z-[-1]"></div>

            <div class="w-full max-w-md space-y-8 glass-card p-8 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
                <div class="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-xl"></div>
                
                <div class="text-center space-y-2">
                    <a href="#/" class="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-white font-outfit">
                        <div class="bg-indigo-600 p-1.5 rounded-lg text-white glow-indigo">
                            <Terminal size={20} />
                        </div>
                        <span>Prajna</span>
                    </a>
                    <h2 class="text-xl font-extrabold text-white mt-4 font-outfit">Create Account</h2>
                    <p class="text-xs text-slate-400">Join our platform and sharpen your technical skills</p>
                </div>

                {success ? (
                    <div class="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300 text-center animate-pulse">
                        <p class="font-bold text-sm mb-1">Registration Successful!</p>
                        <p>Redirecting you to the login screen...</p>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div class="p-3.5 rounded-xl bg-red-950/40 border border-red-500/20 text-xs text-red-300 flex items-start gap-2 animate-shake">
                                <AlertCircle size={15} class="flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form class="space-y-5" onSubmit={handleSubmit}>
                            <div class="space-y-1">
                                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Full Name</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                        <User size={16} />
                                    </div>
                                    <input 
                                        type="text" 
                                        required 
                                        value={fullName} 
                                        onChange={(e) => setFullName(e.target.value)}
                                        class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-505 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div class="space-y-1">
                                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                        <Mail size={16} />
                                    </div>
                                    <input 
                                        type="email" 
                                        required 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-505 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div class="space-y-1">
                                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Password (min 6 chars)</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                        <KeyRound size={16} />
                                    </div>
                                    <input 
                                        type="password" 
                                        required 
                                        minLength={6}
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)}
                                        class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-505 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                class="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-98 transition-all text-sm font-bold text-white rounded-xl flex items-center justify-center gap-1.5 cursor-pointer font-outfit"
                            >
                                {submitting ? 'Registering...' : 'Register'}
                                {!submitting && <ArrowRight size={15} />}
                            </button>
                        </form>
                    </>
                )}

                <div class="text-center pt-4 border-t border-slate-900 text-xs text-slate-400">
                    Already have an account?{' '}
                    <a href="#/login" class="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2">Sign In</a>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 5. DASHBOARD PAGE
// ==========================================
const DashboardPage = () => {
    const { token, user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const chartRef = useRef(null);

    if (!token) {
        window.location.hash = '#/login';
        return null;
    }

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/v1/profile/dashboard-stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            } else {
                setError('Failed to load dashboard metrics.');
            }
        } catch (e) {
            setError('Error connecting to the API.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [token]);

    useEffect(() => {
        if (!loading && stats && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            
            const labels = Object.keys(stats.weekly_chart).map(d => {
                const parts = d.split('-');
                return parts.length === 3 ? `${parts[1]}/${parts[2]}` : d;
            });
            const dataValues = Object.values(stats.weekly_chart);
            const isAllZero = stats.total_solved === 0;

            const chartData = {
                labels: labels.length ? labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Accepted Solves',
                    data: isAllZero ? [0, 0, 0, 0, 0, 0, 0] : (dataValues.length ? dataValues : [0, 0, 0, 0, 0, 0, 0]),
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                }]
            };

            const myChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.04)' },
                            ticks: { color: '#64748b' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#64748b' }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });

            return () => myChart.destroy();
        }
    }, [loading, stats]);

    if (loading) {
        return (
            <div class="min-h-[80vh] flex items-center justify-center text-white">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div class="max-w-7xl mx-auto px-4 py-8 text-center text-red-400">
                {error}
            </div>
        );
    }

    const generateHeatmapGrid = () => {
        const grid = [];
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - 365);
        
        const startDay = start.getDay();
        start.setDate(start.getDate() - startDay);

        const current = new Date(start);
        
        while (current <= today) {
            const dateStr = current.toISOString().split('T')[0];
            const count = stats.heatmap[dateStr] || 0;
            grid.push({
                date: dateStr,
                count: count
            });
            current.setDate(current.getDate() + 1);
        }
        return grid;
    };

    const heatmapCells = generateHeatmapGrid();
    
    let userBadges = [];
    try {
        userBadges = JSON.parse(stats.badges);
    } catch(e) {
        userBadges = ["Welcome Member"];
    }

    return (
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl border border-slate-800">
                <div class="absolute inset-0 bg-gradient-to-r from-indigo-900/10 to-transparent pointer-events-none"></div>
                <div class="flex items-center gap-5">
                    <div class="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold font-outfit shadow-lg shadow-indigo-600/30">
                        {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 class="text-2xl font-extrabold text-white font-outfit">Hello, {user.full_name}</h1>
                        <p class="text-xs sm:text-sm text-indigo-300 font-medium">Rank #{stats.rank} globally | Level {Math.floor(stats.xp / 1000) + 1}</p>
                    </div>
                </div>
                
                <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-slate-900/60 border border-slate-800 px-6 py-4 rounded-2xl">
                    <div class="text-center px-2">
                        <span class="text-xs text-slate-400 block font-semibold uppercase tracking-wider">XP Earned</span>
                        <span class="text-xl font-bold text-slate-100">{stats.xp}</span>
                    </div>
                    <div class="w-px h-8 bg-slate-800"></div>
                    <div class="text-center px-2">
                        <span class="text-xs text-slate-400 block font-semibold uppercase tracking-wider font-outfit flex items-center gap-1">Coins</span>
                        <span class="text-xl font-bold text-yellow-400">{stats.coins}</span>
                    </div>
                    <div class="w-px h-8 bg-slate-800"></div>
                    <div class="text-center px-2">
                        <span class="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Streak</span>
                        <span class="text-xl font-bold text-amber-500">🔥 {stats.streak} Days</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between shadow-lg">
                    <div>
                        <h3 class="text-lg font-bold text-white mb-6 font-outfit">Solved Problems</h3>
                        
                        <div class="space-y-6">
                            <div>
                                <div class="flex justify-between text-xs font-semibold mb-2">
                                    <span class="text-emerald-400">Easy ({stats.solved_counts.Easy} solved)</span>
                                    <span class="text-slate-500">Target: 30</span>
                                </div>
                                <div class="w-full bg-slate-900 rounded-full h-2">
                                    <div class="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (stats.solved_counts.Easy / 30) * 100)}%` }}></div>
                                </div>
                            </div>
                            
                            <div>
                                <div class="flex justify-between text-xs font-semibold mb-2">
                                    <span class="text-yellow-400">Medium ({stats.solved_counts.Medium} solved)</span>
                                    <span class="text-slate-500">Target: 50</span>
                                </div>
                                <div class="w-full bg-slate-900 rounded-full h-2">
                                    <div class="bg-yellow-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (stats.solved_counts.Medium / 50) * 100)}%` }}></div>
                                </div>
                            </div>

                            <div>
                                <div class="flex justify-between text-xs font-semibold mb-2">
                                    <span class="text-red-400">Hard ({stats.solved_counts.Hard} solved)</span>
                                    <span class="text-slate-500">Target: 20</span>
                                </div>
                                <div class="w-full bg-slate-900 rounded-full h-2">
                                    <div class="bg-red-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (stats.solved_counts.Hard / 20) * 100)}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="border-t border-slate-900 pt-6 mt-8 flex justify-between items-center text-sm font-semibold">
                        <span class="text-slate-300">Total Solved</span>
                        <span class="text-2xl font-bold text-white">{stats.total_solved}</span>
                    </div>
                </div>

                <div class="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-800 shadow-lg relative overflow-hidden">
                    <h3 class="text-lg font-bold text-white mb-6 font-outfit">Weekly Coding Analytics</h3>
                    <div class="h-64 relative">
                        <canvas ref={chartRef}></canvas>
                        {stats.total_solved === 0 && (
                            <div class="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 rounded-2xl z-10">
                                <div class="bg-indigo-500/10 p-3 rounded-2xl text-indigo-400 mb-2">
                                    <Code2 size={24} />
                                </div>
                                <p class="text-sm font-bold text-slate-105 font-outfit">Start attempting questions to get your progress report!</p>
                                <p class="text-[11px] text-slate-500 max-w-xs mt-1">Solve easy, medium, or hard DSA problems in the coding playground to unlock analytics tracking.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div class="glass-card rounded-3xl p-6 border border-slate-800 shadow-lg w-full overflow-x-auto">
                <h3 class="text-lg font-bold text-white mb-6 font-outfit">Coding Activity Heatmap</h3>
                <div class="flex flex-col gap-2 min-w-[700px]">
                    <div class="grid grid-flow-col grid-rows-7 gap-1">
                        {heatmapCells.map((cell, idx) => {
                            let color = 'bg-slate-800/40';
                            if (cell.count > 0 && cell.count <= 2) color = 'bg-indigo-900/40 border border-indigo-800/20';
                            else if (cell.count > 2 && cell.count <= 4) color = 'bg-indigo-700/60';
                            else if (cell.count > 4) color = 'bg-indigo-500 glow-indigo';
                            
                            return (
                                <div 
                                    key={idx}
                                    class={`w-2.5 h-2.5 rounded-sm ${color} transition-all duration-300 hover:scale-125`}
                                    title={`${cell.date}: ${cell.count} submissions`}
                                ></div>
                            );
                        })}
                    </div>
                    <div class="flex justify-end items-center gap-1.5 text-[10px] text-slate-500 font-semibold uppercase pr-2">
                        <span>Less</span>
                        <div class="w-2.5 h-2.5 rounded-sm bg-slate-800/40"></div>
                        <div class="w-2.5 h-2.5 rounded-sm bg-indigo-900/40"></div>
                        <div class="w-2.5 h-2.5 rounded-sm bg-indigo-700/60"></div>
                        <div class="w-2.5 h-2.5 rounded-sm bg-indigo-500"></div>
                        <span>More</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="glass-card rounded-3xl p-6 border border-slate-800 shadow-lg flex flex-col justify-between">
                    <div>
                        <h3 class="text-lg font-bold text-white mb-6 font-outfit">Unlocked Badges</h3>
                        <div class="flex flex-wrap gap-4">
                            {userBadges.map((badge, idx) => (
                                <div key={idx} class="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-colors">
                                    <div class="p-1 rounded bg-indigo-600/20 text-indigo-400">
                                        <Award size={16} />
                                    </div>
                                    <span class="text-xs font-bold text-slate-200">{badge}</span>
                                </div>
                            ))}
                            {userBadges.length === 0 && (
                                <p class="text-xs text-slate-500">No badges earned yet. Solve challenges to unlock them!</p>
                            )}
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-800 shadow-lg">
                    <h3 class="text-lg font-bold text-white mb-6 font-outfit">Recent Submissions</h3>
                    <div class="divide-y divide-slate-900 overflow-hidden">
                        {stats.recent_submissions.slice(0, 5).map((sub) => {
                            const isAccepted = sub.status === 'Accepted';
                            return (
                                <div key={sub.id} class="py-3.5 flex items-center justify-between hover:bg-slate-900/20 px-2 rounded-xl transition-colors">
                                    <div class="flex items-center gap-4">
                                        <div class={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg ${isAccepted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {sub.status}
                                        </div>
                                        <div>
                                            <span class="text-sm font-bold text-slate-100 block">{sub.problem_title}</span>
                                            <span class="text-[10px] text-slate-500 font-mono">Language: {sub.language}</span>
                                        </div>
                                    </div>
                                    <a href={`#/playground/${sub.problem_id}`} class="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors">
                                        <ChevronRight size={16} />
                                    </a>
                                </div>
                            );
                        })}
                        {stats.recent_submissions.length === 0 && (
                            <p class="text-xs text-slate-500 py-4 text-center">No submissions made yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 6. PROBLEMS PAGE
// ==========================================
const ProblemsPage = () => {
    const { token } = useAuth();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [allTags, setAllTags] = useState([]);

    const fetchProblems = async () => {
        try {
            const url = new URL('/api/v1/problems/', window.location.origin);
            const res = await fetch(url.toString(), {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            if (res.ok) {
                const data = await res.json();
                setProblems(data);
                
                const tagsSet = new Set();
                data.forEach(p => {
                    if (p.tags) {
                        p.tags.split(',').forEach(t => tagsSet.add(t.trim()));
                    }
                });
                setAllTags(Array.from(tagsSet));
            } else {
                setError('Failed to fetch problems from database.');
            }
        } catch (e) {
            setError('Error connecting to the API.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, [token]);

    const filteredProblems = problems.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                             p.tags.toLowerCase().includes(search.toLowerCase());
        const matchesDifficulty = difficulty === '' || p.difficulty.toLowerCase() === difficulty.toLowerCase();
        const matchesTag = selectedTag === '' || p.tags.split(',').map(t => t.trim().toLowerCase()).includes(selectedTag.toLowerCase());
        
        return matchesSearch && matchesDifficulty && matchesTag;
    });

    if (loading) {
        return (
            <div class="min-h-[80vh] flex items-center justify-center text-white">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 class="text-2xl font-extrabold text-white font-outfit">Coding Challenges</h1>
                    <p class="text-slate-400 text-xs sm:text-sm">Solve algorithms to level up your rank and unlock badges.</p>
                </div>
            </div>

            <div class="glass-card rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between border border-slate-800">
                <div class="relative w-full md:max-w-md">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-505">
                        <Search size={16} />
                    </div>
                    <input 
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search problems by name or tag..."
                        class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-850 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                    />
                </div>

                <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        class="py-2.5 px-4 rounded-xl bg-slate-900/80 border border-slate-850 text-xs text-slate-300 font-semibold focus:outline-none focus:border-indigo-500/50"
                    >
                        <option value="">All Difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>

                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        class="py-2.5 px-4 rounded-xl bg-slate-900/80 border border-slate-850 text-xs text-slate-300 font-semibold focus:outline-none focus:border-indigo-500/50"
                    >
                        <option value="">All Tags</option>
                        {allTags.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>
            </div>

            {error ? (
                <div class="p-4 rounded-xl bg-red-950/20 border border-red-500/10 text-xs text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            ) : (
                <div class="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-slate-900 bg-slate-950/30 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    <th class="py-4 px-6">Title</th>
                                    <th class="py-4 px-4">Difficulty</th>
                                    <th class="py-4 px-4">Topics</th>
                                    <th class="py-4 px-4">Companies</th>
                                    <th class="py-4 px-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-900 text-sm">
                                {filteredProblems.map((prob) => {
                                    let diffColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                                    if (prob.difficulty.toLowerCase() === 'medium') {
                                        diffColor = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
                                    } else if (prob.difficulty.toLowerCase() === 'hard') {
                                        diffColor = 'text-red-400 bg-red-500/10 border-red-500/20';
                                    }

                                    return (
                                        <tr key={prob.id} class="hover:bg-slate-900/10 transition-colors">
                                            <td class="py-4 px-6">
                                                <span class="font-extrabold text-slate-100 block">{prob.title}</span>
                                            </td>
                                            <td class="py-4 px-4">
                                                <span class={`inline-flex px-2 py-0.5 text-[10px] font-extrabold rounded-md border ${diffColor}`}>
                                                    {prob.difficulty}
                                                </span>
                                            </td>
                                            <td class="py-4 px-4">
                                                <div class="flex flex-wrap gap-1.5 max-w-[250px]">
                                                    {prob.tags.split(',').map((t, idx) => (
                                                        <span key={idx} class="text-[10px] font-medium text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850">
                                                            {t.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td class="py-4 px-4">
                                                <span class="text-xs text-slate-500 max-w-[200px] truncate block">{prob.company_tags || 'Generic'}</span>
                                            </td>
                                            <td class="py-4 px-6 text-right">
                                                <a 
                                                    href={`#/playground/${prob.id}`}
                                                    class="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/10 text-white rounded-xl transition-all cursor-pointer font-outfit"
                                                >
                                                    <Code2 size={13} />
                                                    Solve
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredProblems.length === 0 && (
                                    <tr>
                                        <td colspan="5" class="py-8 text-center text-xs text-slate-500 font-medium">
                                            No problems match your current filter selections.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// ==========================================
// 7. PLAYGROUND PAGE
// ==========================================
const PlaygroundPage = ({ problemId }) => {
    const { token } = useAuth();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('description');
    
    const [language, setLanguage] = useState('python');
    const [runLoading, setRunLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [customInput, setCustomInput] = useState('');
    const [consoleOutput, setConsoleOutput] = useState(null);
    const [consoleTab, setConsoleTab] = useState('testcase');
    
    const [aiTabOpen, setAiTabOpen] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiChatHistory, setAiChatHistory] = useState([
        { role: 'assistant', content: 'Hello! I am your AI Coding Coach. Ask me anything about this problem, or request standard actions like: Hints, Review, or Optimize!' }
    ]);
    const [aiInputValue, setAiInputValue] = useState('');
    const [hintsShown, setHintsShown] = useState([]);

    const editorRef = useRef(null);
    const containerRef = useRef(null);
    const aiChatEndRef = useRef(null);

    useEffect(() => {
        if (aiTabOpen) {
            setTimeout(() => {
                aiChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [aiChatHistory, aiTabOpen]);

    const fetchProblemDetail = async () => {
        try {
            const res = await fetch(`/api/v1/problems/${problemId}`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            if (res.ok) {
                const data = await res.json();
                setProblem(data);
                
                try {
                    const testCases = JSON.parse(data.test_cases);
                    if (testCases.length > 0) {
                        setCustomInput(testCases[0].input);
                    }
                } catch(e) {}
            } else {
                setError('Problem not found or failed to load.');
            }
        } catch (e) {
            setError('Error connecting to the API.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProblemDetail();
    }, [problemId]);

    useEffect(() => {
        if (problem && containerRef.current && window.require) {
            window.require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs' } });
            window.require(['vs/editor/editor.main'], function() {
                let starterCode = '';
                try {
                    const codes = JSON.parse(problem.starter_code);
                    starterCode = codes[language] || '';
                } catch(e) {
                    starterCode = '# Write your code here';
                }

                if (editorRef.current) {
                    editorRef.current.dispose();
                }

                const monacoLang = language === 'cpp' ? 'cpp' : (language === 'javascript' ? 'javascript' : 'python');

                editorRef.current = window.monaco.editor.create(containerRef.current, {
                    value: starterCode,
                    language: monacoLang,
                    theme: 'vs-dark',
                    automaticLayout: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono',
                    lineNumbers: 'on',
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                });
            });
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.dispose();
                editorRef.current = null;
            }
        };
    }, [problem, language]);

    const getEditorCode = () => {
        return editorRef.current ? editorRef.current.getValue() : '';
    };

    const handleRunCode = async () => {
        if (!token) {
            alert("Please login to run code.");
            return;
        }
        setRunLoading(true);
        setConsoleTab('result');
        setConsoleOutput({ status: 'Running...', stdout: 'Executing code locally...' });
        
        try {
            const res = await fetch('/api/v1/submissions/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    code: getEditorCode(),
                    language: language,
                    custom_input: customInput
                })
            });

            if (res.ok) {
                const data = await res.json();
                setConsoleOutput(data);
            } else {
                setConsoleOutput({ status: 'Runtime Error', stderr: 'Execution server returned status 500.' });
            }
        } catch (e) {
            setConsoleOutput({ status: 'Runtime Error', stderr: 'Failed to connect to backend execution API.' });
        } finally {
            setRunLoading(false);
        }
    };

    const handleSubmitCode = async () => {
        if (!token) {
            alert("Please login to submit code.");
            return;
        }
        setSubmitLoading(true);
        setConsoleTab('result');
        setConsoleOutput({ status: 'Submitting...', stdout: 'Evaluating code against all test cases...' });
        
        try {
            const res = await fetch('/api/v1/submissions/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    problem_id: parseInt(problemId),
                    code: getEditorCode(),
                    language: language
                })
            });

            if (res.ok) {
                const data = await res.json();
                setConsoleOutput({
                    status: data.status,
                    stdout: `Passed: ${data.passed_test_cases}/${data.total_test_cases} test cases.`,
                    stderr: data.error_message || '',
                    execution_time: data.execution_time,
                    memory: data.memory
                });
            } else {
                setConsoleOutput({ status: 'Evaluation Failed', stderr: 'Submissions server returned 500 error.' });
            }
        } catch (e) {
            setConsoleOutput({ status: 'Evaluation Failed', stderr: 'Failed to connect to backend submissions API.' });
        } finally {
            setSubmitLoading(false);
        }
    };

    const triggerAIHelper = async (type) => {
        setAiTabOpen(true);
        setAiLoading(true);
        
        const tempMsg = { role: 'user', content: `[Action: ${type.toUpperCase()}]` };
        setAiChatHistory(prev => [...prev, tempMsg]);

        try {
            let url = '';
            let body = {};
            
            if (type === 'explain') {
                url = '/api/v1/ai/explain';
                body = { code: getEditorCode(), language };
            } else if (type === 'review') {
                url = '/api/v1/ai/review';
                body = { 
                    code: getEditorCode(), 
                    language,
                    problem_title: problem.title,
                    problem_description: problem.description
                };
            } else if (type === 'optimize') {
                url = '/api/v1/ai/optimize';
                body = { 
                    code: getEditorCode(), 
                    language, 
                    problem_description: problem.description 
                };
            } else if (type === 'hint') {
                url = '/api/v1/ai/hints';
                body = {
                    problem_title: problem.title,
                    problem_description: problem.description,
                    code: getEditorCode(),
                    history_hints: hintsShown
                };
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                const data = await res.json();
                let outputText = data.review || data.explanation || data.optimized_code || data.hint || '';
                
                if (type === 'hint') {
                    setHintsShown([...hintsShown, outputText]);
                }
                
                setAiChatHistory(prev => [...prev, { role: 'assistant', content: outputText }]);
            } else {
                setAiChatHistory(prev => [...prev, { role: 'assistant', content: 'AI coach review failed. Please verify API key settings.' }]);
            }
        } catch (e) {
            setAiChatHistory(prev => [...prev, { role: 'assistant', content: 'Connection timed out to AI coach API services.' }]);
        } finally {
            setAiLoading(false);
        }
    };

    const sendAIChatMessage = async (e) => {
        if (e) e.preventDefault();
        if (!aiInputValue.trim() || aiLoading) return;

        const userMsg = { role: 'user', content: aiInputValue };
        const cleanHistoryForContext = aiChatHistory.filter(m => !m.content.startsWith('[Action:'));
        const updatedHistory = [...cleanHistoryForContext, userMsg];
        
        setAiChatHistory(prev => [...prev, userMsg]);
        setAiInputValue('');
        setAiLoading(true);

        try {
            const res = await fetch('/api/v1/ai/playground/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    code: getEditorCode(),
                    language: language,
                    problem_title: problem.title,
                    problem_description: problem.description,
                    chat_history: updatedHistory.slice(-10),
                    latest_message: userMsg.content
                })
            });

            if (res.ok) {
                const data = await res.json();
                setAiChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
            } else {
                setAiChatHistory(prev => [...prev, { role: 'assistant', content: 'Error: Failed to fetch AI response. Verify Groq/Gemini API configurations.' }]);
            }
        } catch (err) {
            setAiChatHistory(prev => [...prev, { role: 'assistant', content: 'Network error communicating with AI Chat Coach.' }]);
        } finally {
            setAiLoading(false);
        }
    };

    if (loading) {
        return (
            <div class="min-h-[80vh] flex items-center justify-center text-white">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error || !problem) {
        return (
            <div class="max-w-7xl mx-auto px-4 py-8 text-center text-red-400">
                {error || 'Problem details failed to initialize.'}
            </div>
        );
    }

    return (
        <div class="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full overflow-hidden bg-dark-950 animate-fadeIn">
            <div class="flex-1 flex flex-col border-r border-slate-900 overflow-hidden h-[50vh] lg:h-full min-w-[320px]">
                <div class="flex border-b border-slate-900 bg-slate-950/60 px-4 h-12 items-center justify-between">
                    <div class="flex gap-4">
                        <button 
                            onClick={() => setActiveTab('description')} 
                            class={`text-xs font-semibold py-2 px-1 border-b-2 transition-all ${activeTab === 'description' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                        >
                            Description
                        </button>
                        <button 
                            onClick={() => setActiveTab('editorial')} 
                            class={`text-xs font-semibold py-2 px-1 border-b-2 transition-all ${activeTab === 'editorial' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                        >
                            Editorial
                        </button>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto p-6 space-y-6">
                    {activeTab === 'description' ? (
                        <>
                            <div class="space-y-3">
                                <h1 class="text-2xl font-extrabold text-white font-outfit">{problem.title}</h1>
                                <div class="flex flex-wrap gap-2 items-center">
                                    <span class={`px-2 py-0.5 text-[10px] font-extrabold rounded-md ${problem.difficulty.toLowerCase() === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : (problem.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20')}`}>
                                        {problem.difficulty}
                                    </span>
                                    <span class="text-xs text-slate-505 font-medium">Limits: {problem.time_limit}s | {problem.memory_limit}MB</span>
                                </div>
                            </div>
                            
                            <div class="text-slate-350 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans border-b border-slate-900 pb-6">
                                {problem.description}
                            </div>

                            <div class="space-y-2">
                                <h4 class="text-xs font-bold text-slate-450 uppercase tracking-wider">Topic Tags</h4>
                                <div class="flex flex-wrap gap-1.5">
                                    {problem.tags.split(',').map((t, idx) => (
                                        <span key={idx} class="text-xs font-medium text-slate-305 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
                                            {t.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            {problem.company_tags && (
                                <div class="space-y-2">
                                    <h4 class="text-xs font-bold text-slate-450 uppercase tracking-wider">Frequently Asked At</h4>
                                    <div class="flex flex-wrap gap-1.5">
                                        {problem.company_tags.split(',').map((c, idx) => (
                                            <span key={idx} class="text-xs font-semibold text-indigo-400 px-2.5 py-1 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                                                {c.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div class="space-y-4">
                            <h2 class="text-lg font-bold text-white font-outfit">Official Solution Analysis</h2>
                            <div class="text-slate-350 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap bg-slate-900/40 p-4 border border-slate-800 rounded-2xl">
                                {problem.editorial || 'Official solution analysis not available for this problem.'}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div class="flex-[1.5] flex flex-col overflow-hidden h-[50vh] lg:h-full">
                <div class="flex border-b border-slate-900 bg-slate-950/60 px-4 h-12 items-center justify-between">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        class="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-200 focus:outline-none"
                    >
                        <option value="python">Python 3</option>
                        <option value="javascript">JavaScript (Node.js)</option>
                    </select>

                    <div class="flex gap-2">
                        <button onClick={() => triggerAIHelper('hint')} class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold hover:bg-indigo-500/20 transition-all">
                            <Sparkle size={13} />
                            Get Hint
                        </button>
                        <button onClick={() => triggerAIHelper('explain')} class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-850 transition-all">
                            Explain Code
                        </button>
                        <button onClick={() => triggerAIHelper('optimize')} class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-850 transition-all">
                            Optimize Code
                        </button>
                    </div>
                </div>

                <div class="flex-1 relative bg-[#1e1e1e]" ref={containerRef}></div>

                <div class="h-64 border-t border-slate-900 flex flex-col bg-slate-950">
                    <div class="flex justify-between items-center bg-slate-950 px-4 border-b border-slate-900 h-10 flex-shrink-0">
                        <div class="flex gap-4">
                            <button 
                                onClick={() => setConsoleTab('testcase')} 
                                class={`text-[10px] sm:text-xs font-bold py-1 transition-all ${consoleTab === 'testcase' ? 'text-indigo-400' : 'text-slate-400'}`}
                            >
                                Custom Input
                            </button>
                            <button 
                                onClick={() => setConsoleTab('result')} 
                                class={`text-[10px] sm:text-xs font-bold py-1 transition-all ${consoleTab === 'result' ? 'text-indigo-400' : 'text-slate-400'}`}
                            >
                                Execution Console
                            </button>
                        </div>
                        
                        <div class="flex gap-2">
                            <button 
                                onClick={handleRunCode}
                                disabled={runLoading || submitLoading}
                                class="px-4 py-1 text-[11px] font-extrabold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-100 rounded-lg flex items-center gap-1 transition-all disabled:opacity-50"
                            >
                                {runLoading ? <Loader2 size={11} class="animate-spin" /> : <Play size={11} />}
                                Run Code
                            </button>
                            <button 
                                onClick={handleSubmitCode}
                                disabled={runLoading || submitLoading}
                                class="px-4 py-1 text-[11px] font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-1 transition-all disabled:opacity-50 glow-indigo"
                            >
                                {submitLoading && <Loader2 size={11} class="animate-spin" />}
                                Submit Code
                            </button>
                        </div>
                    </div>

                    <div class="flex-1 overflow-y-auto p-4 font-mono text-xs text-slate-305">
                        {consoleTab === 'testcase' ? (
                            <textarea
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                class="w-full h-full bg-slate-900/50 border border-slate-850 p-3 rounded-xl focus:outline-none text-slate-100 placeholder-slate-650 font-mono text-sm leading-relaxed"
                                placeholder="Write custom input to test your code execution..."
                            />
                        ) : (
                            <div class="space-y-3 h-full">
                                {consoleOutput ? (
                                    <>
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs text-slate-500 uppercase font-semibold">Status:</span>
                                            <span class={`font-bold px-2 py-0.5 rounded ${consoleOutput.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                {consoleOutput.status}
                                            </span>
                                            {consoleOutput.execution_time !== undefined && (
                                                <span class="text-[10px] text-slate-505">({consoleOutput.execution_time}s)</span>
                                            )}
                                        </div>
                                        
                                        {consoleOutput.stdout && (
                                            <div>
                                                <span class="text-[10px] text-slate-500 uppercase font-semibold block mb-1">Standard Output:</span>
                                                <pre class="bg-slate-900 border border-slate-850 p-3 rounded-xl text-slate-100 overflow-x-auto whitespace-pre-wrap max-h-32 leading-relaxed">{consoleOutput.stdout}</pre>
                                            </div>
                                        )}

                                        {consoleOutput.stderr && (
                                            <div>
                                                <span class="text-[10px] text-red-450 uppercase font-semibold block mb-1">Error Stream:</span>
                                                <pre class="bg-red-950/20 border border-red-900/30 p-3 rounded-xl text-red-300 overflow-x-auto whitespace-pre-wrap max-h-32 leading-relaxed">{consoleOutput.stderr}</pre>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p class="text-slate-505 py-4 text-center">Run or Submit your code to see the execution results here.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {aiTabOpen && (
                <div class="w-full lg:w-[360px] border-t lg:border-t-0 lg:border-l border-slate-900 bg-slate-950/95 flex flex-col h-[50vh] lg:h-full z-10">
                    <div class="flex items-center justify-between px-4 h-12 border-b border-slate-900 bg-slate-950 flex-shrink-0">
                        <div class="flex items-center gap-1.5 text-xs text-indigo-400 font-extrabold uppercase">
                            <Sparkles size={14} class="animate-pulse" />
                            AI Coding Coach
                        </div>
                        <button onClick={() => setAiTabOpen(false)} class="text-xs text-slate-405 hover:text-white font-bold">
                            Close
                        </button>
                    </div>
                    
                    <div class="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-950/40">
                        {aiChatHistory.map((msg, idx) => {
                            const isAction = msg.content.startsWith('[Action:');
                            if (isAction) {
                                const actionType = msg.content.replace('[Action: ', '').replace(']', '');
                                return (
                                    <div key={idx} class="flex items-center justify-center my-2">
                                        <span class="px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 font-mono">
                                            ⚙️ TRIGGERED: {actionType}
                                        </span>
                                    </div>
                                );
                            }
                            const isAI = msg.role === 'assistant';
                            return (
                                <div key={idx} class={`flex gap-2 max-w-[90%] ${isAI ? '' : 'ml-auto'}`}>
                                    {isAI && (
                                        <div class="w-6 h-6 rounded bg-indigo-600/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-1 animate-scaleUp">
                                            <Sparkles size={12} />
                                        </div>
                                    )}
                                    <div 
                                        class={`p-3 rounded-2xl text-[11px] sm:text-xs leading-relaxed font-sans shadow-inner ${isAI ? 'bg-slate-900/60 border border-slate-850 text-slate-200' : 'bg-indigo-600 text-white font-medium'}`}
                                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                                    />
                                </div>
                            );
                        })}
                        {aiLoading && (
                            <div class="flex items-center gap-2 text-[10px] text-slate-505 font-semibold uppercase tracking-wider pl-8">
                                <Loader2 size={12} class="animate-spin text-indigo-400" />
                                AI Coach is analyzing...
                            </div>
                        )}
                        <div ref={aiChatEndRef} />
                    </div>

                    <form onSubmit={sendAIChatMessage} class="h-16 border-t border-slate-900 bg-slate-950 px-3 flex items-center gap-2 flex-shrink-0">
                        <input
                            type="text"
                            required
                            value={aiInputValue}
                            onChange={(e) => setAiInputValue(e.target.value)}
                            placeholder="Ask follow-up questions..."
                            class="flex-grow bg-slate-900 border border-slate-850 py-2 px-3 rounded-xl text-xs text-slate-100 placeholder-slate-650 focus:outline-none focus:border-indigo-500/50"
                        />
                        <button
                            type="submit"
                            disabled={aiLoading}
                            class="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <Send size={13} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

// ==========================================
// 8. CONTESTS PAGE
// ==========================================
const ContestsPage = () => {
    const { token, user } = useAuth();
    const [contests, setContests] = useState([]);
    const [activeContest, setActiveContest] = useState(null);
    const [problems, setProblems] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [registered, setRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('contests');

    const fetchContests = async () => {
        try {
            const res = await fetch('/api/v1/contests/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setContests(data);
                if (data.length > 0) {
                    setActiveContest(data[0]);
                    checkRegistration(data[0].id);
                }
            } else {
                setError('Failed to fetch contests.');
            }
        } catch (e) {
            setError('Error connecting to backend API.');
        } finally {
            setLoading(false);
        }
    };

    const checkRegistration = async (contestId) => {
        if (!token) return;
        try {
            const res = await fetch(`/api/v1/contests/${contestId}/leaderboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLeaderboard(data);
                const isReg = data.some(entry => entry.user_id === user?.id);
                setRegistered(isReg);
            }
        } catch (e) {}
    };

    useEffect(() => {
        if (token) {
            fetchContests();
        }
    }, [token]);

    const handleRegister = async (contestId) => {
        try {
            const res = await fetch(`/api/v1/contests/${contestId}/register`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setRegistered(true);
                checkRegistration(contestId);
                alert("Registered successfully! You can now solve the contest problems.");
            } else {
                alert("Registration failed.");
            }
        } catch (e) {
            alert("Error registering.");
        }
    };

    const fetchContestProblems = async (contestId) => {
        try {
            const res = await fetch(`/api/v1/contests/${contestId}/problems`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProblems(data);
                setActiveTab('problems');
            } else {
                const err = await res.json();
                alert(err.detail || "Must register to view problems.");
            }
        } catch (e) {
            alert("Error loading contest problems.");
        }
    };

    if (loading) {
        return (
            <div class="min-h-[80vh] flex items-center justify-center text-white">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            <div>
                <h1 class="text-2xl font-extrabold text-white font-outfit">Virtual Contests</h1>
                <p class="text-slate-400 text-xs sm:text-sm">Compete in timed coding challenges and climb leaderboard rankings.</p>
            </div>

            {activeContest && (
                <div class="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden shadow-xl">
                    <div class="space-y-4">
                        <div class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            Active Contest
                        </div>
                        <h2 class="text-2xl font-extrabold text-white font-outfit">{activeContest.title}</h2>
                        <p class="text-slate-450 text-xs sm:text-sm max-w-xl leading-relaxed">{activeContest.description}</p>
                        
                        <div class="flex items-center gap-4 text-xs font-semibold text-slate-400">
                            <span class="flex items-center gap-1.5"><Clock size={14} /> Duration: {activeContest.duration_minutes} mins</span>
                        </div>
                    </div>

                    <div class="flex flex-col justify-center gap-3">
                        {!registered ? (
                            <button 
                                onClick={() => handleRegister(activeContest.id)}
                                class="px-6 py-3 font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 text-center cursor-pointer"
                            >
                                Register Now
                            </button>
                        ) : (
                            <div class="space-y-2">
                                <div class="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-xs font-bold text-emerald-400">
                                    ✓ Registered
                                </div>
                                <button 
                                    onClick={() => fetchContestProblems(activeContest.id)}
                                    class="w-full px-6 py-3 font-bold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl shadow-lg cursor-pointer"
                                >
                                    Enter Contest
                                </button>
                            </div>
                        )}
                        <button 
                            onClick={() => { setActiveTab('leaderboard'); checkRegistration(activeContest.id); }}
                            class="px-6 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl transition-all cursor-pointer"
                        >
                            View Rankings
                        </button>
                    </div>
                </div>
            )}

            {registered && (
                <div class="space-y-4 animate-fadeIn">
                    <div class="flex border-b border-slate-900 bg-slate-950/60 px-4 h-12 items-center justify-start gap-6 rounded-t-2xl">
                        <button 
                            onClick={() => setActiveTab('contests')} 
                            class={`text-xs font-semibold py-2 px-1 border-b-2 transition-all ${activeTab === 'contests' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                        >
                            Contest Info
                        </button>
                        <button 
                            onClick={() => fetchContestProblems(activeContest.id)} 
                            class={`text-xs font-semibold py-2 px-1 border-b-2 transition-all ${activeTab === 'problems' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                        >
                            Challenge Problems
                        </button>
                        <button 
                            onClick={() => { setActiveTab('leaderboard'); checkRegistration(activeContest.id); }} 
                            class={`text-xs font-semibold py-2 px-1 border-b-2 transition-all ${activeTab === 'leaderboard' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                        >
                            Leaderboard
                        </button>
                    </div>

                    <div class="glass-card rounded-b-3xl p-6 border-x border-b border-slate-800">
                        {activeTab === 'problems' && (
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {problems.map((prob) => (
                                    <div key={prob.id} class="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300">
                                        <div class="space-y-3">
                                            <span class={`inline-flex px-2 py-0.5 text-[9px] font-extrabold rounded border ${prob.difficulty.toLowerCase() === 'easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : (prob.difficulty.toLowerCase() === 'medium' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20')}`}>
                                                {prob.difficulty}
                                            </span>
                                            <h3 class="text-base font-extrabold text-white font-outfit">{prob.title}</h3>
                                            <p class="text-slate-450 text-xs line-clamp-3 leading-relaxed">{prob.description.replace(/[#*`]/g, '')}</p>
                                        </div>
                                        <a 
                                            href={`#/playground/${prob.id}`}
                                            class="w-full mt-6 py-2.5 text-center text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-1 cursor-pointer font-outfit"
                                        >
                                            Solve Challenge
                                        </a>
                                    </div>
                                ))}
                                {problems.length === 0 && (
                                    <p class="text-xs text-slate-500 text-center py-4 w-full col-span-full">No problems found for this contest.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'leaderboard' && (
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse">
                                    <thead>
                                        <tr class="border-b border-slate-900 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            <th class="py-3 px-4">Rank</th>
                                            <th class="py-3 px-4">Participant</th>
                                            <th class="py-3 px-4">Score</th>
                                            <th class="py-3 px-4">Finished Time</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-900 text-sm">
                                        {leaderboard.map((entry) => (
                                            <tr key={entry.user_id} class="hover:bg-slate-900/10 transition-colors">
                                                <td class="py-3 px-4 font-bold text-slate-350">#{entry.rank}</td>
                                                <td class="py-3 px-4 font-bold text-slate-100">{entry.full_name}</td>
                                                <td class="py-3 px-4 text-indigo-400 font-extrabold">{entry.score} pts</td>
                                                <td class="py-3 px-4 text-slate-505 text-xs">
                                                    {entry.finished_time ? new Date(entry.finished_time).toLocaleTimeString() : 'In Progress'}
                                                </td>
                                            </tr>
                                        ))}
                                        {leaderboard.length === 0 && (
                                            <tr>
                                                <td colspan="4" class="py-4 text-center text-xs text-slate-500 font-medium">No participants registered yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'contests' && (
                            <div class="space-y-4 text-slate-350 text-xs sm:text-sm leading-relaxed">
                                <p>Welcome to the Prajna Timed Challenge. Please read the instructions below before starting:</p>
                                <ul class="list-disc pl-5 space-y-2">
                                    <li>Ensure your code compiles and passes test cases within the limit.</li>
                                    <li>Points are allocated based on problem difficulty (Easy: 100, Medium: 200, Hard: 300).</li>
                                    <li>Rankings are sorted by score first, then by the duration taken to solve.</li>
                                    <li>Cheating or copy-pasting is strictly prohibited and monitored.</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ==========================================
// 9. COMPANY PREP PAGE
// ==========================================
const CompanyPrepPage = () => {
    const { token } = useAuth();
    const [problems, setProblems] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('Google');
    const [loading, setLoading] = useState(true);

    const companies = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix', 'Goldman Sachs'];

    const guides = {
        'Google': {
            difficulty: 'Hard/Medium',
            focus: 'Graphs, Dynamic Programming, Trees, Binary Search',
            tips: [
                'Focus on O(N) or O(log N) optimal solutions. Google interviewers expect deep complexity explanations.',
                'Be prepared to write clean recursive structures and verify edge cases before coding.',
                'They frequently ask modified Graph traversal and complex state-space search problems.'
            ],
            faqs: [
                { q: 'How many coding rounds are there at Google?', a: 'Typically 3-4 technical coding rounds focusing entirely on DSA and systems architecture.' },
                { q: 'Is mock interviewing helpful for Google?', a: 'Yes! Use Prajna\'s Mock Interview Coach specifically configured for Google technical roles to practice.' }
            ]
        },
        'Meta': {
            difficulty: 'Medium',
            focus: 'Sliding Window, Two Pointers, String Manipulation, Stack',
            tips: [
                'Speed is critical for Meta. You are expected to solve 2 medium problems in 45 minutes.',
                'Meta asks standard LeetCode problems heavily. Master the top 100 tagged Meta questions.',
                'Focus on communication. Talk through your optimal solution as you write it.'
            ],
            faqs: [
                { q: 'Does Meta test on system design?', a: 'Yes, they have 1 dedicated system design round for mid/senior software engineers.' }
            ]
        },
        'Amazon': {
            difficulty: 'Medium/Easy',
            focus: 'Hashing, Arrays, Heap, Priority Queue, Design Problems',
            tips: [
                'Amazon focuses heavily on Leadership Principles alongside coding. Prepare stories demonstrating Ownership and Customer Obsession.',
                'Frequently tests queue and heap data structures for streaming/ordering mock systems.',
                'Be comfortable debugging logic locally. Prajna playground is excellent practice.'
            ],
            faqs: [
                { q: 'What is the Amazon Online Assessment (OA)?', a: 'A 90-minute timed round containing 2 coding problems and a feedback survey.' }
            ]
        },
        'Microsoft': {
            difficulty: 'Medium',
            focus: 'Linked Lists, Binary Trees, Arrays, Hashing',
            tips: [
                'Master Linked List and Tree traversals. Microsoft interviewers love classic tree manipulation challenges.',
                'Focus on coding style, naming conventions, and modularity.',
                'Prepare for questions on testing. They will ask how you plan to test your code.'
            ],
            faqs: [
                { q: 'How is the final round at Microsoft?', a: 'A full loop of 4-5 rounds covering coding, design, and manager fit.' }
            ]
        },
        'Goldman Sachs': {
            difficulty: 'Medium/Hard',
            focus: 'Math, Dynamic Programming, Strings, Sorting',
            tips: [
                'Often tests strong mathematical logic and number theory questions (prime numbers, combinations).',
                'Focus on sliding window string parsing.',
                'Understand average vs worst-case complexity for sorting algorithms.'
            ],
            faqs: [
                { q: 'Does GS require strict memory optimization?', a: 'Yes. Memory allocation efficiency is closely evaluated.' }
            ]
        },
        'Netflix': {
            difficulty: 'Hard',
            focus: 'Concurrency, DP, System Design, Graph API',
            tips: [
                'Netflix holds a high bar. Focus on end-to-end design and highly optimized runtime performance.',
                'Understand multi-threading structures and concurrency models.',
                'Netflix looks for independent problem solvers who match their Freedom and Responsibility culture.'
            ],
            faqs: [
                { q: 'How are Netflix software roles structured?', a: 'Highly senior roles with deep system focus and outstanding compensation packages.' }
            ]
        }
    };

    const fetchProblems = async () => {
        try {
            const res = await fetch('/api/v1/problems/', {
                headers: { 'Authorization': token ? `Bearer ${token}` : '' }
            });
            if (res.ok) {
                const data = await res.json();
                setProblems(data);
            }
        } catch (e) {
            console.error("Failed to load problems for company prep page.", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, [token]);

    const activeGuide = guides[selectedCompany] || guides['Google'];

    const companyProblems = problems.filter(p => 
        p.company_tags && p.company_tags.toLowerCase().includes(selectedCompany.toLowerCase())
    );

    return (
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 class="text-2xl font-extrabold text-white font-outfit">Company Preparation Kits</h1>
                    <p class="text-slate-405 text-xs sm:text-sm font-medium">Get interview-ready with company-specific DSA sheets and guides.</p>
                </div>
            </div>

            <div class="flex flex-wrap gap-2.5">
                {companies.map(comp => (
                    <button
                        key={comp}
                        onClick={() => setSelectedCompany(comp)}
                        class={`px-5 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${selectedCompany === comp ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-white'}`}
                    >
                        {comp}
                    </button>
                ))}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="glass-card rounded-3xl p-6 border border-slate-800 space-y-6 shadow-lg h-fit animate-fadeIn">
                    <div class="space-y-1">
                        <span class="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider block">Interview Kit</span>
                        <h2 class="text-xl font-extrabold text-white font-outfit">{selectedCompany} Guide</h2>
                    </div>

                    <div class="space-y-4 text-xs sm:text-sm">
                        <div>
                            <span class="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Average Difficulty</span>
                            <span class="font-semibold text-slate-200">{activeGuide.difficulty}</span>
                        </div>
                        <div>
                            <span class="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Key DSA Focus Topics</span>
                            <span class="font-semibold text-slate-200">{activeGuide.focus}</span>
                        </div>
                    </div>

                    <div class="space-y-3 pt-4 border-t border-slate-905">
                        <span class="text-xs font-bold text-slate-200 block">Pro Preparation Tips</span>
                        <ul class="space-y-2 text-xs text-slate-405 leading-relaxed list-disc pl-4">
                            {activeGuide.tips.map((tip, idx) => (
                                <li key={idx}>{tip}</li>
                            ))}
                        </ul>
                    </div>

                    <div class="space-y-3 pt-4 border-t border-slate-905">
                        <span class="text-xs font-bold text-slate-200 block">Frequently Asked Questions</span>
                        {activeGuide.faqs.map((faq, idx) => (
                            <div key={idx} class="space-y-1 text-xs">
                                <p class="font-bold text-slate-300">Q: {faq.q}</p>
                                <p class="text-slate-405 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div class="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-800 shadow-lg">
                    <h3 class="text-lg font-bold text-white mb-6 font-outfit">Recommended DSA Sheet</h3>
                    
                    {loading ? (
                        <div class="flex items-center justify-center py-20 text-white">
                            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
                        </div>
                    ) : (
                        <div class="divide-y divide-slate-900">
                            {companyProblems.map((prob) => {
                                let diffColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                                if (prob.difficulty.toLowerCase() === 'medium') {
                                    diffColor = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
                                } else if (prob.difficulty.toLowerCase() === 'hard') {
                                    diffColor = 'text-red-400 bg-red-500/10 border-red-500/20';
                                }

                                return (
                                    <div key={prob.id} class="py-4 flex items-center justify-between hover:bg-slate-909/10 px-2 rounded-xl transition-all">
                                        <div class="space-y-1.5">
                                            <div class="flex items-center gap-2">
                                                <h4 class="text-sm font-extrabold text-slate-100">{prob.title}</h4>
                                                <span class={`px-1.5 py-0.5 text-[9px] font-extrabold rounded border ${diffColor}`}>
                                                    {prob.difficulty}
                                                </span>
                                            </div>
                                            <div class="flex gap-1.5">
                                                {prob.tags.split(',').map((t, idx) => (
                                                    <span key={idx} class="text-[9px] font-medium text-slate-500 px-1 py-0.5 rounded bg-slate-900 border border-slate-850">
                                                        {t.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <a
                                            href={`#/playground/${prob.id}`}
                                            class="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all cursor-pointer font-outfit"
                                        >
                                            <Code2 size={13} />
                                            Solve
                                        </a>
                                    </div>
                                );
                            })}
                            {companyProblems.length === 0 && (
                                <p class="text-xs text-slate-500 py-12 text-center font-medium">No custom problems tagged specifically for {selectedCompany} yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 10. PROFILE PAGE
// ==========================================
const ProfilePage = () => {
    const { token, user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [jd, setJd] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [aiFeedback, setAiFeedback] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/v1/profile/dashboard-stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (e) {
            console.error("Failed to load profile details.", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchStats();
    }, [token]);

    const handleResumeReview = async (e) => {
        e.preventDefault();
        if (!resumeText || !jd) {
            alert("Please fill in both the Resume Text and target Job Description.");
            return;
        }
        setAiLoading(true);
        setAiFeedback("Gemini is analyzing your resume against the target job description... please wait.");

        try {
            const res = await fetch('/api/v1/ai/resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    resume_text: resumeText,
                    target_job_description: jd
                })
            });

            if (res.ok) {
                const data = await res.json();
                setAiFeedback(data.feedback);
            } else {
                setAiFeedback("Failed to analyze resume. Please verify your Gemini API key.");
            }
        } catch (e) {
            setAiFeedback("Error connecting to AI API.");
        } finally {
            setAiLoading(false);
        }
    };

    const downloadCertificate = () => {
        if (!user || !stats) return;

        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, 800, 600);

        const gradient = ctx.createLinearGradient(0, 0, 800, 600);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(1, '#a855f7');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 15;
        ctx.strokeRect(20, 20, 760, 560);

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.strokeRect(35, 35, 730, 530);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 400, 120);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px sans-serif';
        ctx.fillText('This is proudly presented to', 400, 180);

        ctx.fillStyle = '#6366f1';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText(user.full_name.toUpperCase(), 400, 240);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '16px sans-serif';
        ctx.fillText('For outstanding dedication and technical achievement on Prajna.', 400, 300);
        
        ctx.fillStyle = '#94a3b8';
        ctx.font = '15px sans-serif';
        ctx.fillText(`Successfully completed ${stats.total_solved} DSA algorithms and accumulated ${stats.xp} XP points.`, 400, 340);

        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`CODING LEVEL: ${Math.floor(stats.xp / 1000) + 1}`, 400, 400);

        ctx.fillStyle = '#475569';
        ctx.fillRect(150, 480, 180, 1);
        ctx.fillRect(470, 480, 180, 1);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText('Prajna Platform Verification', 240, 500);
        ctx.fillText('Google Gemini AI Coach', 560, 500);

        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `prajna_certificate_${user.full_name.toLowerCase().replace(/ /g, '_')}.png`;
        link.href = url;
        link.click();
    };

    if (loading) {
        return (
            <div class="min-h-[80vh] flex items-center justify-center text-white">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
            </div>
        );
    }

    let userBadges = [];
    try {
        userBadges = JSON.parse(stats.badges);
    } catch(e) {
        userBadges = ["Welcome Member"];
    }

    return (
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col items-center text-center space-y-6 shadow-lg h-fit animate-fadeIn">
                    <div class="w-24 h-24 rounded-full bg-indigo-600/20 border-2 border-indigo-500/50 flex items-center justify-center text-4xl font-extrabold text-white shadow-xl font-outfit">
                        {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    
                    <div class="space-y-1">
                        <h2 class="text-xl font-extrabold text-white font-outfit">{user.full_name}</h2>
                        <p class="text-xs text-slate-505 font-mono">{user.email}</p>
                    </div>

                    <div class="w-full grid grid-cols-2 gap-4 pt-4 border-t border-slate-900 text-center">
                        <div class="space-y-0.5">
                            <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Solved Count</span>
                            <span class="text-lg font-bold text-white">{stats.total_solved}</span>
                        </div>
                        <div class="space-y-0.5">
                            <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Achievements</span>
                            <span class="text-lg font-bold text-white">{userBadges.length} Badges</span>
                        </div>
                    </div>

                    <button 
                        onClick={downloadCertificate}
                        class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-98 transition-all text-xs font-bold text-white rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10 cursor-pointer"
                    >
                        <Download size={15} />
                        Download Certificate
                    </button>
                </div>

                <div class="lg:col-span-2 space-y-8">
                    <div class="glass-card rounded-3xl p-6 border border-slate-800 shadow-lg space-y-4">
                        <h3 class="text-lg font-bold text-white font-outfit">Unlocked Milestone Badges</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {userBadges.map((badge, idx) => (
                                <div key={idx} class="p-4 rounded-2xl bg-slate-909/60 border border-slate-850 flex gap-3.5 items-start">
                                    <div class="p-2 rounded-xl bg-indigo-600/10 text-indigo-400">
                                        <Award size={20} />
                                    </div>
                                    <div class="space-y-1">
                                        <h4 class="text-sm font-bold text-slate-100">{badge}</h4>
                                        <p class="text-[10px] text-slate-500 font-medium font-sans">Earned by hitting DSA milestones on Prajna</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div class="glass-card rounded-3xl p-6 border border-slate-800 shadow-lg space-y-6 animate-fadeIn">
                        <div>
                            <h3 class="text-lg font-bold text-white font-outfit">AI Resume Feedback</h3>
                            <p class="text-xs text-slate-400">Compare your resume details directly against target Job Descriptions using Gemini.</p>
                        </div>

                        <form class="space-y-4" onSubmit={handleResumeReview}>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label class="text-[10px] font-bold text-slate-400 uppercase block">Resume Text</label>
                                    <textarea
                                        required
                                        value={resumeText}
                                        onChange={(e) => setResumeText(e.target.value)}
                                        placeholder="Paste your plain text resume details..."
                                        class="w-full h-32 p-3 rounded-xl bg-slate-900 border border-slate-850 text-xs text-slate-100 placeholder-slate-650 focus:outline-none"
                                    />
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-bold text-slate-400 uppercase block">Target Job Description</label>
                                    <textarea
                                        required
                                        value={jd}
                                        onChange={(e) => setJd(e.target.value)}
                                        placeholder="Paste the target job description requirements..."
                                        class="w-full h-32 p-3 rounded-xl bg-slate-900 border border-slate-850 text-xs text-slate-100 placeholder-slate-655 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={aiLoading}
                                class="py-3 px-5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 active:scale-98 transition-all text-white rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
                            >
                                <Sparkles size={14} />
                                {aiLoading ? 'Analyzing Resume...' : 'Analyze Resume'}
                            </button>
                        </form>

                        {aiFeedback && (
                            <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-850 shadow-inner animate-fadeIn">
                                <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-2">Gemini Analysis Report</span>
                                <pre class="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">{aiFeedback}</pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 11. MOCK INTERVIEW COACH PAGE
// ==========================================
const MockInterviewPage = () => {
    const { token } = useAuth();
    const [role, setRole] = useState('Full Stack Developer');
    const [topic, setTopic] = useState('Data Structures & Algorithms');
    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState('');
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (started) scrollToBottom();
    }, [messages, started]);

    const startInterview = async () => {
        setStarted(true);
        setLoading(true);
        setMessages([]);
        setFeedback('');

        try {
            const res = await fetch('/api/v1/ai/interview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    role: role,
                    topic: topic,
                    chat_history: []
                })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages([{ role: 'assistant', content: data.response }]);
            } else {
                setMessages([{ role: 'assistant', content: "Failed to initialize interview. Check Gemini API configurations." }]);
            }
        } catch (e) {
            setMessages([{ role: 'assistant', content: "Connection failure to the AI platform." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || loading) return;

        const newMsg = { role: 'user', content: inputValue };
        const updatedHistory = [...messages, newMsg];
        
        setMessages(updatedHistory);
        setInputValue('');
        setLoading(true);

        try {
            const res = await fetch('/api/v1/ai/interview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    role: role,
                    topic: topic,
                    chat_history: updatedHistory
                })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages([...updatedHistory, { role: 'assistant', content: data.response }]);
            } else {
                setMessages([...updatedHistory, { role: 'assistant', content: "Error: Failed to obtain response from technical coach." }]);
            }
        } catch (e) {
            setMessages([...updatedHistory, { role: 'assistant', content: "Connection timed out." }]);
        } finally {
            setLoading(false);
        }
    };

    const requestFeedback = async () => {
        setFeedbackLoading(true);
        setFeedback('AI Coach is evaluating your interview loop, calculating score, and packaging feedback report... please wait.');

        try {
            const updatedHistory = [...messages, { role: 'user', content: 'Please end the interview and provide detailed feedback.' }];
            const res = await fetch('/api/v1/ai/interview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    role: role,
                    topic: topic,
                    chat_history: updatedHistory
                })
            });

            if (res.ok) {
                const data = await res.json();
                setFeedback(data.response);
            } else {
                setFeedback('Feedback analysis aborted. Check API logs.');
            }
        } catch (e) {
            setFeedback('Network timeout checking feedback details.');
        } finally {
            setFeedbackLoading(false);
        }
    };

    return (
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 h-[calc(100vh-64px)] flex flex-col justify-between animate-fadeIn">
            {!started ? (
                <div class="max-w-md mx-auto glass-card p-8 rounded-3xl border border-slate-800/80 shadow-2xl relative space-y-6 mt-12 animate-scaleUp">
                    <div class="text-center space-y-2">
                        <div class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-3">
                            <Sparkles size={12} class="animate-pulse" />
                            Gemini AI Agent
                        </div>
                        <h2 class="text-2xl font-extrabold text-white font-outfit">AI Mock Interview Coach</h2>
                        <p class="text-xs text-slate-404">Select your preferences below to launch your mock interview loop</p>
                    </div>

                    <div class="space-y-4">
                        <div class="space-y-1">
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Career Role</label>
                            <select 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                                class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none"
                            >
                                <option value="Full Stack Developer">Full Stack Developer</option>
                                <option value="Frontend Engineer">Frontend Engineer</option>
                                <option value="Backend Architect">Backend Architect</option>
                                <option value="Mobile App Developer">Mobile App Developer</option>
                                <option value="AI / ML Engineer">AI / ML Engineer</option>
                            </select>
                        </div>

                        <div class="space-y-1">
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Interview Domain Topic</label>
                            <select 
                                value={topic} 
                                onChange={(e) => setTopic(e.target.value)}
                                class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none"
                            >
                                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                                <option value="System Design & Architecture">System Design & Architecture</option>
                                <option value="React Hooks & Frontend State">React Hooks & Frontend State</option>
                                <option value="Database Indexing & Caching">Database Indexing & Caching</option>
                                <option value="REST APIs & Microservices">REST APIs & Microservices</option>
                            </select>
                        </div>

                        <button 
                            onClick={startInterview}
                            class="w-full py-4 bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/20 text-sm font-bold text-white rounded-2xl active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-outfit"
                        >
                            <MessageSquare size={16} />
                            Start Mock Interview
                        </button>
                    </div>
                </div>
            ) : (
                <div class="flex flex-col lg:flex-row gap-8 flex-grow overflow-hidden h-full animate-fadeIn">
                    <div class="flex-grow flex flex-col glass-card border border-slate-800 rounded-3xl overflow-hidden h-[60vh] lg:h-[80vh]">
                        <div class="h-14 border-b border-slate-900 bg-slate-950 px-6 flex items-center justify-between">
                            <div>
                                <span class="text-xs font-bold text-indigo-400 font-outfit uppercase tracking-wider">{role} Interview</span>
                                <p class="text-[10px] text-slate-500 font-semibold uppercase">{topic}</p>
                            </div>
                            <button 
                                onClick={requestFeedback}
                                class="px-4.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg cursor-pointer"
                            >
                                End & Get Feedback
                            </button>
                        </div>

                        <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/40">
                            {messages.map((msg, idx) => {
                                const isAI = msg.role === 'assistant';
                                return (
                                    <div key={idx} class={`flex gap-3 max-w-[80%] ${isAI ? '' : 'ml-auto'}`}>
                                        {isAI && (
                                            <div class="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-1.5 animate-scaleUp">
                                                <Sparkles size={16} />
                                            </div>
                                        )}
                                        <div class={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow ${isAI ? 'bg-slate-900 border border-slate-850 text-slate-200' : 'bg-indigo-600 text-white'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            })}
                            {loading && (
                                <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold uppercase tracking-wider pl-12">
                                    <Sparkles size={12} class="animate-spin text-indigo-400" />
                                    AI Interviewer is thinking...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} class="h-16 border-t border-slate-900 bg-slate-950 px-4 flex items-center gap-3">
                            <input
                                type="text"
                                required
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type your response to the interviewer..."
                                class="flex-grow bg-slate-900 border border-slate-850 py-2.5 px-4 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-indigo-500/50"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                class="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>

                    {feedback && (
                        <div class="w-full lg:w-[380px] glass-card border border-slate-800 rounded-3xl p-6 overflow-y-auto h-[40vh] lg:h-[80vh] flex flex-col gap-4 animate-fadeIn">
                            <h3 class="text-base font-extrabold text-white font-outfit border-b border-slate-900 pb-3 flex items-center gap-1.5">
                                <Sparkles size={16} class="text-indigo-400" />
                                Performance Evaluation Report
                            </h3>
                            <pre class="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-850 flex-grow shadow-inner">
                                {feedback}
                            </pre>
                            <button
                                onClick={() => setStarted(false)}
                                class="w-full py-3 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-xs font-bold text-slate-205 rounded-xl cursor-pointer"
                            >
                                Restart Mock Loop
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ==========================================
// 12. ADMIN PAGE
// ==========================================
const AdminPage = () => {
    const { token, user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [tags, setTags] = useState('');
    const [companyTags, setCompanyTags] = useState('');
    const [testCases, setTestCases] = useState('[]');
    const [starterCode, setStarterCode] = useState('{}');
    const [editorial, setEditorial] = useState('');
    const [addingProblem, setAddingProblem] = useState(false);

    if (user?.role !== 'admin') {
        return (
            <div class="max-w-7xl mx-auto px-4 py-16 text-center text-red-400 flex flex-col items-center justify-center gap-4 animate-fadeIn">
                <ShieldAlert size={48} />
                <h2 class="text-xl font-bold font-outfit">Unauthorized Access</h2>
                <p class="text-xs text-slate-550">Only platform administrators can access this panel.</p>
            </div>
        );
    }

    const loadData = async () => {
        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            const resAnal = await fetch('/api/v1/admin/platform-analytics', { headers });
            const resUsers = await fetch('/api/v1/admin/users', { headers });

            if (resAnal.ok && resUsers.ok) {
                const dataAnal = await resAnal.json();
                const dataUsers = await resUsers.json();
                setAnalytics(dataAnal);
                setUsersList(dataUsers);
            } else {
                setError('Failed to fetch administrative records.');
            }
        } catch (e) {
            setError('Error connecting to the Admin API.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) loadData();
    }, [token]);

    const handleDeleteUser = async (userId) => {
        if (!confirm("Are you sure you want to delete this user account? This cannot be undone.")) return;
        try {
            const res = await fetch(`/api/v1/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert("User deleted successfully.");
                loadData();
            } else {
                const err = await res.json();
                alert(err.detail || "Deletion failed.");
            }
        } catch (e) {
            alert("Connection error occurred.");
        }
    };

    const handleCreateProblem = async (e) => {
        e.preventDefault();
        setAddingProblem(true);
        try {
            const res = await fetch('/api/v1/problems/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    difficulty,
                    tags,
                    company_tags: companyTags,
                    test_cases: testCases,
                    starter_code: starterCode,
                    editorial
                })
            });

            if (res.ok) {
                alert("Problem created successfully!");
                setTitle('');
                setDescription('');
                setTags('');
                setCompanyTags('');
                setTestCases('[]');
                setStarterCode('{}');
                setEditorial('');
                loadData();
            } else {
                const err = await res.json();
                alert(err.detail || "Failed to create problem.");
            }
        } catch (e) {
            alert("Failed to connect to API.");
        } finally {
            setAddingProblem(false);
        }
    };

    if (loading) {
        return (
            <div class="min-h-[80vh] flex items-center justify-center text-white">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 class="text-2xl font-extrabold text-white font-outfit flex items-center gap-2">
                        <ShieldCheck class="text-indigo-400" />
                        Admin Control Panel
                    </h1>
                    <p class="text-slate-400 text-xs sm:text-sm">Manage system users, problem configurations, and analytics logs.</p>
                </div>
            </div>

            {error && (
                <div class="p-3.5 rounded-xl bg-red-950/20 border border-red-500/10 text-xs text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {analytics && (
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                    <div class="glass-card rounded-2xl p-5 border border-slate-800 flex justify-between items-center shadow">
                        <div>
                            <span class="text-[10px] text-slate-550 font-bold uppercase tracking-wider block">Total Platform Users</span>
                            <span class="text-2xl font-extrabold text-white font-outfit mt-1 block">{analytics.total_users}</span>
                        </div>
                    </div>
                    <div class="glass-card rounded-2xl p-5 border border-slate-800 flex justify-between items-center shadow">
                        <div>
                            <span class="text-[10px] text-slate-550 font-bold uppercase tracking-wider block">Seeded DSA Challenges</span>
                            <span class="text-2xl font-extrabold text-white font-outfit mt-1 block">{analytics.total_problems}</span>
                        </div>
                    </div>
                    <div class="glass-card rounded-2xl p-5 border border-slate-800 flex justify-between items-center shadow">
                        <div>
                            <span class="text-[10px] text-slate-550 font-bold uppercase tracking-wider block">Total Submissions Processed</span>
                            <span class="text-2xl font-extrabold text-white font-outfit mt-1 block">{analytics.total_submissions}</span>
                        </div>
                    </div>
                </div>
            )}

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-1 glass-card rounded-3xl p-6 border border-slate-800 shadow-lg space-y-4 h-fit animate-fadeIn">
                    <h3 class="text-base font-bold text-white font-outfit">Platform Users</h3>
                    
                    <div class="divide-y divide-slate-900 overflow-y-auto max-h-[380px] pr-2">
                        {usersList.map((usr) => (
                            <div key={usr.id} class="py-3 flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <span class="text-xs font-bold text-slate-200 block">{usr.full_name}</span>
                                    <span class="text-[10px] text-slate-500 font-mono block">{usr.email}</span>
                                </div>
                                {usr.id !== user.id && (
                                    <button 
                                        onClick={() => handleDeleteUser(usr.id)}
                                        class="p-2 text-slate-550 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer animate-fadeIn"
                                        title="Delete user"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div class="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-800 shadow-lg space-y-6">
                    <h3 class="text-base font-bold text-white font-outfit flex items-center gap-1.5">
                        <Plus size={18} class="text-indigo-400" />
                        Create New DSA Challenge
                    </h3>
                    
                    <form class="space-y-4" onSubmit={handleCreateProblem}>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Problem Title</label>
                                <input
                                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Find Node in Binary Tree"
                                    class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-655 focus:outline-none"
                                />
                            </div>
                            <div class="space-y-1">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Difficulty</label>
                                <select
                                    value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                                    class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description (Markdown Supported)</label>
                            <textarea
                                required value={description} onChange={(e) => setDescription(e.target.value)}
                                placeholder="Write problem context, rules, examples..."
                                class="w-full h-32 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-655 focus:outline-none"
                            />
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Topic Tags (Comma Separated)</label>
                                <input
                                    type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                                    placeholder="e.g. Binary Tree, DFS, Recursion"
                                    class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-655 focus:outline-none"
                                />
                            </div>
                            <div class="space-y-1">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company Tags (Comma Separated)</label>
                                <input
                                    type="text" value={companyTags} onChange={(e) => setCompanyTags(e.target.value)}
                                    placeholder="e.g. Google, Amazon, Microsoft"
                                    class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-655 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Test Cases JSON Array</label>
                                <textarea
                                    required value={testCases} onChange={(e) => setTestCases(e.target.value)}
                                    class="w-full h-24 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-300 focus:outline-none"
                                />
                            </div>
                            <div class="space-y-1">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Starter Templates JSON Object</label>
                                <textarea
                                    required value={starterCode} onChange={(e) => setStarterCode(e.target.value)}
                                    class="w-full h-24 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-300 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Editorial / Solution Walkthrough</label>
                            <textarea
                                value={editorial} onChange={(e) => setEditorial(e.target.value)}
                                placeholder="Explain optimal approach, complexity analysis..."
                                class="w-full h-24 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-655 focus:outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={addingProblem}
                            class="py-3.5 px-6 font-bold bg-indigo-600 hover:bg-indigo-500 text-xs text-white rounded-xl shadow-lg shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
                        >
                            {addingProblem ? 'Adding Problem...' : 'Publish Challenge'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 12. MAIN APP CONTAINER & ROUTING SWITCH
// ==========================================
const AppContent = () => {
    const { user, logout, loading } = useAuth();
    const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentHash(window.location.hash || '#/');
            setMobileMenuOpen(false);
            window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    if (loading) {
        return (
            <div class="min-h-screen flex items-center justify-center bg-dark-950 text-white">
                <div class="relative w-16 h-16">
                    <div class="absolute w-full h-full rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin"></div>
                </div>
            </div>
        );
    }

    let pageComponent = <LandingPage />;
    const hash = currentHash;

    const showSidebarAndHeader = !['#/', '#/login', '#/register'].includes(hash);

    if (hash === '#/login') pageComponent = <LoginPage />;
    else if (hash === '#/register') pageComponent = <RegisterPage />;
    else if (hash === '#/dashboard') pageComponent = <DashboardPage />;
    else if (hash === '#/problems') pageComponent = <ProblemsPage />;
    else if (hash.startsWith('#/playground/')) {
        const problemId = hash.split('/').pop();
        pageComponent = <PlaygroundPage problemId={problemId} />;
    }
    else if (hash === '#/contests') pageComponent = <ContestsPage />;
    else if (hash === '#/prep') pageComponent = <CompanyPrepPage />;
    else if (hash === '#/profile') pageComponent = <ProfilePage />;
    else if (hash === '#/admin') pageComponent = <AdminPage />;
    else if (hash === '#/mock-interview') pageComponent = <MockInterviewPage />;

    const navItems = [
        { name: 'Dashboard', hash: '#/dashboard', icon: Trophy },
        { name: 'Problems', hash: '#/problems', icon: Code2 },
        { name: 'Contests', hash: '#/contests', icon: Trophy },
        { name: 'Company Prep', hash: '#/prep', icon: Briefcase },
        { name: 'Interview Coach', hash: '#/mock-interview', icon: MessageSquare },
        { name: 'Profile', hash: '#/profile', icon: User },
    ];

    if (user?.role === 'admin') {
        navItems.push({ name: 'Admin Panel', hash: '#/admin', icon: Settings });
    }

    return (
        <div class="min-h-screen flex flex-col">
            {showSidebarAndHeader && (
                <header class="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
                    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div class="flex items-center gap-6">
                            <a href="#/dashboard" class="flex items-center gap-2 text-xl font-bold tracking-tight text-white font-outfit">
                                <div class="bg-indigo-600 p-1.5 rounded-lg text-white glow-indigo">
                                    <Terminal size={20} />
                                </div>
                                <span>Prajna</span>
                            </a>
                            <nav class="hidden md:flex gap-6">
                                {navItems.map((item) => {
                                    const isActive = hash.startsWith(item.hash);
                                    return (
                                        <a 
                                            key={item.name} 
                                            href={item.hash} 
                                            class={`text-sm font-medium transition-colors hover:text-indigo-400 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}
                                        >
                                            {item.name}
                                        </a>
                                    );
                                })}
                            </nav>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-303">
                                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span class="font-medium text-slate-100 font-sans">{user?.xp} XP</span>
                                <span class="text-slate-500">|</span>
                                <span class="text-yellow-400 font-medium font-sans">{user?.coins} Coins</span>
                                <span class="text-slate-500 font-sans">|</span>
                                <span class="text-amber-500 font-medium font-sans">🔥 {user?.streak} Streak</span>
                            </div>
                            
                            <button onClick={logout} class="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-slate-909 hover:bg-slate-800 border border-slate-800 rounded-lg cursor-pointer">
                                <LogOut size={13} />
                                Log Out
                            </button>

                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} class="md:hidden p-2 text-slate-400 hover:text-white cursor-pointer">
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                    {mobileMenuOpen && (
                        <div class="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-3 space-y-2">
                            {navItems.map((item) => (
                                <a 
                                    key={item.name} 
                                    href={item.hash} 
                                    class={`block px-3 py-2 rounded-md text-base font-medium ${hash.startsWith(item.hash) ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                                >
                                    {item.name}
                                </a>
                            ))}
                            <div class="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                <span>{user?.xp} XP | {user?.coins} Coins | 🔥 {user?.streak} Days</span>
                                <button onClick={logout} class="text-red-400 font-semibold cursor-pointer">Log Out</button>
                            </div>
                        </div>
                    )}
                </header>
            )}
            
            <main class="flex-grow">
                {pageComponent}
            </main>
        </div>
    );
};

const App = () => (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
