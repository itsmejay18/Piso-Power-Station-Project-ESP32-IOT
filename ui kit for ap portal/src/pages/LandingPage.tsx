import { useState, useEffect } from 'react';
import {
  Cpu, Wifi, Shield, Monitor, Users, Zap,
  Download, ChevronRight, Star, Globe, Lock,
  BarChart2, Settings, ArrowRight, Play, Menu, X
} from 'lucide-react';
import ParticleField from '../components/ParticleField';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

const features = [
  { icon: Monitor, title: 'Smart Launcher', desc: 'Secure kiosk mode launcher for uninterrupted gaming experience.', color: '#00d4ff' },
  { icon: Cpu, title: 'IoT Integration', desc: 'Advanced hardware integration for coin slots, relays and more.', color: '#ff0033' },
  { icon: Shield, title: 'Cloud Licensing', desc: 'Powerful license management with real-time activation and validation.', color: '#00ffff' },
  { icon: Globe, title: 'Remote Control', desc: 'Monitor and manage your devices anytime, anywhere in real-time.', color: '#ff00aa' },
  { icon: Users, title: 'Dealer System', desc: 'Multi-level dealer system for easy distribution and management.', color: '#00ff88' },
  { icon: Wifi, title: 'Offline Support', desc: 'Works even without internet with smart offline validation.', color: '#ffaa00' },
];

const stats = [
  { value: '1,245+', label: 'Active Devices' },
  { value: '8,652+', label: 'Total Activations' },
  { value: '56+', label: 'Registered Dealers' },
  { value: '99.9%', label: 'Uptime System' },
];

const steps = [
  { num: '1', title: 'Install Device', desc: 'Install BYG-PISOTAB launcher on your device.', icon: Download },
  { num: '2', title: 'Activate License', desc: 'Activate using your license key and connect to cloud.', icon: Lock },
  { num: '3', title: 'Connect IoT', desc: 'Connect your IoT hardware and configure settings.', icon: Cpu },
  { num: '4', title: 'Manage & Grow', desc: 'Monitor, manage and grow your business effortlessly.', icon: BarChart2 },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [count, setCount] = useState({ devices: 0, activations: 0, dealers: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => ({
        devices: Math.min(prev.devices + 13, 1245),
        activations: Math.min(prev.activations + 87, 8652),
        dealers: Math.min(prev.dealers + 1, 56),
      }));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-cyber-dark relative overflow-x-hidden">
      <div className="scan-line" />

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-panel border-b border-neon-blue/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 border-2 border-neon-blue flex items-center justify-center" style={{ boxShadow: '0 0 15px #00d4ff' }}>
                  <Zap className="w-5 h-5 text-neon-blue" />
                </div>
              </div>
              <div>
                <div className="font-orbitron font-bold text-white text-sm tracking-widest">BYG-PISOTAB</div>
                <div className="font-orbitron font-black text-neon-red text-xs tracking-widest" style={{ textShadow: '0 0 8px #ff0033' }}>PRO</div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {['Home', 'Features', 'Downloads', 'Pricing', 'Dealer', 'Contact'].map(item => (
                <button key={item} className="nav-item">{item}</button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => onNavigate('login')} className="btn-neon-blue px-5 py-2 text-xs rounded-sm">
                LOGIN
              </button>
              <button onClick={() => onNavigate('register')} className="btn-neon-solid px-5 py-2 text-xs rounded-sm">
                REGISTER
              </button>
            </div>

            <button className="md:hidden text-neon-blue" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden glass-panel border-t border-neon-blue/20 px-4 py-4">
            {['Home', 'Features', 'Downloads', 'Pricing', 'Dealer', 'Contact'].map(item => (
              <button key={item} className="block w-full text-left nav-item py-3">{item}</button>
            ))}
            <div className="flex gap-3 mt-4">
              <button onClick={() => onNavigate('login')} className="btn-neon-blue px-5 py-2 text-xs rounded-sm flex-1">LOGIN</button>
              <button onClick={() => onNavigate('register')} className="btn-neon-solid px-5 py-2 text-xs rounded-sm flex-1">REGISTER</button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background layers */}
        <div className="absolute inset-0 cyber-grid opacity-40" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(255,0,51,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(0,212,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(0,255,255,0.08) 0%, transparent 50%)',
        }} />
        <ParticleField />

        {/* Cyberpunk city silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none" style={{
          background: 'linear-gradient(to top, rgba(2,4,8,1) 0%, transparent 100%)',
        }} />
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden h-72 opacity-30">
          <svg viewBox="0 0 1440 288" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full">
            <rect x="0" y="180" width="60" height="108" fill="#0a1628"/>
            <rect x="20" y="140" width="20" height="40" fill="#0a1628"/>
            <rect x="70" y="150" width="80" height="138" fill="#0d1f3c"/>
            <rect x="90" y="110" width="40" height="40" fill="#0d1f3c"/>
            <rect x="160" y="120" width="100" height="168" fill="#0a1628"/>
            <rect x="180" y="80" width="60" height="40" fill="#0a1628"/>
            <rect x="270" y="160" width="70" height="128" fill="#0d1f3c"/>
            <rect x="350" y="100" width="120" height="188" fill="#0a1628"/>
            <rect x="370" y="60" width="80" height="40" fill="#0a1628"/>
            <rect x="480" y="140" width="90" height="148" fill="#0d1f3c"/>
            <rect x="580" y="110" width="60" height="178" fill="#0a1628"/>
            <rect x="650" y="160" width="80" height="128" fill="#0d1f3c"/>
            <rect x="740" y="90" width="100" height="198" fill="#0a1628"/>
            <rect x="760" y="50" width="60" height="40" fill="#0a1628"/>
            <rect x="850" y="130" width="90" height="158" fill="#0d1f3c"/>
            <rect x="950" y="100" width="70" height="188" fill="#0a1628"/>
            <rect x="1030" y="150" width="80" height="138" fill="#0d1f3c"/>
            <rect x="1120" y="80" width="120" height="208" fill="#0a1628"/>
            <rect x="1140" y="40" width="80" height="40" fill="#0a1628"/>
            <rect x="1250" y="130" width="90" height="158" fill="#0d1f3c"/>
            <rect x="1350" y="160" width="90" height="128" fill="#0a1628"/>
            {/* Neon window lights */}
            <rect x="75" y="155" width="6" height="6" fill="#00d4ff" opacity="0.8"/>
            <rect x="85" y="155" width="6" height="6" fill="#ff0033" opacity="0.6"/>
            <rect x="165" y="125" width="6" height="6" fill="#00d4ff" opacity="0.7"/>
            <rect x="355" y="105" width="8" height="8" fill="#ff0033" opacity="0.8"/>
            <rect x="745" y="95" width="8" height="8" fill="#00ffff" opacity="0.7"/>
            <rect x="1125" y="85" width="6" height="6" fill="#ff00aa" opacity="0.8"/>
          </svg>
        </div>


        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-neon-blue/40 bg-neon-blue/5 rounded-sm">
              <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" style={{ boxShadow: '0 0 8px #00d4ff' }} />
              <span className="font-orbitron text-neon-blue text-xs tracking-widest">NEXT GENERATION PISOTAB ECOSYSTEM</span>
            </div>

            {/* Title */}
            <h1 className="font-orbitron font-black text-white leading-none mb-2">
              <span className="block text-4xl sm:text-5xl lg:text-7xl tracking-tight" style={{ textShadow: '0 0 40px rgba(255,255,255,0.2)' }}>
                BYG-PISOTAB
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-8xl text-neon-red animate-flicker" style={{ textShadow: '0 0 30px #ff0033, 0 0 60px rgba(255,0,51,0.5)' }}>
                PRO
              </span>
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-neon-blue to-transparent" style={{ boxShadow: '0 0 6px #00d4ff' }} />
              <p className="font-rajdhani font-semibold text-neon-cyan text-lg sm:text-xl tracking-wider" style={{ textShadow: '0 0 10px #00ffff' }}>
                Smart Launcher • IoT Integration • Cloud Licensing
              </p>
            </div>

            <p className="text-cyber-text text-base sm:text-lg leading-relaxed mb-10 max-w-2xl font-rajdhani">
              A futuristic ecosystem for modern PisoTab businesses powered by cloud management, device activation, and advanced automation.
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => onNavigate('register')} className="btn-neon-solid px-8 py-3 rounded-sm text-sm flex items-center gap-2">
                GET STARTED <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => onNavigate('downloads')} className="btn-neon-blue px-8 py-3 rounded-sm text-sm flex items-center gap-2">
                <Download className="w-4 h-4" /> DOWNLOAD APP
              </button>
              <button onClick={() => onNavigate('dealer')} className="flex items-center gap-2 px-8 py-3 text-sm font-orbitron font-semibold tracking-wider text-cyber-text border border-cyber-border hover:border-neon-pink hover:text-neon-pink transition-all duration-300 rounded-sm">
                <Users className="w-4 h-4" /> DEALER ACCESS
              </button>
            </div>

            {/* Mini stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-cyber-border/50">
              {[
                { v: `${count.devices.toLocaleString()}+`, l: 'Active Devices' },
                { v: `${count.activations.toLocaleString()}+`, l: 'Total Activations' },
                { v: `${count.dealers}+`, l: 'Registered Dealers' },
                { v: '99.9%', l: 'Uptime' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-orbitron font-bold text-2xl text-white" style={{ textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>{s.v}</div>
                  <div className="text-cyber-text text-xs font-rajdhani tracking-wider mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyber-dark to-transparent pointer-events-none" />
      </section>

      {/* FEATURES */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="neon-divider w-24" />
              <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl">POWERFUL FEATURES</h2>
              <div className="neon-divider w-24" />
            </div>
            <p className="text-cyber-text font-rajdhani text-lg max-w-2xl mx-auto">
              Everything you need to run a modern PisoTab business ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div key={i} className="feature-card p-6 rounded-sm group cursor-pointer" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="relative mb-5">
                  <div className="w-14 h-14 flex items-center justify-center border rounded-sm" style={{
                    borderColor: feat.color + '50',
                    background: feat.color + '15',
                    boxShadow: `0 0 20px ${feat.color}20`,
                    transition: 'all 0.3s ease',
                  }}>
                    <feat.icon className="w-7 h-7 transition-all duration-300" style={{ color: feat.color }} />
                  </div>
                  <div className="absolute -inset-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                    background: `radial-gradient(ellipse at center, ${feat.color}15, transparent)`,
                  }} />
                </div>
                <h3 className="font-orbitron font-bold text-white text-sm tracking-widest mb-3 group-hover:text-neon-blue transition-colors" style={{ textShadow: `0 0 10px ${feat.color}30` }}>
                  {feat.title}
                </h3>
                <p className="text-cyber-text text-sm leading-relaxed font-rajdhani">{feat.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-orbitron opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: feat.color }}>
                  <span>LEARN MORE</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-24">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="neon-divider w-24" />
              <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl">HOW IT WORKS</h2>
              <div className="neon-divider w-24" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-neon-blue/50 to-transparent z-10 transform translate-x-0" />
                )}
                <div className="glass-card border border-cyber-border/50 p-6 rounded-sm text-center hover:border-neon-blue/50 transition-all duration-300 group">
                  <div className="relative inline-flex mb-4">
                    <div className="w-16 h-16 flex items-center justify-center border-2 rounded-full transition-all duration-300 group-hover:scale-110"
                      style={{ borderColor: '#00d4ff', background: 'rgba(0,212,255,0.1)', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
                      <step.icon className="w-7 h-7 text-neon-blue" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center rounded-full font-orbitron font-black text-xs"
                      style={{ background: '#ff0033', color: '#fff', boxShadow: '0 0 10px #ff0033' }}>
                      {step.num}
                    </div>
                  </div>
                  <h3 className="font-orbitron font-bold text-white text-xs tracking-widest mb-2 uppercase">{step.title}</h3>
                  <p className="text-cyber-text text-sm font-rajdhani leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, #020408, rgba(0,212,255,0.05), #020408)',
          borderTop: '1px solid rgba(0,212,255,0.2)',
          borderBottom: '1px solid rgba(0,212,255,0.2)',
        }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center py-4">
                <div className="font-orbitron font-black text-3xl sm:text-4xl text-white mb-1" style={{ textShadow: '0 0 20px rgba(0,212,255,0.6)' }}>
                  {stat.value}
                </div>
                <div className="text-cyber-text text-sm font-rajdhani tracking-wider uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(255,0,51,0.1) 0%, transparent 70%)',
        }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="glass-panel border border-neon-red/30 rounded-sm p-10 sm:p-16" style={{ boxShadow: '0 0 40px rgba(255,0,51,0.1)' }}>
            <h2 className="font-orbitron font-black text-2xl sm:text-3xl lg:text-4xl text-white mb-4">
              READY TO LEVEL UP YOUR
              <span className="block text-neon-red mt-1" style={{ textShadow: '0 0 20px #ff0033' }}>PISOTAB BUSINESS?</span>
            </h2>
            <p className="text-cyber-text font-rajdhani text-lg mb-8">
              Join thousands of businesses who trust BYG-PISOTAB PRO
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => onNavigate('register')} className="btn-neon-solid px-10 py-4 rounded-sm text-sm flex items-center gap-2">
                GET STARTED NOW <Play className="w-4 h-4 fill-current" />
              </button>
              <button className="btn-neon-blue px-10 py-4 rounded-sm text-sm flex items-center gap-2">
                <Star className="w-4 h-4" /> VIEW PRICING
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-cyber-border/30 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-neon-blue flex items-center justify-center" style={{ boxShadow: '0 0 10px #00d4ff' }}>
                <Zap className="w-4 h-4 text-neon-blue" />
              </div>
              <span className="font-orbitron font-bold text-white text-sm tracking-widest">BYG-PISOTAB <span className="text-neon-red">PRO</span></span>
            </div>
            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'Support', 'Contact'].map(item => (
                <button key={item} className="text-cyber-text hover:text-neon-blue text-xs font-rajdhani tracking-wider transition-colors">{item}</button>
              ))}
            </div>
            <div className="text-cyber-text text-xs font-rajdhani">
              © 2024 BYG-PISOTAB PRO. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
