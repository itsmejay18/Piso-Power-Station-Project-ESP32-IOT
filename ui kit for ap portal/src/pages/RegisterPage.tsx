import { useState } from 'react';
import { Zap, Eye, EyeOff, Lock, Mail, User, Phone, ChevronRight, Building } from 'lucide-react';
import ParticleField from '../components/ParticleField';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', business: '', password: '', confirm: '', role: 'user',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) { setStep(2); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNavigate('dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cyber-dark py-12">
      <div className="scan-line" />
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 70% 30%, rgba(0,255,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(255,0,51,0.08) 0%, transparent 60%)',
      }} />
      <ParticleField />

      <button onClick={() => onNavigate('landing')} className="absolute top-6 left-6 z-20 flex items-center gap-2 text-cyber-text hover:text-neon-blue text-xs font-orbitron tracking-wider transition-colors">
        <ChevronRight className="w-4 h-4 rotate-180" />
        BACK
      </button>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        <div className="w-8 h-8 border border-neon-blue flex items-center justify-center" style={{ boxShadow: '0 0 12px #00d4ff' }}>
          <Zap className="w-4 h-4 text-neon-blue" />
        </div>
        <div>
          <div className="font-orbitron font-bold text-white text-xs tracking-widest">BYG-PISOTAB</div>
          <div className="font-orbitron font-black text-neon-red text-xs" style={{ textShadow: '0 0 8px #ff0033' }}>PRO</div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-4 mt-16">
        <div className="relative glass-card rounded-sm overflow-hidden"
          style={{ border: '1px solid rgba(0,255,255,0.4)', boxShadow: '0 0 40px rgba(0,255,255,0.1)' }}>
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #00ffff, #ff00aa, #ff0033)' }} />

          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-neon-red opacity-60" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-neon-red opacity-60" />

          <div className="p-8 sm:p-10">
            <div className="text-center mb-6">
              <h1 className="font-orbitron font-bold text-white text-xl tracking-widest mb-1">CREATE ACCOUNT</h1>
              <p className="text-cyber-text text-sm font-rajdhani">Join the BYG-PISOTAB PRO ecosystem</p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-orbitron font-bold transition-all duration-300 ${
                    step >= s
                      ? 'bg-neon-blue text-white'
                      : 'border border-cyber-border text-cyber-text'
                  }`}
                    style={step >= s ? { boxShadow: '0 0 12px #00d4ff' } : {}}>
                    {s}
                  </div>
                  <div className="text-xs font-orbitron tracking-wider" style={{ color: step >= s ? '#00d4ff' : '#6b9ab8' }}>
                    {s === 1 ? 'PROFILE' : 'SECURITY'}
                  </div>
                  {s < 2 && <div className="flex-1 h-px ml-2" style={{ background: step > s ? '#00d4ff' : 'rgba(0,212,255,0.2)' }} />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neon-cyan text-xs font-orbitron tracking-widest mb-2">FULL NAME</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-cyan/60" />
                        <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="John Doe"
                          className="cyber-input w-full pl-10 pr-4 py-3 text-sm rounded-sm" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-neon-cyan text-xs font-orbitron tracking-widest mb-2">PHONE</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-cyan/60" />
                        <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="+63 9XX XXX XXXX"
                          className="cyber-input w-full pl-10 pr-4 py-3 text-sm rounded-sm" required />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neon-cyan text-xs font-orbitron tracking-widest mb-2">EMAIL ADDRESS</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-cyan/60" />
                      <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="user@example.com"
                        className="cyber-input w-full pl-10 pr-4 py-3 text-sm rounded-sm" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neon-cyan text-xs font-orbitron tracking-widest mb-2">BUSINESS NAME</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-cyan/60" />
                      <input name="business" value={form.business} onChange={handleChange} type="text" placeholder="Your Business"
                        className="cyber-input w-full pl-10 pr-4 py-3 text-sm rounded-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neon-cyan text-xs font-orbitron tracking-widest mb-2">ACCOUNT TYPE</label>
                    <select name="role" value={form.role} onChange={handleChange}
                      className="cyber-input w-full px-4 py-3 text-sm rounded-sm appearance-none">
                      <option value="user">User — PisoTab Owner</option>
                      <option value="dealer">Dealer — Reseller</option>
                      <option value="admin">Admin — System Admin</option>
                    </select>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-neon-pink text-xs font-orbitron tracking-widest mb-2">PASSWORD</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-pink/60" />
                      <input name="password" value={form.password} onChange={handleChange}
                        type={showPass ? 'text' : 'password'} placeholder="Min 8 characters"
                        className="cyber-input w-full pl-10 pr-10 py-3 text-sm rounded-sm" required />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-text hover:text-neon-pink transition-colors">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Strength bar */}
                    <div className="mt-2 cyber-progress h-1">
                      <div className="cyber-progress-bar h-full transition-all duration-500"
                        style={{ width: form.password.length > 8 ? '75%' : form.password.length > 5 ? '50%' : form.password.length > 2 ? '25%' : '0%' }} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neon-pink text-xs font-orbitron tracking-widest mb-2">CONFIRM PASSWORD</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-pink/60" />
                      <input name="confirm" value={form.confirm} onChange={handleChange}
                        type="password" placeholder="Repeat password"
                        className="cyber-input w-full pl-10 pr-4 py-3 text-sm rounded-sm" required />
                      {form.confirm && (
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-orbitron ${form.password === form.confirm ? 'text-neon-green' : 'text-neon-red'}`}>
                          {form.password === form.confirm ? 'MATCH' : 'NO MATCH'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="glass-card border border-neon-blue/20 p-4 rounded-sm">
                    <p className="text-cyber-text text-xs font-rajdhani leading-relaxed">
                      By creating an account you agree to our{' '}
                      <span className="text-neon-blue cursor-pointer">Terms of Service</span> and{' '}
                      <span className="text-neon-blue cursor-pointer">Privacy Policy</span>.
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                {step > 1 && (
                  <button type="button" onClick={() => setStep(1)}
                    className="btn-neon-blue flex-1 py-3 rounded-sm text-sm flex items-center justify-center gap-2">
                    <ChevronRight className="w-4 h-4 rotate-180" /> BACK
                  </button>
                )}
                <button type="submit" disabled={loading}
                  className="btn-neon-solid flex-1 py-3 rounded-sm text-sm flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>CREATING...</span>
                    </div>
                  ) : (
                    <>{step === 1 ? 'CONTINUE' : 'CREATE ACCOUNT'} <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>

            <p className="text-center text-cyber-text text-sm font-rajdhani mt-6">
              Already have an account?{' '}
              <button onClick={() => onNavigate('login')} className="text-neon-blue hover:text-neon-cyan font-semibold transition-colors">
                LOGIN
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
