
import React, { useEffect, useState } from 'react';
import { User, UserPreferences, ViewState, Brief, Role, DecisionArea, DashboardState } from './types';

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

const OTHER_FOCUS_OPTION = 'Other (enter your own)';
const FOCUS_OPTIONS = [
  'Accelerating Product Innovation',
  'Operational Efficiency & Cost',
  'Risk, Compliance & Security',
  'Market Strategy & Growth',
  'Internal Workflows & Agents',
  OTHER_FOCUS_OPTION
];

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

// --- View: Marketing Home ---

const MarketingHome = ({ onAuth, onNavigate }: { onAuth: (view: 'signin' | 'signup') => void, onNavigate: (view: 'about' | 'privacy' | 'terms' | 'contact') => void }) => (
  <div className="bg-gradient-to-b from-white via-slate-50/40 to-white min-h-screen selection:bg-primary selection:text-white">
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:h-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white shrink-0">
          <Icon name="analytics" className="text-2xl" />
        </div>
        <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">AI Signals for Leaders</span>
      </div>
      <div className="w-full sm:w-auto flex items-center sm:justify-end gap-3 shrink-0">
        <Button onClick={() => onAuth('signin')} className="w-full sm:w-auto rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base">
          <Icon name="login" className="text-base" /> Access Portal
        </Button>
      </div>
    </nav>

    <header className="max-w-5xl mx-auto px-8 py-24 md:py-32 text-center relative">
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[34rem] h-[34rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.10),transparent_65%)]"></div>
      </div>
      <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-[0.2em] mb-10">
        The Strategic Advantage
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.05]">
        AI signals that matter for <br className="hidden md:block" /><span className="text-slate-400">product and business leaders</span>
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-slate-500 font-medium mb-14 max-w-2xl mx-auto leading-relaxed">
        We filter the noise of daily developments into structured decision briefs for the C-suite.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={() => onAuth('signup')} className="px-12 py-5 text-lg rounded-full">Get Started</Button>
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
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 sm:mb-16">Who this is for</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {['Product leaders', 'Business leaders', 'Founders'].map(role => (
            <div key={role} className="p-5 sm:p-8 border border-slate-100 rounded-2xl bg-white shadow-sm flex items-center justify-center gap-3 sm:flex-col sm:gap-0">
              <div className="w-2.5 h-2.5 bg-slate-900 rounded-full sm:mb-4 shrink-0"></div>
              <h4 className="font-bold text-slate-900 text-xl sm:text-2xl leading-none">{role}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>

    <footer className="bg-slate-900 text-slate-400 py-20">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:row justify-between items-center gap-12 border-t border-slate-800 pt-12">
        <div className="flex gap-12">
          <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">About</button>
          <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">Privacy</button>
          <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">Terms</button>
          <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Contact</button>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-slate-900">
            <Icon name="analytics" className="text-sm" />
          </div>
          <p className="text-sm">© 2026 AI Signals for Business Leaders. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
);

const StaticPageLayout = ({ title, subtitle, children, onBack }: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  onBack: () => void;
}) => (
  <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/40">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 mb-8">
        <Icon name="west" className="text-base" /> Back to Home
      </button>
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{title}</h1>
        <p className="text-slate-500 mt-3 mb-8 text-base sm:text-lg">{subtitle}</p>
        <div className="space-y-6 text-slate-700 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const AboutPage = ({ onBack }: { onBack: () => void }) => (
  <StaticPageLayout
    title="About AI Signals for Business Leaders"
    subtitle="Enterprise intelligence briefs built for strategic decision-making."
    onBack={onBack}
  >
    <section>
      <h2 className="text-xl font-black text-slate-900 mb-2">Mission</h2>
      <p>
        AI Signals for Business Leaders exists to help executive teams make faster, better AI decisions.
        We convert fast-moving AI news, research, and product updates into high-signal strategic briefs.
      </p>
    </section>
    <section>
      <h2 className="text-xl font-black text-slate-900 mb-2">Product</h2>
      <p>
        The platform continuously scans trusted sources, ranks developments by executive relevance, and
        generates concise briefings: what happened, why it matters, and what to consider next.
      </p>
      <p>
        Our workflows are designed for product leaders, business leaders, and founders who need clear
        prioritization rather than generic trend summaries.
      </p>
    </section>
    <section>
      <h2 className="text-xl font-black text-slate-900 mb-2">Operator</h2>
      <p>
        Operated by <strong>Wani Bisen</strong> in Singapore.
      </p>
      <p>
        Contact: <a className="text-slate-900 font-bold underline" href="mailto:ai.signals.for.leaders@gmail.com">ai.signals.for.leaders@gmail.com</a>
      </p>
    </section>
  </StaticPageLayout>
);

const PrivacyPage = ({ onBack }: { onBack: () => void }) => (
  <StaticPageLayout
    title="Privacy Policy"
    subtitle="Last updated: February 25, 2026"
    onBack={onBack}
  >
    <section>
      <h2 className="text-xl font-black text-slate-900 mb-2">Information We Collect</h2>
      <p>
        We collect account data (such as email), authentication metadata, and product usage data needed to deliver the service.
        We may also store personalization settings (role, focus area, and preferences).
      </p>
    </section>
    <section>
      <h2 className="text-xl font-black text-slate-900 mb-2">How We Use Information</h2>
      <p>
        We use data to provide sign-in, personalize ranking, improve brief quality, maintain platform security,
        and support users.
      </p>
    </section>
    <section>
      <h2 className="text-xl font-black text-slate-900 mb-2">Processors and Third Parties</h2>
      <p>
        We use third-party infrastructure and AI providers including Supabase (auth/data), Vercel (hosting),
        and OpenAI (model processing). Data is processed only as required to operate core features.
      </p>
    </section>
    <section>
      <h2 className="text-xl font-black text-slate-900 mb-2">Cookies and Local Storage</h2>
      <p>
        We use local storage and session mechanisms to keep users signed in and preserve preferences.
        You can clear browser storage at any time.
      </p>
    </section>
    <section>
      <h2 className="text-xl font-black text-slate-900 mb-2">Data Retention and Requests</h2>
      <p>
        We retain data for as long as needed to provide the service and meet legal obligations.
        For access, correction, or deletion requests, contact
        {' '}<a className="text-slate-900 font-bold underline" href="mailto:ai.signals.for.leaders@gmail.com">ai.signals.for.leaders@gmail.com</a>.
      </p>
    </section>
  </StaticPageLayout>
);

const TermsPage = ({ onBack }: { onBack: () => void }) => (
  <StaticPageLayout
    title="Terms of Service"
    subtitle="Last updated: February 25, 2026"
    onBack={onBack}
  >
    <section>
      <h2 className="text-xl font-black text-slate-900 mb-2">Use of Service</h2>
      <p>
        AI Signals for Business Leaders provides informational intelligence briefs for business planning support.
        You are responsible for final decisions and independent verification.
      </p>
    </section>
    <section>
      <h2 className="text-xl font-black text-slate-900 mb-2">Account Responsibility</h2>
      <p>
        You must keep your account credentials secure and are responsible for all activity under your account.
      </p>
    </section>
    <section>
      <h2 className="text-xl font-black text-slate-900 mb-2">Acceptable Use</h2>
      <p>
        You agree not to misuse, reverse engineer, disrupt, or attempt unauthorized access to the service or its data.
      </p>
    </section>
    <section>
      <h2 className="text-xl font-black text-slate-900 mb-2">No Warranty</h2>
      <p>
        The service is provided on an "as is" and "as available" basis without warranties of any kind.
      </p>
    </section>
    <section>
      <h2 className="text-xl font-black text-slate-900 mb-2">Governing Law</h2>
      <p>
        These Terms are governed by the laws of Singapore. Disputes shall be subject to the courts of Singapore.
      </p>
    </section>
    <section>
      <h2 className="text-xl font-black text-slate-900 mb-2">Contact</h2>
      <p>
        For legal questions, contact{' '}
        <a className="text-slate-900 font-bold underline" href="mailto:ai.signals.for.leaders@gmail.com">ai.signals.for.leaders@gmail.com</a>.
      </p>
    </section>
  </StaticPageLayout>
);

const ContactPage = ({ onBack }: { onBack: () => void }) => (
  <StaticPageLayout
    title="Contact"
    subtitle="Enterprise inquiries, support, and legal requests."
    onBack={onBack}
  >
    <section>
      <h2 className="text-xl font-black text-slate-900 mb-2">Primary Contact</h2>
      <p><strong>Wani Bisen</strong></p>
      <p>Email: <a className="text-slate-900 font-bold underline" href="mailto:ai.signals.for.leaders@gmail.com">ai.signals.for.leaders@gmail.com</a></p>
      <p>Location: Singapore</p>
    </section>
    <section>
      <h2 className="text-xl font-black text-slate-900 mb-2">What to Include in Your Message</h2>
      <p>
        Please include your company name, topic (support, partnership, legal, privacy), and a concise request description.
      </p>
    </section>
  </StaticPageLayout>
);

// --- View: Auth ---

const AuthView = ({
  mode,
  onBack,
  onSwitchMode,
  onSubmit,
  onGoogleAuth,
  loading,
  externalError,
  onClearExternalError
}: {
  mode: 'signin' | 'signup',
  onBack: () => void,
  onSwitchMode: (mode: 'signin' | 'signup') => void,
  onSubmit: (payload: { email: string, password: string, confirmPassword?: string }) => Promise<void>,
  onGoogleAuth: (intent: 'signin' | 'signup') => Promise<void>,
  loading: boolean,
  externalError?: string,
  onClearExternalError?: () => void
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onClearExternalError?.();
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
    onClearExternalError?.();
    setError('');
    try {
      await onGoogleAuth(mode);
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
        <div className="mb-6 p-1 rounded-xl bg-slate-100 border border-slate-200 grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => { onClearExternalError?.(); onSwitchMode('signin'); }}
            className={`py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { onClearExternalError?.(); onSwitchMode('signup'); }}
            className={`py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Create Account
          </button>
        </div>
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full mb-6 py-3.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.844 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 12 24 12c3.059 0 5.844 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.132 35.091 26.679 36 24 36c-5.202 0-9.62-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.042 12.042 0 0 1-4.084 5.571h.001l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
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
          {(error || externalError) && <p className="text-sm text-red-500 font-semibold">{error || externalError}</p>}
          <Button type="submit" className="w-full py-4 text-base rounded-xl mt-4">
            {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
          </Button>
        </form>
        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500 mb-4">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => { onClearExternalError?.(); onSwitchMode(mode === 'signin' ? 'signup' : 'signin'); }}
              className="font-bold text-slate-900 hover:text-slate-700"
            >
              {mode === 'signin' ? 'Create Account' : 'Sign In'}
            </button>
          </p>
          <button onClick={() => { onClearExternalError?.(); onBack(); }} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
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
  const [generateBriefs, setGenerateBriefs] = useState(true);

  const handleFocusSelect = (opt: string) => {
    if (opt === OTHER_FOCUS_OPTION) {
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

  const handleContinue = () => {
    const inferredDecisionAreas = inferDecisionAreasFromConcern(concern);
    onComplete({
      role,
      companySize: '',
      decisionAreas: inferredDecisionAreas,
      mainConcern: concern,
      generateBriefs,
      hasPersonalized: true
    });
  };

  const handleSkip = () => {
    onComplete({ role: '', companySize: '', decisionAreas: [], mainConcern: '', hasPersonalized: false });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Personalize your AI Signals</h2>
          <p className="text-lg sm:text-xl text-slate-500 font-medium">To curate your intelligence briefing.</p>
        </div>
        <div className="space-y-8 sm:space-y-10 bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-slate-100 shadow-sm">

          <div className="space-y-4">
            <label className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400">1. What is your role?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {['Product Leader', 'Business Leader', 'Founder', 'Other'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r as Role)}
                  className={`py-4 px-3 rounded-xl border text-base sm:text-sm font-bold transition-all ${role === r ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-900'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400">2. Primary Strategic Focus</label>
            <div className="flex flex-col gap-3">
              {FOCUS_OPTIONS.map((opt) => {
                const isSelected = isCustom ? opt === OTHER_FOCUS_OPTION : concern === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleFocusSelect(opt)}
                    className={`w-full text-left px-5 sm:px-6 py-4 rounded-xl border text-base sm:text-lg font-bold transition-all flex justify-between items-center ${isSelected ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}
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
                  className="w-full rounded-xl border-slate-200 py-4 px-6 text-base focus:ring-slate-900 focus:border-slate-900 animate-in fade-in slide-in-from-top-2"
                  autoFocus
                />
              )}
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={generateBriefs}
              onChange={(e) => setGenerateBriefs(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            Personalize and generate briefs now (costs 1 token)
          </label>

          <div className="flex items-center justify-between pt-8 border-t border-slate-50">
            <button onClick={handleSkip} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Skip</button>
            <Button onClick={handleContinue} className="px-12 py-4 rounded-full" disabled={!role || !concern}>
              {generateBriefs ? 'Personalize and Refresh Signals' : 'Save Personalization'}
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
          <span className="text-2xl font-black tracking-tighter text-slate-900">AI Signals for Leaders</span>
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

const DashboardView = ({
  user,
  briefs,
  loading,
  tokenBalance,
  onOpenBrief,
  onOpenPersonalization,
  onOpenBilling
}: {
  user: User;
  briefs: Brief[];
  loading: boolean;
  tokenBalance: number;
  onOpenBrief: (b: Brief) => void;
  onOpenPersonalization: () => void;
  onOpenBilling: () => void;
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

      <div className="mb-6 grid gap-4 md:grid-cols-[1.1fr_1fr]">
        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm h-full">
          <div className="flex h-full flex-col">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">Personalization</p>
            <div className="flex flex-1 items-end justify-between gap-4">
              <div>
              <p className="text-sm font-semibold text-slate-700">Role: {user.preferences.role || 'Not set'}</p>
              <p className="text-sm font-semibold text-slate-700">Focus area: {user.preferences.mainConcern || 'Not set'}</p>
              </div>
              <Button
                variant="primary"
                className="rounded-full px-6 py-2.5 font-bold"
                onClick={onOpenPersonalization}
              >
                Refresh Signals
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm h-full">
          <div className="flex h-full flex-col">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Token Balance</p>
            <div className="flex flex-1 items-end justify-between gap-3">
              <p className="text-3xl leading-none font-black text-slate-900">{tokenBalance}</p>
              <Button
                variant="primary"
                className="rounded-full px-6 py-2.5 font-bold"
                onClick={onOpenBilling}
              >
                Buy Tokens
              </Button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Analyzing AI signals...</p>
        </div>
      ) : sortedBriefs.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center shadow-sm">
          <h3 className="text-2xl font-black text-slate-900 mb-2">No briefs yet</h3>
          <p className="text-slate-500 mb-6">Set personalization and generate your first brief batch. It costs 1 token.</p>
          <div className="flex justify-center gap-3">
            <Button onClick={onOpenPersonalization}>Refresh Signals</Button>
            <Button variant="secondary" onClick={onOpenBilling}>Buy Tokens</Button>
          </div>
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

const SettingsView = ({
  onUpdatePassword,
  onDeleteAccount,
  loading
}: {
  onUpdatePassword: (password: string) => Promise<void>;
  onDeleteAccount: (confirmation: string) => Promise<void>;
  loading: boolean;
}) => {
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submitPassword = async () => {
    setError('');
    setSuccess('');
    try {
      await onUpdatePassword(password);
      setPassword('');
      setSuccess('Password updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    }
  };

  const submitDelete = async () => {
    setError('');
    setSuccess('');
    try {
      await onDeleteAccount(confirmText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-12">
      <div className="mb-8 sm:mb-12 lg:mb-16 border-l-4 border-slate-900 pl-4 sm:pl-6 lg:pl-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-3 text-base sm:text-lg font-medium">Account security and lifecycle controls.</p>
      </div>

      <div className="space-y-8">
        <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-black tracking-tight mb-4">Update Password</h3>
          <p className="text-sm text-slate-500 mb-4">Use at least 8 characters.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="w-full md:max-w-md rounded-xl border-slate-200 py-3 mb-4"
          />
          <div>
            <Button onClick={submitPassword} disabled={loading || password.length < 8}>Update Password</Button>
          </div>
        </section>

        <section className="bg-red-50 border border-red-100 rounded-3xl p-8">
          <h3 className="text-xl font-black text-red-800 mb-3">Delete Account</h3>
          <p className="text-slate-600 mb-4">Type <strong>DELETE</strong> to confirm account deletion.</p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full md:max-w-md rounded-xl border-red-200 py-3 mb-4"
          />
          <div>
            <Button variant="danger" onClick={submitDelete} disabled={loading || confirmText !== 'DELETE'}>
              Delete Account
            </Button>
          </div>
        </section>

        {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
        {success && <p className="text-sm text-green-700 font-semibold">{success}</p>}
      </div>
    </div>
  );
};

const PersonalizationModal = ({
  initial,
  open,
  onClose,
  onSave
}: {
  initial: UserPreferences;
  open: boolean;
  onClose: () => void;
  onSave: (prefs: UserPreferences) => Promise<void>;
}) => {
  const [role, setRole] = useState<Role | ''>(initial.role || '');
  const [concern, setConcern] = useState(initial.mainConcern || '');
  const [customConcern, setCustomConcern] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [generateBriefs, setGenerateBriefs] = useState(true);

  useEffect(() => {
    if (!open) return;
    setRole(initial.role || '');
    const initialConcern = initial.mainConcern || '';
    const isPresetFocus = FOCUS_OPTIONS.includes(initialConcern);
    setConcern(initialConcern);
    setCustomConcern(isPresetFocus ? '' : initialConcern);
    setIsCustom(Boolean(initialConcern) && !isPresetFocus);
    setGenerateBriefs(true);
  }, [initial, open]);

  if (!open) return null;

  const handleFocusSelect = (opt: string) => {
    if (opt === OTHER_FOCUS_OPTION) {
      setIsCustom(true);
      setConcern(customConcern);
      return;
    }
    setIsCustom(false);
    setConcern(opt);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setCustomConcern(next);
    setConcern(next);
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl">
        <h3 className="text-2xl font-black text-slate-900 mb-5">Personalize Briefs</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Role</label>
            <select className="w-full rounded-xl border-slate-200 py-3 mt-1" value={role} onChange={(e) => setRole(e.target.value as Role | '')}>
              <option value="">Select role</option>
              <option value="Product Leader">Product Leader</option>
              <option value="Business Leader">Business Leader</option>
              <option value="Founder">Founder</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Focus Area</label>
            <div className="mt-2 space-y-2">
              {FOCUS_OPTIONS.map((opt) => {
                const isSelected = isCustom ? opt === OTHER_FOCUS_OPTION : concern === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleFocusSelect(opt)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all flex justify-between items-center ${isSelected ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-700 hover:border-slate-400'}`}
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
                  placeholder="Enter your custom focus area"
                  className="w-full rounded-xl border-slate-200 py-3 px-4 text-sm focus:ring-slate-900 focus:border-slate-900"
                  autoFocus
                />
              )}
            </div>
          </div>
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={generateBriefs}
              onChange={(e) => setGenerateBriefs(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            Personalize and generate briefs now (costs 1 token)
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => onSave({
              role,
              companySize: '',
              decisionAreas: inferDecisionAreasFromConcern(concern),
              mainConcern: concern,
              generateBriefs,
              hasPersonalized: Boolean(role || concern)
            })}
            disabled={!role || !concern}
          >
            {generateBriefs ? 'Save and Refresh Signals' : 'Save Personalization'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const BuyTokensModal = ({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-slate-900">Buy Tokens</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900"><Icon name="close" /></button>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-10 text-center text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-200 mb-4">Token Store</p>
          <h4 className="text-4xl font-black tracking-tight mb-3">Coming Soon</h4>
          <p className="text-slate-200 font-medium max-w-md mx-auto leading-relaxed">
            We are crafting a premium token purchase experience. Stay tuned.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main App Entry ---

const App = () => {
  const AUTH_TOKEN_KEY = 'ai_signals_auth_token';
  const AUTH_USER_KEY = 'ai_signals_auth_user';
  const OAUTH_INTENT_KEY = 'ai_signals_oauth_intent';
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('marketing');
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authBootstrapped, setAuthBootstrapped] = useState(false);
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [personalizationOpen, setPersonalizationOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusOutOfTokens, setStatusOutOfTokens] = useState(false);
  const [authGlobalError, setAuthGlobalError] = useState('');

  const persistUser = (nextUser: User, token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
  };

  const clearPersistedSession = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(OAUTH_INTENT_KEY);
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
    setAuthGlobalError('');
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

      const nextUser: User = data.user;
      persistUser(nextUser, data.token);
      setUser(nextUser);
      setTokenBalance(Number(data.tokenBalance || 0));
      setView(nextUser.preferences.hasPersonalized ? 'dashboard' : 'personalization');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async (intent: 'signin' | 'signup') => {
    setAuthLoading(true);
    setAuthGlobalError('');
    try {
      localStorage.setItem(OAUTH_INTENT_KEY, intent);
      const redirectTo = `${window.location.origin}/?intent=${intent}`;
      const response = await fetch('/api/auth/google/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redirectTo, intent })
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
      setBriefs([]);
      setTokenBalance(0);
      setView('marketing');
    }
  };

  const authHeaders = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY) || '';
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  };

  const loadDashboard = async () => {
    const response = await fetch('/api/dashboard', { headers: { Authorization: authHeaders().Authorization } });
    const data = await parseApiResponse(response);
    if (!response.ok || !data.success) throw new Error(data.error || 'Failed loading dashboard');
    const dashboard: DashboardState = {
      tokenBalance: Number(data.tokenBalance || 0),
      personalization: data.personalization,
      briefs: data.briefs || [],
      hasBatch: Boolean(data.hasBatch),
      latestBatch: data.latestBatch || null
    };
    setTokenBalance(dashboard.tokenBalance);
    setBriefs(dashboard.briefs || []);
    setUser((currentUser) => {
      if (!currentUser) return currentUser;
      const updated = { ...currentUser, preferences: dashboard.personalization || currentUser.preferences };
      const token = localStorage.getItem(AUTH_TOKEN_KEY) || '';
      if (token) persistUser(updated, token);
      return updated;
    });
  };

  const handlePersonalizationComplete = async (prefs: UserPreferences) => {
    setPersonalizationOpen(false);
    setLoading(true);
    setStatusMessage('');
    setStatusOutOfTokens(false);
    try {
      const response = await fetch('/api/dashboard?action=personalization', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(prefs)
      });
      const data = await parseApiResponse(response);
      if (!response.ok || !data.success) throw new Error(data.error || 'Failed to save personalization');
      setUser((currentUser) => {
        if (!currentUser) return currentUser;
        const updated = { ...currentUser, preferences: data.personalization || prefs };
        const token = localStorage.getItem(AUTH_TOKEN_KEY) || '';
        if (token) persistUser(updated, token);
        return updated;
      });
      if (Array.isArray(data.briefs)) setBriefs(data.briefs);
      setTokenBalance(Number(data.tokenBalance || tokenBalance));
      if (data.requiresTopUp) {
        setStatusOutOfTokens(true);
        setStatusMessage("You're out of tokens. Personalization was saved, but briefs were not generated.");
      } else {
        setStatusOutOfTokens(false);
      }
      if (!data.requiresTopUp) {
        setStatusMessage(data.generated ? 'Personalization saved and briefs generated.' : 'Personalization saved.');
      }
      await loadDashboard();
      setSelectedBrief(null);
      setView('dashboard');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to save personalization');
    } finally {
      setLoading(false);
    }
  };

  const navigateToBrief = (brief: Brief) => {
    setSelectedBrief(brief);
    setView('detail');
  };

  const updatePassword = async (newPassword: string) => {
    setSettingsLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ newPassword })
      });
      const data = await parseApiResponse(response);
      if (!response.ok || !data.success) throw new Error(data.error || 'Failed to update password');
    } finally {
      setSettingsLoading(false);
    }
  };

  const deleteAccount = async (confirmationText: string) => {
    setSettingsLoading(true);
    try {
      const response = await fetch('/api/settings?action=delete-account', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ confirmationText })
      });
      const data = await parseApiResponse(response);
      if (!response.ok || !data.success) throw new Error(data.error || 'Failed to delete account');
      await handleSignOut();
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const bootstrapSession = async () => {
      let token = localStorage.getItem(AUTH_TOKEN_KEY);
      const oauthIntent = localStorage.getItem(OAUTH_INTENT_KEY) || '';

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
            body: JSON.stringify({ code: queryParams.get('code'), intent: queryParams.get('intent') || '' })
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
          headers: {
            Authorization: `Bearer ${token}`,
            'x-auth-intent': oauthIntent
          }
        });
        const data = await parseApiResponse(response);
        if (!response.ok || !data.success) {
          if (data?.code === 'account_deleted') {
            setAuthGlobalError(data.error || 'No user exists for this account. Please create a new account.');
          }
          throw new Error(data.error || 'Invalid session');
        }

        const sessionUser: User = data.user;
        if (!active) return;
        setUser(sessionUser);
        setTokenBalance(Number(data.tokenBalance || 0));
        setView(sessionUser.preferences?.hasPersonalized ? 'dashboard' : 'personalization');
        localStorage.removeItem(OAUTH_INTENT_KEY);
      } catch {
        clearPersistedSession();
        if (active) setView('signin');
      } finally {
        if (active) setAuthBootstrapped(true);
      }
    };

    bootstrapSession();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (view !== 'dashboard' || !user) return;
    loadDashboard().catch((error) => {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to load dashboard');
    });
  }, [view, user?.email]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      setStatusMessage('Payment successful. Your token balance has been updated.');
      setStatusOutOfTokens(false);
      setView('dashboard');
      loadDashboard().catch(() => {});
      window.history.replaceState({}, '', '/');
    } else if (params.get('checkout') === 'cancel') {
      setStatusMessage('Checkout cancelled.');
      window.history.replaceState({}, '', '/');
    }
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

  if (view === 'marketing') return <MarketingHome onAuth={setView} onNavigate={setView} />;
  if (view === 'about') return <AboutPage onBack={() => setView('marketing')} />;
  if (view === 'privacy') return <PrivacyPage onBack={() => setView('marketing')} />;
  if (view === 'terms') return <TermsPage onBack={() => setView('marketing')} />;
  if (view === 'contact') return <ContactPage onBack={() => setView('marketing')} />;
  if (view === 'signin' || view === 'signup') {
    return (
      <AuthView
        mode={view}
        onBack={() => setView('marketing')}
        onSwitchMode={setView}
        onSubmit={handleAuthSubmit}
        onGoogleAuth={handleGoogleAuth}
        loading={authLoading}
        externalError={authGlobalError}
        onClearExternalError={() => setAuthGlobalError('')}
      />
    );
  }

  if (!user) return <MarketingHome onAuth={setView} onNavigate={setView} />;

  if (view === 'personalization') return <Personalization onComplete={handlePersonalizationComplete} />;

  return (
    <>
      <AppLayout activeView={view} setView={setView} user={user} onSignOut={handleSignOut}>
        {statusMessage && (
          <div className="px-4 sm:px-6 lg:px-12 pt-4">
            <div className="max-w-5xl mx-auto rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600">
              <div className="flex items-center justify-between gap-3">
                <span>{statusMessage}</span>
                {statusOutOfTokens && (
                  <Button variant="secondary" className="rounded-full px-4 py-2" onClick={() => setBillingOpen(true)}>
                    Buy Tokens
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      {view === 'dashboard' && (
        <DashboardView
          user={user}
          briefs={briefs}
          loading={loading}
          tokenBalance={tokenBalance}
          onOpenBrief={navigateToBrief}
          onOpenPersonalization={() => setPersonalizationOpen(true)}
          onOpenBilling={() => setBillingOpen(true)}
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
          onUpdatePassword={updatePassword}
          onDeleteAccount={deleteAccount}
          loading={settingsLoading}
        />
      )}
      </AppLayout>
      <PersonalizationModal
        open={personalizationOpen}
        initial={user.preferences}
        onClose={() => setPersonalizationOpen(false)}
        onSave={handlePersonalizationComplete}
      />
      <BuyTokensModal
        open={billingOpen}
        onClose={() => setBillingOpen(false)}
      />
    </>
  );
};

export default App;
