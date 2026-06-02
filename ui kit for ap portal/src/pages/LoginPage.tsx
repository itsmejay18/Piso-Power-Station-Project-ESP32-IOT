import { useState } from 'react';
import { Zap, Eye, EyeOff, Lock, Mail, ChevronRight } from 'lucide-react';
import ParticleField from '../components/ParticleField';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNavigate('dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cyber-dark">
      <div className="scan-line" />
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(0,212,255,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(255,0,51,0.08) 0%, transparent 60%)',
      }} />
      <ParticleField />

      {/* Back button */}
      <button onClick={() => onNavigate('landing')} className="absolute top-6 left-6 z-20 flex items-center gap-2 text-cyber-text hover:text-neon-blue text-xs font-orbitron tracking-wider transition-colors">
        <ChevronRight className="w-4 h-4 rotate-180" />
        BACK
      </button>

      {/* Logo */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        <div className="w-8 h-8 border border-neon-blue flex items-center justify-center" style={{ boxShadow: '0 0 12px #00d4ff' }}>
          <Zap className="w-4 h-4 text-neon-blue" />
        </div>
        <div>
          <div className="font-orbitron font-bold text-white text-xs tracking-widest">BYG-PISOTAB</div>
          <div className="font-orbitron font-black text-neon-red text-xs" style={{ textShadow: '0 0 8px #ff0033' }}>PRO</div>
        </div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="relative glass-card rounded-sm overflow-hidden"
          style={{ border: '1px solid rgba(0,212,255,0.4)', boxShadow: '0 0 40px rgba(0,212,255,0.15), 0 0 80px rgba(0,212,255,0.05)' }}>
          {/* Top neon bar */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #ff0033, #00d4ff, #00ffff)' }} />

          {/* Corner decorations */}
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-neon-cyan opacity-60" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-neon-cyan opacity-60" />

          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 border-2 border-neon-blue rounded-full"
                style={{ background: 'rgba(0,212,255,0.1)', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
                <Lock className="w-7 h-7 text-neon-blue" />
              </div>
              <h1 className="font-orbitron font-bold text-white text-xl tracking-widest mb-1">SYSTEM ACCESS</h1>
              <p className="text-cyber-text text-sm font-rajdhani">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-neon-blue text-xs font-orbitron tracking-widest mb-2">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-blue/60" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="cyber-input w-full pl-10 pr-4 py-3 text-sm rounded-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-neon-blue text-xs font-orbitron tracking-widest mb-2">PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-blue/60" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="cyber-input w-full pl-10 pr-10 py-3 text-sm rounded-sm"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-text hover:text-neon-blue transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="w-4 h-4 border border-neon-blue/50 flex items-center justify-center">
                    <div className="w-2 h-2 bg-neon-blue" />
                  </div>
                  <span className="text-cyber-text text-xs font-rajdhani">Remember me</span>
                </label>
                <button type="button" className="text-neon-blue text-xs font-orbitron tracking-wider hover:text-neon-cyan transition-colors">
                  FORGOT PASSWORD?
                </button>
              </div>

              <button type="submit" disabled={loading}
                className="btn-neon-solid w-full py-3 rounded-sm text-sm flex items-center justify-center gap-2 relative overflow-hidden">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </div>
                ) : (
                  <>LOGIN TO SYSTEM <ChevronRight className="w-4 h-4" /></>
                )}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full neon-divider opacity-30" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-cyber-card px-3 text-cyber-text text-xs font-rajdhani">OR CONTINUE WITH</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {['GOOGLE', 'GITHUB'].map(p => (
                  <button key={p} type="button"
                    className="py-2.5 text-xs font-orbitron tracking-wider text-cyber-text border border-cyber-border hover:border-neon-blue hover:text-neon-blue transition-all duration-300 rounded-sm">
                    {p}
                  </button>
                ))}
              </div>
            </form>

            <p className="text-center text-cyber-text text-sm font-rajdhani mt-6">
              No account?{' '}
              <button onClick={() => onNavigate('register')} className="text-neon-blue hover:text-neon-cyan font-semibold transition-colors">
                REGISTER NOW
              </button>
            </p>
          </div>
        </div>

        {/* Version tag */}
        <div className="text-center mt-4 text-cyber-text/40 text-xs font-orbitron">
          BYG-PISOTAB PRO v2.4.1 — SECURE PORTAL
        </div>
      </div>
    </div>
  );
}
