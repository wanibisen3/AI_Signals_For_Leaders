
import React, { useEffect, useState } from 'react';
import { User, UserPreferences, ViewState, Brief, Role, CompanySize, DecisionArea } from './types';
import { MOCK_BRIEFS } from './constants';

// --- Shared Components ---

// Fix: Changed children to optional to resolve JSX property missing errors
const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }: {
  children?: React.ReactNode, onClick?: () => void, variant?: 'primary' | 'secondary' | 'ghost' | 'danger', className?: string, type?: 'button' | 'submit', disabled?: boolean
}) => {
  const base = "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap";
  const variants = {
    primary: "bg-gradient-to-r from-slate-900 to-slate-700 text-white hover:from-slate-800 hover:to-slate-700 shadow-sm hover:shadow-md",
    secondary: "bg-white/90 backdrop-blur border border-slate-200 text-slate-700 hover:bg-white shadow-sm",
    ghost: "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 shadow-sm"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {children}
    </button>
  );
};

const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
  <span className={`material-icons-outlined select-none ${className}`}>{name}</span>
);

// --- View: Marketing Home ---

const MarketingHome = ({ onAuth }: { onAuth: (view: 'signin' | 'signup') => void }) => (
  <div className="bg-gradient-to-b from-white via-slate-50/40 to-white min-h-screen selection:bg-primary selection:text-white">
    <nav className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white">
          <Icon name="analytics" className="text-2xl" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">AI Signals</span>
      </div>
      <div className="flex items-center gap-8">
        <button onClick={() => onAuth('signin')} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Sign In</button>
        <Button onClick={() => onAuth('signup')} className="rounded-full px-6">Create Account</Button>
      </div>
    </nav>

    <header className="max-w-5xl mx-auto px-8 py-24 md:py-32 text-center relative">
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[34rem] h-[34rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.10),transparent_65%)]"></div>
      </div>
      <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-[0.2em] mb-10">
        The Strategic Advantage
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.05]">
        AI signals that matter for <br /><span className="text-slate-400">product and business leaders</span>
      </h1>
      <p className="text-2xl text-slate-500 font-medium mb-14 max-w-2xl mx-auto leading-relaxed">
        We filter the noise of daily developments into structured decision briefs for the C-suite.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={() => onAuth('signup')} className="px-12 py-5 text-lg rounded-full">Get Started</Button>
        <Button onClick={() => onAuth('signin')} variant="secondary" className="px-12 py-5 text-lg rounded-full">View Demo Brief</Button>
      </div>
    </header>

    <section className="bg-gradient-to-b from-slate-50 to-white py-24 md:py-32 border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-slate-900">Decisions, not news.</h2>
          <p className="text-slate-500 mt-4 text-lg">A focused perspective on the exponential curve of AI.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-16">
          <div className="space-y-6 p-7 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl shadow-sm flex items-center justify-center text-slate-900 border border-slate-100">
              <Icon name="filter_list" className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold">Filters AI Noise</h3>
            <p className="text-slate-600 leading-relaxed text-sm">We scan thousands of updates and research papers daily, distilling only the 1% that actually impacts your vertical.</p>
          </div>
          <div className="space-y-6 p-7 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl shadow-sm flex items-center justify-center text-slate-900 border border-slate-100">
              <Icon name="lightbulb" className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold">Explains why it matters</h3>
            <p className="text-slate-600 leading-relaxed text-sm">Beyond the headline: We provide contextual analysis on market shifts, competitor moves, and technological breakthroughs.</p>
          </div>
          <div className="space-y-6 p-7 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl shadow-sm flex items-center justify-center text-slate-900 border border-slate-100">
              <Icon name="track_changes" className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold">What to consider next</h3>
            <p className="text-slate-600 leading-relaxed text-sm">Specific, actionable considerations for your roadmap and strategy. We provide the "so what" for every signal.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="py-32">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <h2 className="text-3xl font-bold mb-16">Who this is for</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {['Product leaders', 'Business leaders', 'Founders'].map(role => (
            <div key={role} className="p-8 border border-slate-100 rounded-2xl bg-white shadow-sm flex flex-col items-center">
              <div className="w-2 h-2 bg-slate-900 rounded-full mb-4"></div>
              <h4 className="font-bold text-slate-900">{role}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>

    <footer className="bg-slate-900 text-slate-400 py-20">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:row justify-between items-center gap-12 border-t border-slate-800 pt-12">
        <div className="flex gap-12">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-slate-900">
            <Icon name="analytics" className="text-sm" />
          </div>
          <p className="text-sm">© 2024 AI Signals for Leaders. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
);

// --- View: Auth ---

const AuthView = ({
  mode,
  onBack,
  onSubmit,
  onGoogleAuth,
  loading
}: {
  mode: 'signin' | 'signup',
  onBack: () => void,
  onSubmit: (payload: { email: string, password: string, confirmPassword?: string }) => Promise<void>,
  onGoogleAuth: () => Promise<void>,
  loading: boolean
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await onSubmit({ email, password, confirmPassword });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await onGoogleAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-3xl shadow-xl p-12 border border-slate-200">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
            <Icon name="analytics" className="text-3xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">{mode === 'signin' ? 'Executive Sign In' : 'Create Account'}</h2>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            {mode === 'signin'
              ? 'Access your private AI intelligence briefing.'
              : 'Join a network of leaders making informed AI decisions.'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full mb-6 py-3.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <Icon name="login" className="text-base" />
          Continue with Google
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-slate-100"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-100"></div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Work Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border-slate-200 py-3 focus:ring-slate-900 focus:border-slate-900 transition-all"
              placeholder="name@company.com"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
              {mode === 'signin' && <button type="button" className="text-xs text-slate-400 hover:text-slate-900 font-medium">Forgot password?</button>}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border-slate-200 py-3 focus:ring-slate-900 focus:border-slate-900 transition-all"
              placeholder="••••••••"
            />
          </div>
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border-slate-200 py-3 focus:ring-slate-900 focus:border-slate-900 transition-all"
                placeholder="••••••••"
              />
            </div>
          )}
          {error && <p className="text-sm text-red-500 font-semibold">{error}</p>}
          <Button type="submit" className="w-full py-4 text-base rounded-xl mt-4">
            {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
          </Button>
        </form>
        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <button onClick={onBack} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

// --- View: Personalization ---

const Personalization = ({ onComplete }: { onComplete: (prefs: UserPreferences) => void }) => {
  const [role, setRole] = useState<Role | ''>('');
  const [concern, setConcern] = useState('');
  const [customConcern, setCustomConcern] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const focusOptions = [
    "Accelerating Product Innovation",
    "Operational Efficiency & Cost",
    "Risk, Compliance & Security",
    "Market Strategy & Growth",
    "Internal Workflows & Agents",
    "Other (enter your own)"
  ];

  const handleFocusSelect = (opt: string) => {
    if (opt === "Other (enter your own)") {
      setIsCustom(true);
      setConcern(customConcern);
    } else {
      setIsCustom(false);
      setConcern(opt);
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomConcern(e.target.value);
    setConcern(e.target.value);
  };

  const inferDecisionAreasFromConcern = (value: string): DecisionArea[] => {
    const text = value.toLowerCase();
    const areas = new Set<DecisionArea>();

    if (/(product|feature|roadmap|innovation|agent|workflow)/.test(text)) areas.add('Product');
    if (/(cost|efficiency|budget|pricing|spend)/.test(text)) areas.add('Cost');
    if (/(risk|compliance|security|privacy|regulation|policy)/.test(text)) areas.add('Risk');
    if (/(market|growth|sales|go to market|gtm|customer|distribution)/.test(text)) areas.add('GTM');
    if (/(productivity|operations|internal|automation|velocity)/.test(text)) areas.add('Productivity');

    return Array.from(areas);
  };

  const handleContinue = () => {
    const inferredDecisionAreas = inferDecisionAreasFromConcern(concern);
    // Map simplified flow to existing data structure
    onComplete({
      role,
      companySize: 'Growing', // Default
      decisionAreas: inferredDecisionAreas,
      mainConcern: concern,
      hasPersonalized: true
    });
  };

  const handleSkip = () => {
    onComplete({ role: '', companySize: '', decisionAreas: [], mainConcern: '', hasPersonalized: false });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Personalize your AI Signals</h2>
          <p className="text-slate-500 text-xl font-medium">To curate your intelligence briefing.</p>
        </div>
        <div className="space-y-10 bg-white p-12 rounded-3xl border border-slate-100 shadow-sm">

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">1. What is your role?</label>
            <div className="grid grid-cols-2 gap-4">
              {['Product Leader', 'Business Leader', 'Founder', 'Other'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r as Role)}
                  className={`py-4 rounded-xl border text-sm font-bold transition-all ${role === r ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-900'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">2. Primary Strategic Focus</label>
            <div className="flex flex-col gap-3">
              {focusOptions.map((opt) => {
                const isSelected = isCustom ? opt === "Other (enter your own)" : concern === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleFocusSelect(opt)}
                    className={`w-full text-left px-6 py-4 rounded-xl border text-sm font-bold transition-all flex justify-between items-center ${isSelected ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}
                  >
                    {opt}
                    {isSelected && <Icon name="check" />}
                  </button>
                );
              })}
              {isCustom && (
                <input
                  type="text"
                  value={customConcern}
                  onChange={handleCustomChange}
                  placeholder="e.g. Navigating AI regulation in EU..."
                  className="w-full rounded-xl border-slate-200 py-4 px-6 focus:ring-slate-900 focus:border-slate-900 animate-in fade-in slide-in-from-top-2"
                  autoFocus
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-slate-50">
            <button onClick={handleSkip} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Skip</button>
            <Button onClick={handleContinue} className="px-12 py-4 rounded-full" disabled={!role || !concern}>
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- View: Main Application ---

// Fix: Changed children to optional to resolve JSX property missing errors
const AppLayout = ({ children, activeView, setView, onSignOut, user }: {
  children?: React.ReactNode, activeView: string, setView: (v: ViewState) => void, onSignOut: () => void, user: User
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'auto_awesome' },
    { id: 'settings', label: 'Settings', icon: 'tune' },
  ];

  return (
    <div className="flex min-h-screen md:h-screen flex-col md:flex-row overflow-hidden bg-white">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 border-r border-slate-100 flex-col shrink-0 bg-white">
        <div className="p-10 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Icon name="analytics" className="text-2xl" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">AI Signals</span>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setView(item.id as ViewState); setProfileOpen(false); }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-bold transition-all ${activeView === item.id ? 'bg-slate-50 text-slate-900' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
            >
              <Icon name={item.icon} className={`text-xl ${activeView === item.id ? 'text-slate-900' : ''}`} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-slate-50">
          <button onClick={onSignOut} className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-bold text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all">
            <Icon name="logout" className="text-xl" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
        <header className="h-16 md:h-24 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 md:px-12 shrink-0 z-10">
          <div className="hidden lg:block text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
            Executive Intelligence Portal
          </div>
          <div className="lg:hidden text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
            AI Signals
          </div>
          <div className="relative">
            <div
              className="flex items-center gap-3 md:gap-4 cursor-pointer hover:opacity-80 transition-all"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user.email.split('@')[0]}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user.preferences.role || 'Executive'}</p>
              </div>
              <div className="w-9 h-9 md:w-11 md:h-11 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
                <Icon name="person" className="text-xl" />
              </div>
            </div>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 shadow-xl rounded-2xl p-2 z-20">
                <button onClick={() => { setView('settings'); setProfileOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-3">
                  <Icon name="settings" className="text-lg" /> Edit Preferences
                </button>
                <button onClick={onSignOut} className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-3">
                  <Icon name="logout" className="text-lg" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="md:hidden border-b border-slate-100 bg-white px-3 py-2 flex items-center gap-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setView(item.id as ViewState); setProfileOpen(false); }}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === item.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500'}`}
            >
              <Icon name={item.icon} className="text-base" />
              {item.label}
            </button>
          ))}
        </div>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

// --- View: Dashboard ---

const DashboardView = ({ user, briefs, loading, onOpenBrief }: {
  user: User, briefs: Brief[], loading: boolean, onOpenBrief: (b: Brief) => void
}) => {
  const sortedBriefs = [...briefs].sort((a, b) => {
    const aFocus = a.matchBreakdown?.focus || 0;
    const bFocus = b.matchBreakdown?.focus || 0;
    if (bFocus !== aFocus) return bFocus - aFocus;

    const aScore = a.matchScore || 0;
    const bScore = b.matchScore || 0;
    return bScore - aScore;
  });

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-12 relative">
      <div className="absolute -top-20 right-0 w-72 h-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(30,64,175,0.12),transparent_65%)] pointer-events-none"></div>
      <div className="mb-8 sm:mb-12 lg:mb-16 border-l-4 border-slate-900 pl-4 sm:pl-6 lg:pl-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {user.preferences.hasPersonalized ? `AI Signals for ${user.email.split('@')[0]}` : 'Top AI Developments'}
        </h1>
        <p className="text-slate-500 mt-3 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
          Curated briefings for high-level decision makers. <span className="text-slate-300">Updated daily.</span>
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Analyzing AI signals...</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:gap-8 lg:gap-10">
          {sortedBriefs.map(brief => (
            <div key={brief.id} className="bg-white/95 backdrop-blur border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all group relative">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{brief.source}</span>
                  <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{brief.date}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {brief.matchScore && brief.matchScore > 65 && (
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                      <Icon name="verified" className="text-sm" /> {brief.matchScore}% Relevance
                    </span>
                  )}
                  <span className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-slate-100">{brief.category}</span>
                </div>
              </div>
              {user.preferences.hasPersonalized && brief.matchBreakdown && (
                <div className="mb-4 sm:mb-5 flex gap-2 flex-wrap text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                  <span className="px-2 py-1 rounded-full bg-slate-50 border border-slate-100">Role {brief.matchBreakdown.role}%</span>
                  <span className="px-2 py-1 rounded-full bg-slate-50 border border-slate-100">Focus {brief.matchBreakdown.focus}%</span>
                </div>
              )}

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 sm:mb-4 group-hover:text-slate-700 transition-colors leading-tight">{brief.headline}</h3>
              <p className="text-slate-500 text-base sm:text-lg leading-relaxed mb-6 sm:mb-10 line-clamp-3 sm:line-clamp-2">{brief.summary}</p>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Icon name="visibility" className="text-base" /> Why this matters
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{brief.whyItMatters}</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
                    <Icon name="campaign" className="text-base" /> Leader takeaway
                  </h4>
                  <p className="text-sm text-slate-900 font-bold leading-relaxed">{brief.leaderTakeaway}</p>
                </div>
              </div>

              <div className="flex items-center justify-end pt-6 sm:pt-8 border-t border-slate-50">
                <Button onClick={() => onOpenBrief(brief)} className="w-full sm:w-auto px-8 sm:px-10 rounded-full font-bold">View Briefing Details</Button>
              </div>
            </div>
          ))}
        </div>
      )
      }
    </div >
  );
};

// --- View: Detail ---

const DetailView = ({ brief, onBack }: {
  brief: Brief, onBack: () => void
}) => {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-12">
      <button onClick={onBack} className="flex items-center gap-3 text-slate-400 font-bold mb-8 sm:mb-12 lg:mb-16 hover:text-slate-900 transition-colors uppercase text-[10px] tracking-[0.2em]">
        <Icon name="west" className="text-lg" /> Back to Dashboard
      </button>

      <div className="bg-white/95 backdrop-blur border border-slate-100 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 lg:p-16 shadow-lg">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 flex-wrap">
          {brief.matchScore && brief.matchScore > 65 && (
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Icon name="verified" className="text-sm" /> Target Match
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">{brief.category}</span>
          <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">{brief.source} • {brief.date}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] mb-8 sm:mb-12 lg:mb-16 tracking-tighter">{brief.headline}</h1>

        <div className="space-y-10 sm:space-y-14 lg:space-y-20">
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900">
                <Icon name="newspaper" className="text-xl" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">What Happened</h2>
            </div>
            <p className="text-lg sm:text-xl text-slate-600 leading-[1.7] font-medium">{brief.whatHappened}</p>
          </section>

          <section className="bg-slate-900 text-white p-6 sm:p-8 lg:p-12 rounded-3xl sm:rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Icon name="insights" className="text-[120px]" />
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Icon name="auto_graph" className="text-xl" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Executive Significance</h2>
            </div>
            <p className="text-xl sm:text-2xl text-slate-100 leading-[1.6] font-semibold italic border-l-4 border-white/20 pl-5 sm:pl-8">{brief.whyItMatters}</p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900">
                <Icon name="fact_check" className="text-xl" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Strategic Considerations</h2>
            </div>
            <ul className="grid gap-4">
              {brief.whatToConsiderNext.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-900 font-black text-sm shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-all">
                    {idx + 1}
                  </div>
                  <span className="font-bold text-slate-700 text-base sm:text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-24 pt-8 sm:pt-12 border-t border-slate-100 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-center">
          <div className="flex gap-4">
            <Button variant="secondary" className="rounded-full px-8">
              <Icon name="ios_share" /> Share Intelligence
            </Button>
          </div>
          <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
            Download PDF Brief
          </button>
        </div>
      </div>
    </div>
  );
};

// --- View: Settings ---

const SettingsView = ({ user, onUpdate }: { user: User, onUpdate: (u: User) => void }) => {
  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-12">
      <div className="mb-8 sm:mb-12 lg:mb-16 border-l-4 border-slate-900 pl-4 sm:pl-6 lg:pl-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-3 text-base sm:text-lg font-medium">Configure your intelligence parameters.</p>
      </div>

      <div className="space-y-10">
        <section className="bg-white/95 backdrop-blur border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="p-10 border-b border-slate-50"><h3 className="text-xl font-black tracking-tight">Personalization Parameters</h3></div>
          <div className="p-10 space-y-8">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Executive Role</label>
                <select className="w-full rounded-xl border-slate-200 py-3 font-semibold" defaultValue={user.preferences.role}>
                  <option>Product Leader</option>
                  <option>Business Leader</option>
                  <option>Founder</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Company Maturity</label>
                <select className="w-full rounded-xl border-slate-200 py-3 font-semibold" defaultValue={user.preferences.companySize}>
                  <option>Startup</option>
                  <option>Growing</option>
                  <option>Large</option>
                </select>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Main Focus</label>
              <input type="text" className="w-full rounded-xl border-slate-200 py-3 font-semibold" defaultValue={user.preferences.mainConcern || 'Optimizing team velocity with Generative AI'} />
            </div>
            <Button onClick={() => alert('Preferences updated')} className="px-10 rounded-full">Save Configuration</Button>
          </div>
        </section>

        <section className="bg-white/95 backdrop-blur border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="p-10 border-b border-slate-50"><h3 className="text-xl font-black tracking-tight">Security & Credentials</h3></div>
          <div className="p-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-md w-full">
              <p className="font-bold text-slate-900 mb-2">Change Account Password</p>
              <p className="text-sm text-slate-400 mb-6">Last updated 14 days ago.</p>
              <Button variant="secondary" className="rounded-full px-8">Update Password</Button>
            </div>
            <div className="h-20 w-px bg-slate-50 hidden md:block"></div>
            <div className="flex-1 text-right md:text-left">
              <p className="font-bold text-slate-900 mb-2">Two-Factor Authentication</p>
              <p className="text-sm text-slate-400 mb-6">Add an extra layer of security to your brief access.</p>
              <Button variant="secondary" className="rounded-full px-8">Enable 2FA</Button>
            </div>
          </div>
        </section>

        <section className="bg-white/95 backdrop-blur border border-slate-100 rounded-[2rem] p-10 shadow-sm">
          <h3 className="text-xl font-black tracking-tight mb-8">Notification Preferences</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
              <div>
                <p className="font-bold text-slate-900 text-lg">Weekly Signal Digest</p>
                <p className="text-sm text-slate-500 font-medium">Executive summary of the week's most critical shifts.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-12 h-6 rounded-full text-slate-900 focus:ring-slate-900 cursor-pointer" />
            </div>
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl opacity-50">
              <div>
                <p className="font-bold text-slate-900 text-lg">Instant Breakthrough Alerts</p>
                <p className="text-sm text-slate-500 font-medium text-red-500">Reserved for industry-shifting events only.</p>
              </div>
              <input type="checkbox" className="w-12 h-6 rounded-full text-slate-900 focus:ring-slate-900 cursor-pointer" />
            </div>
          </div>
        </section>

        <section className="bg-red-50/50 border border-red-100 rounded-[2rem] p-10 text-center">
          <h3 className="text-xl font-black text-red-800 mb-3">Terminate Portfolio</h3>
          <p className="text-slate-500 mb-8 max-w-lg mx-auto">Once deleted, all historical data and personalization parameters will be permanently scrubbed from our systems.</p>
          <Button variant="danger" className="rounded-full px-12">Delete Account Permanently</Button>
        </section>
      </div>
    </div>
  );
};

// --- Main App Entry ---

const App = () => {
  const BRIEF_LIMIT = 18;
  const AUTH_TOKEN_KEY = 'ai_signals_auth_token';
  const AUTH_USER_KEY = 'ai_signals_auth_user';
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('marketing');
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authBootstrapped, setAuthBootstrapped] = useState(false);

  const persistUser = (nextUser: User, token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
  };

  const clearPersistedSession = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const parseApiResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }

    const text = await response.text();
    const preview = text.trim().slice(0, 80);
    throw new Error(
      `Unexpected non-JSON response from ${response.url || 'API'} (status ${response.status}). ` +
      `Check API deployment. Response starts with: ${preview || '(empty)'}`
    );
  };

  const cleanOAuthUrl = () => {
    const hasAuthHash = window.location.hash.includes('access_token') || window.location.hash.includes('error=');
    const search = window.location.search;
    const hasAuthQuery = search.includes('code=') || search.includes('error=');
    const isCallbackPath = window.location.pathname === '/auth/callback';
    if (hasAuthHash || hasAuthQuery || isCallbackPath) {
      window.history.replaceState({}, '', '/');
    }
  };

  const handleAuthSubmit = async ({ email, password }: { email: string, password: string }) => {
    setAuthLoading(true);
    try {
      const endpoint = view === 'signup' ? '/api/auth/signup' : '/api/auth/signin';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await parseApiResponse(response);
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      const rawExisting = localStorage.getItem(AUTH_USER_KEY);
      const existingUser = rawExisting ? JSON.parse(rawExisting) : null;
      const nextUser: User = existingUser?.email === data.user.email
        ? { ...data.user, preferences: existingUser.preferences || data.user.preferences }
        : data.user;
      persistUser(nextUser, data.token);
      setUser(nextUser);
      setView(nextUser.preferences.hasPersonalized ? 'dashboard' : 'personalization');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const response = await fetch('/api/auth/google/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redirectTo })
      });
      const data = await parseApiResponse(response);
      if (!response.ok || !data.success || !data.url) {
        throw new Error(data.error || 'Failed to start Google sign in');
      }
      window.location.assign(data.url);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY) || '';
    try {
      if (token) {
        await fetch('/api/auth/signout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ token })
        });
      }
    } finally {
      clearPersistedSession();
      setUser(null);
      setSelectedBrief(null);
      setView('marketing');
    }
  };

  const handlePersonalizationComplete = (prefs: UserPreferences) => {
    if (user) {
      const updatedUser = { ...user, preferences: prefs };
      setUser(updatedUser);
      const token = localStorage.getItem(AUTH_TOKEN_KEY) || '';
      if (token) persistUser(updatedUser, token);
      setView('dashboard');
      fetchBriefs(prefs); // Fetch briefs when personalization is complete
    }
  };

  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBriefs = async (prefs?: UserPreferences) => {
    setLoading(true);
    try {
      const effectivePreferences = prefs || user?.preferences || {
        role: '',
        companySize: '',
        decisionAreas: [],
        mainConcern: '',
        hasPersonalized: false
      };

      const response = await fetch('/api/signals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          preferences: effectivePreferences,
          time_horizon: '30d',
          tier_filter: 'ALL',
          limit: BRIEF_LIMIT,
          bypass_cache: true
        })
      });
      const data = await parseApiResponse(response);
      if (data.success) {
        setBriefs(data.briefs);
      } else {
        console.error('Failed to fetch briefs:', data.error);
        // Fallback to MOCK_BRIEFS on error for demo purposes
        setBriefs(MOCK_BRIEFS);
      }
    } catch (error) {
      console.error('Error fetching briefs:', error);
      setBriefs(MOCK_BRIEFS);
    } finally {
      setLoading(false);
    }
  };

  const navigateToBrief = (brief: Brief) => {
    setSelectedBrief(brief);
    setView('detail');
  };

  useEffect(() => {
    let active = true;
    const bootstrapSession = async () => {
      let token = localStorage.getItem(AUTH_TOKEN_KEY);
      const rawUser = localStorage.getItem(AUTH_USER_KEY);

      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const queryParams = new URLSearchParams(window.location.search);
      const oauthError = hashParams.get('error_description') || queryParams.get('error_description') || queryParams.get('error');
      if (oauthError) {
        cleanOAuthUrl();
      }

      const accessTokenFromHash = hashParams.get('access_token');
      if (accessTokenFromHash) {
        token = accessTokenFromHash;
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        cleanOAuthUrl();
      } else if (queryParams.get('code')) {
        try {
          const exchangeResponse = await fetch('/api/auth/exchange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: queryParams.get('code') })
          });
          const exchangeData = await parseApiResponse(exchangeResponse);
          if (exchangeResponse.ok && exchangeData.success && exchangeData.token) {
            token = exchangeData.token;
            localStorage.setItem(AUTH_TOKEN_KEY, token);
          }
        } catch {
          // ignored, standard session bootstrap below will handle invalid state
        } finally {
          cleanOAuthUrl();
        }
      }

      if (!token) {
        if (active) setAuthBootstrapped(true);
        return;
      }

      try {
        const response = await fetch('/api/auth/session', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await parseApiResponse(response);
        if (!response.ok || !data.success) throw new Error(data.error || 'Invalid session');

        const persistedUser = rawUser ? JSON.parse(rawUser) : null;
        const sessionUser: User = persistedUser?.email === data.user.email ? persistedUser : data.user;
        if (!active) return;
        setUser(sessionUser);
        setView(sessionUser.preferences?.hasPersonalized ? 'dashboard' : 'personalization');
      } catch {
        clearPersistedSession();
      } finally {
        if (active) setAuthBootstrapped(true);
      }
    };

    bootstrapSession();
    return () => {
      active = false;
    };
  }, []);

  // --- Rendering Logic ---

  if (!authBootstrapped) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold">Loading session...</p>
        </div>
      </div>
    );
  }

  if (view === 'marketing') return <MarketingHome onAuth={setView} />;
  if (view === 'signin' || view === 'signup') return <AuthView mode={view} onBack={() => setView('marketing')} onSubmit={handleAuthSubmit} onGoogleAuth={handleGoogleAuth} loading={authLoading} />;

  if (!user) return <MarketingHome onAuth={setView} />;

  if (view === 'personalization') return <Personalization onComplete={handlePersonalizationComplete} />;

  return (
    <AppLayout activeView={view} setView={setView} user={user} onSignOut={handleSignOut}>
      {view === 'dashboard' && (
        <DashboardView
          user={user}
          briefs={briefs}
          loading={loading}
          onOpenBrief={navigateToBrief}
        />
      )}
      {view === 'detail' && selectedBrief && (
        <DetailView
          brief={selectedBrief}
          onBack={() => setView('dashboard')}
        />
      )}
      {view === 'settings' && (
        <SettingsView
          user={user}
          onUpdate={setUser}
        />
      )}
    </AppLayout>
  );
};

export default App;
