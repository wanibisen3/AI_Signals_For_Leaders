
import React, { useState, useMemo } from 'react';
import { User, UserPreferences, ViewState, Brief, Role, CompanySize, DecisionArea } from './types';
import { MOCK_BRIEFS } from './constants';

// --- Shared Components ---

// Fix: Changed children to optional to resolve JSX property missing errors
const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button' }: { 
  children?: React.ReactNode, onClick?: () => void, variant?: 'primary' | 'secondary' | 'ghost' | 'danger', className?: string, type?: 'button' | 'submit' 
}) => {
  const base = "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-500 hover:text-slate-900",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
  <span className={`material-icons-outlined select-none ${className}`}>{name}</span>
);

// --- View: Marketing Home ---

const MarketingHome = ({ onAuth }: { onAuth: (view: 'signin' | 'signup') => void }) => (
  <div className="bg-white min-h-screen selection:bg-primary selection:text-white">
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

    <header className="max-w-5xl mx-auto px-8 py-32 text-center">
      <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-[0.2em] mb-10">
        The Strategic Advantage
      </div>
      <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.1]">
        AI signals that matter for <br/><span className="text-slate-400">product and business leaders</span>
      </h1>
      <p className="text-2xl text-slate-500 font-medium mb-14 max-w-2xl mx-auto leading-relaxed">
        We filter the noise of daily developments into structured decision briefs for the C-suite.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={() => onAuth('signup')} className="px-12 py-5 text-lg rounded-full">Get Started</Button>
        <Button onClick={() => onAuth('signin')} variant="secondary" className="px-12 py-5 text-lg rounded-full">View Demo Brief</Button>
      </div>
    </header>

    <section className="bg-slate-50 py-32 border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-slate-900">Decisions, not news.</h2>
          <p className="text-slate-500 mt-4 text-lg">A focused perspective on the exponential curve of AI.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-900 border border-slate-100">
              <Icon name="filter_list" className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold">Filters AI Noise</h3>
            <p className="text-slate-600 leading-relaxed text-sm">We scan thousands of updates and research papers daily, distilling only the 1% that actually impacts your vertical.</p>
          </div>
          <div className="space-y-6">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-900 border border-slate-100">
              <Icon name="lightbulb" className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold">Explains why it matters</h3>
            <p className="text-slate-600 leading-relaxed text-sm">Beyond the headline: We provide contextual analysis on market shifts, competitor moves, and technological breakthroughs.</p>
          </div>
          <div className="space-y-6">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-900 border border-slate-100">
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

const AuthView = ({ mode, onBack, onSuccess }: { mode: 'signin' | 'signup', onBack: () => void, onSuccess: () => void }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-12 border border-slate-200">
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
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSuccess(); }}>
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Work Email</label>
            <input type="email" required className="w-full rounded-xl border-slate-200 py-3 focus:ring-slate-900 focus:border-slate-900 transition-all" placeholder="name@company.com" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
              {mode === 'signin' && <button type="button" className="text-xs text-slate-400 hover:text-slate-900 font-medium">Forgot password?</button>}
            </div>
            <input type="password" required className="w-full rounded-xl border-slate-200 py-3 focus:ring-slate-900 focus:border-slate-900 transition-all" placeholder="••••••••" />
          </div>
          {mode === 'signup' && (
             <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Confirm Password</label>
              <input type="password" required className="w-full rounded-xl border-slate-200 py-3 focus:ring-slate-900 focus:border-slate-900 transition-all" placeholder="••••••••" />
            </div>
          )}
          <Button type="submit" className="w-full py-4 text-base rounded-xl mt-4">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
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
  const [size, setSize] = useState<CompanySize | ''>('');
  const [areas, setAreas] = useState<DecisionArea[]>([]);
  const [concern, setConcern] = useState('');

  const toggleArea = (area: DecisionArea) => {
    setAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);
  };

  const handleContinue = () => {
    onComplete({ role, companySize: size, decisionAreas: areas, mainConcern: concern, hasPersonalized: true });
  };

  const handleSkip = () => {
    onComplete({ role: '', companySize: '', decisionAreas: [], mainConcern: '', hasPersonalized: false });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Personalize your AI Signals</h2>
          <p className="text-slate-500 text-xl font-medium">Briefings tailored to your specific leadership context.</p>
        </div>
        <div className="space-y-12 bg-white p-12 rounded-3xl border border-slate-100 shadow-sm">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">What is your role?</label>
              <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="w-full rounded-xl border-slate-200 py-3 focus:ring-slate-900 focus:border-slate-900">
                <option value="">Select your role</option>
                <option value="Product Leader">Product Leader</option>
                <option value="Business Leader">Business Leader</option>
                <option value="Founder">Founder</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Company Size</label>
              <select value={size} onChange={(e) => setSize(e.target.value as CompanySize)} className="w-full rounded-xl border-slate-200 py-3 focus:ring-slate-900 focus:border-slate-900">
                <option value="">Select size</option>
                <option value="Startup">Startup</option>
                <option value="Growing">Growing</option>
                <option value="Large">Large</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Critical Decision Areas</label>
            <div className="flex flex-wrap gap-3">
              {(['Product', 'Cost', 'GTM', 'Productivity', 'Risk'] as DecisionArea[]).map(area => (
                <button 
                  key={area} 
                  onClick={() => toggleArea(area)}
                  className={`px-6 py-3 rounded-full border text-sm font-bold transition-all ${areas.includes(area) ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-900'}`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Main AI Concern / Objective</label>
            <textarea 
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
              placeholder="e.g., Transitioning to AI-native product architecture..." 
              className="w-full rounded-2xl border-slate-200 h-32 focus:ring-slate-900 focus:border-slate-900 py-4"
            />
          </div>
          <div className="flex items-center justify-between pt-8 border-t border-slate-50">
            <button onClick={handleSkip} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Skip and show top AI updates</button>
            <Button onClick={handleContinue} className="px-12 py-4 rounded-full">Continue to Dashboard</Button>
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

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-100 flex flex-col shrink-0 bg-white">
        <div className="p-10 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Icon name="analytics" className="text-2xl" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">AI Signals</span>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'auto_awesome' },
            { id: 'saved', label: 'Saved Briefs', icon: 'bookmark_border' },
            { id: 'settings', label: 'Settings', icon: 'tune' },
          ].map(item => (
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
        <header className="h-24 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-12 shrink-0 z-10">
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
            Executive Intelligence Portal
          </div>
          <div className="relative">
            <div 
              className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-all"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user.email.split('@')[0]}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user.preferences.role || 'Executive'}</p>
              </div>
              <div className="w-11 h-11 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
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

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

// --- View: Dashboard ---

const DashboardView = ({ user, onOpenBrief, onToggleSave, savedIds }: { 
  user: User, onOpenBrief: (b: Brief) => void, onToggleSave: (id: string) => void, savedIds: Set<string> 
}) => {
  return (
    <div className="max-w-5xl mx-auto py-16 px-12">
      <div className="mb-16 border-l-4 border-slate-900 pl-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {user.preferences.hasPersonalized ? `AI Signals for ${user.email.split('@')[0]}` : 'Top AI Developments'}
        </h1>
        <p className="text-slate-500 mt-3 text-lg font-medium leading-relaxed max-w-2xl">
          Curated briefings for high-level decision makers. <span className="text-slate-300">Updated daily.</span>
        </p>
      </div>

      <div className="grid gap-10">
        {MOCK_BRIEFS.map(brief => (
          <div key={brief.id} className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{brief.source}</span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{brief.date}</span>
              </div>
              <span className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-slate-100">{brief.category}</span>
            </div>

            <h3 className="text-3xl font-extrabold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors leading-tight">{brief.headline}</h3>
            <p className="text-slate-500 text-lg leading-relaxed mb-10 line-clamp-2">{brief.summary}</p>
            
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

            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
              <button 
                onClick={() => onToggleSave(brief.id)}
                className={`flex items-center gap-2 text-sm font-bold transition-all ${savedIds.has(brief.id) ? 'text-slate-900' : 'text-slate-300 hover:text-slate-600'}`}
              >
                <Icon name={savedIds.has(brief.id) ? 'bookmark' : 'bookmark_border'} className="text-xl" /> 
                {savedIds.has(brief.id) ? 'Saved' : 'Save Brief'}
              </button>
              <Button onClick={() => onOpenBrief(brief)} className="px-10 rounded-full font-bold">View Briefing Details</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- View: Detail ---

const DetailView = ({ brief, onBack, onToggleSave, savedIds }: { 
  brief: Brief, onBack: () => void, onToggleSave: (id: string) => void, savedIds: Set<string> 
}) => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-12">
      <button onClick={onBack} className="flex items-center gap-3 text-slate-400 font-bold mb-16 hover:text-slate-900 transition-colors uppercase text-[10px] tracking-[0.2em]">
        <Icon name="west" className="text-lg" /> Back to Dashboard
      </button>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-16 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">{brief.category}</span>
          <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">{brief.source} • {brief.date}</span>
        </div>

        <h1 className="text-5xl font-black text-slate-900 leading-[1.1] mb-16 tracking-tighter">{brief.headline}</h1>

        <div className="space-y-20">
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900">
                <Icon name="newspaper" className="text-xl" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">What Happened</h2>
            </div>
            <p className="text-xl text-slate-600 leading-[1.7] font-medium">{brief.whatHappened}</p>
          </section>

          <section className="bg-slate-900 text-white p-12 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Icon name="insights" className="text-[120px]" />
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Icon name="auto_graph" className="text-xl" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Executive Significance</h2>
            </div>
            <p className="text-2xl text-slate-100 leading-[1.6] font-semibold italic border-l-4 border-white/20 pl-8">{brief.whyItMatters}</p>
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
                <li key={idx} className="flex items-start gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-900 font-black text-sm shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-all">
                    {idx + 1}
                  </div>
                  <span className="font-bold text-slate-700 text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col sm:flex-row gap-6 justify-between items-center">
          <div className="flex gap-4">
            <Button onClick={() => onToggleSave(brief.id)} className="rounded-full px-8">
              <Icon name={savedIds.has(brief.id) ? 'bookmark' : 'bookmark_border'} /> 
              {savedIds.has(brief.id) ? 'Brief Saved' : 'Save this Brief'}
            </Button>
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

// --- View: Saved ---

const SavedBriefsView = ({ savedIds, onOpenBrief, onRemove }: { 
  savedIds: Set<string>, onOpenBrief: (b: Brief) => void, onRemove: (id: string) => void 
}) => {
  const savedBriefs = MOCK_BRIEFS.filter(b => savedIds.has(b.id));

  return (
    <div className="max-w-5xl mx-auto py-16 px-12">
      <div className="mb-16 border-l-4 border-slate-900 pl-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Saved Intelligence</h1>
        <p className="text-slate-500 mt-3 text-lg font-medium">Your curated strategic knowledge base.</p>
      </div>

      {savedBriefs.length === 0 ? (
        <div className="text-center py-32 bg-white border border-dashed border-slate-200 rounded-[2.5rem]">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-8">
             <Icon name="bookmark_border" className="text-5xl" />
          </div>
          <p className="text-slate-400 font-bold text-xl mb-2">Portfolio is empty</p>
          <p className="text-slate-300">Signals you bookmark will appear here for deep review.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {savedBriefs.map(brief => (
            <div key={brief.id} className="bg-white border border-slate-100 rounded-3xl p-8 flex items-center gap-8 group hover:shadow-lg transition-all relative overflow-hidden">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
                <Icon name="description" className="text-3xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{brief.date}</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <span className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-slate-100">{brief.category}</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 truncate tracking-tight">{brief.headline}</h3>
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={() => onOpenBrief(brief)} variant="secondary" className="rounded-full px-8">Review</Button>
                <button onClick={() => onRemove(brief.id)} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors">
                  <Icon name="delete" className="text-2xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- View: Settings ---

const SettingsView = ({ user, onUpdate }: { user: User, onUpdate: (u: User) => void }) => {
  return (
    <div className="max-w-5xl mx-auto py-16 px-12">
      <div className="mb-16 border-l-4 border-slate-900 pl-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-3 text-lg font-medium">Configure your intelligence parameters.</p>
      </div>

      <div className="space-y-10">
        <section className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
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

        <section className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
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

        <section className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm">
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
          <p className="text-slate-500 mb-8 max-w-lg mx-auto">Once deleted, all historical data, saved briefs, and personalization parameters will be permanently scrubbed from our systems.</p>
          <Button variant="danger" className="rounded-full px-12">Delete Account Permanently</Button>
        </section>
      </div>
    </div>
  );
};

// --- Main App Entry ---

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('marketing');
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);
  const [savedBriefIds, setSavedBriefIds] = useState<Set<string>>(new Set());

  const handleAuthSuccess = () => {
    setUser({
      email: 'executive@leadership.com',
      preferences: { role: '', companySize: '', decisionAreas: [], mainConcern: '', hasPersonalized: false }
    });
    setView('personalization');
  };

  const handlePersonalizationComplete = (prefs: UserPreferences) => {
    if (user) {
      setUser({ ...user, preferences: prefs });
      setView('dashboard');
    }
  };

  const toggleSave = (id: string) => {
    const next = new Set(savedBriefIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSavedBriefIds(next);
  };

  const navigateToBrief = (brief: Brief) => {
    setSelectedBrief(brief);
    setView('detail');
  };

  // --- Rendering Logic ---

  if (view === 'marketing') return <MarketingHome onAuth={setView} />;
  if (view === 'signin' || view === 'signup') return <AuthView mode={view} onBack={() => setView('marketing')} onSuccess={handleAuthSuccess} />;
  
  if (!user) return <MarketingHome onAuth={setView} />;

  if (view === 'personalization') return <Personalization onComplete={handlePersonalizationComplete} />;

  return (
    <AppLayout activeView={view} setView={setView} user={user} onSignOut={() => setView('marketing')}>
      {view === 'dashboard' && (
        <DashboardView 
          user={user} 
          savedIds={savedBriefIds} 
          onOpenBrief={navigateToBrief} 
          onToggleSave={toggleSave} 
        />
      )}
      {view === 'detail' && selectedBrief && (
        <DetailView 
          brief={selectedBrief} 
          onBack={() => setView('dashboard')} 
          savedIds={savedBriefIds} 
          onToggleSave={toggleSave} 
        />
      )}
      {view === 'saved' && (
        <SavedBriefsView 
          savedIds={savedBriefIds} 
          onOpenBrief={navigateToBrief} 
          onRemove={toggleSave} 
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
