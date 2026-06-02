import { ChevronRight, Lock, Zap, Cloud, Globe, Users, Wifi, BarChart2, Shield, Smartphone, Cpu, RefreshCw, Monitor, Key } from 'lucide-react';

interface FeaturesPageProps {
  onNavigate: (page: string) => void;
}

const features = [
  {
    icon: Monitor,
    title: 'Smart Launcher',
    desc: 'Secure kiosk mode launcher for uninterrupted gaming experience',
    details: [
      'Restricted access to system settings',
      'Auto-start game on device boot',
      'Network connectivity detection',
      'Offline operation mode',
      'One-click exit protection',
    ],
    color: '#00d4ff',
  },
  {
    icon: Cpu,
    title: 'IoT Integration',
    desc: 'Advanced hardware integration for coin slots, relays and more',
    details: [
      'Coin acceptor integration',
      'Bill validator support',
      'Relay control module',
      'Serial port communication',
      'Real-time hardware monitoring',
    ],
    color: '#ff0033',
  },
  {
    icon: Key,
    title: 'Cloud Licensing',
    desc: 'Powerful license management with real-time activation',
    details: [
      'Online/offline validation',
      'Device binding support',
      'Expiry tracking & alerts',
      'License transfer capability',
      'Multi-tier license types',
    ],
    color: '#00ffff',
  },
  {
    icon: Globe,
    title: 'Remote Dashboard',
    desc: 'Monitor and manage devices anytime, anywhere in real-time',
    details: [
      'Live device status tracking',
      'Remote configuration',
      'Real-time analytics',
      'Batch operations',
      'Historical data reports',
    ],
    color: '#ff00aa',
  },
  {
    icon: Users,
    title: 'Dealer System',
    desc: 'Multi-level dealer system for distribution and management',
    details: [
      'Tiered dealer hierarchy',
      'Revenue tracking',
      'Performance analytics',
      'Device quota management',
      'Commission automation',
    ],
    color: '#00ff88',
  },
  {
    icon: Wifi,
    title: 'Offline Support',
    desc: 'Works even without internet with smart validation',
    details: [
      'Offline game operation',
      'Local license caching',
      'Sync on reconnection',
      'Data persistence',
      'Automatic re-activation',
    ],
    color: '#ffaa00',
  },
];

export default function FeaturesPage({ onNavigate }: FeaturesPageProps) {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="scan-line" />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-neon-blue/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => onNavigate('landing')} className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-neon-blue flex items-center justify-center" style={{ boxShadow: '0 0 15px #00d4ff' }}>
                <Zap className="w-5 h-5 text-neon-blue" />
              </div>
              <div>
                <div className="font-orbitron font-bold text-white text-sm tracking-widest">BYG-PISOTAB</div>
                <div className="font-orbitron font-black text-neon-red text-xs tracking-widest" style={{ textShadow: '0 0 8px #ff0033' }}>PRO</div>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {[
                { label: 'Home', page: 'landing' },
                { label: 'Features', page: 'features' },
                { label: 'Downloads', page: 'downloads-page' },
                { label: 'Pricing', page: 'pricing' },
                { label: 'Dealer', page: 'dealers-page' },
                { label: 'Contact', page: 'contact' },
              ].map(item => (
                <button key={item.page} onClick={() => onNavigate(item.page)} className={`nav-item ${item.page === 'features' ? 'active' : ''}`}>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => onNavigate('login')} className="btn-neon-blue px-5 py-2 text-xs rounded-sm">LOGIN</button>
              <button onClick={() => onNavigate('register')} className="btn-neon-solid px-5 py-2 text-xs rounded-sm">REGISTER</button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-96 flex items-center justify-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.1) 0%, transparent 70%)',
        }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-neon-blue/40 bg-neon-blue/5 rounded-sm">
            <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" style={{ boxShadow: '0 0 8px #00d4ff' }} />
            <span className="font-orbitron text-neon-blue text-xs tracking-widest">POWERFUL CAPABILITIES</span>
          </div>

          <h1 className="font-orbitron font-black text-white text-5xl sm:text-6xl mb-4 tracking-tight" style={{ textShadow: '0 0 40px rgba(0,212,255,0.2)' }}>
            Everything for Your <span className="text-neon-cyan">PisoTab Business</span>
          </h1>
          <p className="text-cyber-text font-rajdhani text-lg max-w-2xl mx-auto mb-8">
            Advanced features designed for modern arcade and PisoTab operators
          </p>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div key={i} className="feature-card p-8 rounded-sm group cursor-pointer">
                <div className="relative mb-6">
                  <div className="w-14 h-14 flex items-center justify-center border rounded-sm" style={{
                    borderColor: feat.color + '50',
                    background: feat.color + '15',
                    boxShadow: `0 0 20px ${feat.color}20`,
                  }}>
                    <feat.icon className="w-7 h-7" style={{ color: feat.color }} />
                  </div>
                </div>
                <h3 className="font-orbitron font-bold text-white text-sm tracking-widest mb-3 group-hover:text-neon-blue transition-colors">
                  {feat.title}
                </h3>
                <p className="text-cyber-text text-sm leading-relaxed font-rajdhani mb-5">{feat.desc}</p>

                {/* Feature list */}
                <ul className="space-y-2 mb-6">
                  {feat.details.map((detail, j) => (
                    <li key={j} className="flex items-start gap-2 text-cyber-text text-xs font-rajdhani">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: feat.color }} />
                      {detail}
                    </li>
                  ))}
                </ul>

                <button className="flex items-center gap-2 text-xs font-orbitron tracking-wider transition-colors" style={{ color: feat.color }}>
                  <span>LEARN MORE</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANCED SECTION */}
      <section className="relative py-24 bg-cyber-navy/50 border-t border-cyber-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title text-3xl mb-4">Advanced Capabilities</h2>
            <p className="text-cyber-text font-rajdhani text-lg">Built for enterprise-grade operations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Shield,
                title: 'Enterprise Security',
                items: ['256-bit encryption', 'Role-based access', 'Audit logs', 'Two-factor auth'],
                color: '#ff0033',
              },
              {
                icon: BarChart2,
                title: 'Advanced Analytics',
                items: ['Real-time dashboards', 'Custom reports', 'Revenue tracking', 'Performance metrics'],
                color: '#00ff88',
              },
              {
                icon: RefreshCw,
                title: 'Auto-Updates',
                items: ['Scheduled updates', 'Zero downtime', 'Version rollback', 'Staged deployment'],
                color: '#00ffff',
              },
              {
                icon: Cloud,
                title: 'Cloud Integration',
                items: ['Multi-region support', 'API access', 'Webhooks', 'Data sync'],
                color: '#ff00aa',
              },
            ].map((adv, i) => (
              <div key={i} className="glass-card border border-cyber-border/50 p-8 rounded-sm">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center border rounded-sm" style={{
                    borderColor: adv.color + '40', background: adv.color + '15',
                  }}>
                    <adv.icon className="w-5 h-5" style={{ color: adv.color }} />
                  </div>
                  <h3 className="font-orbitron font-bold text-white text-sm tracking-widest">{adv.title}</h3>
                </div>
                <ul className="space-y-2">
                  {adv.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-cyber-text text-xs font-rajdhani">
                      <div className="w-1 h-1 rounded-full" style={{ background: adv.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-orbitron font-bold text-2xl text-white mb-4">Ready to Get Started?</h2>
          <p className="text-cyber-text font-rajdhani mb-8">Experience all these features with a free trial</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => onNavigate('register')} className="btn-neon-solid px-8 py-3 rounded-sm text-sm">
              START FREE TRIAL
            </button>
            <button onClick={() => onNavigate('contact')} className="btn-neon-blue px-8 py-3 rounded-sm text-sm">
              CONTACT SALES
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
