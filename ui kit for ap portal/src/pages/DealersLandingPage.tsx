import { ChevronRight, Users, TrendingUp, DollarSign, Shield, Zap, Star, ArrowRight } from 'lucide-react';

interface DealersLandingPageProps {
  onNavigate: (page: string) => void;
}

const benefits = [
  {
    icon: TrendingUp,
    title: 'Grow Your Revenue',
    desc: 'Earn competitive commissions and recurring revenue from each device activation',
    color: '#00ff88',
  },
  {
    icon: Users,
    title: 'Build Your Network',
    desc: 'Access a growing ecosystem of distributors and end-users across the Philippines',
    color: '#00d4ff',
  },
  {
    icon: Shield,
    title: 'Complete Support',
    desc: 'Marketing materials, training, and dedicated dealer support team',
    color: '#ff0033',
  },
  {
    icon: DollarSign,
    title: 'Easy Payouts',
    desc: 'Automated commission calculation and direct bank transfers',
    color: '#ff00aa',
  },
  {
    icon: Star,
    title: 'Tier Benefits',
    desc: 'Climb tiers and unlock exclusive benefits, higher commissions, and priority support',
    color: '#ffaa00',
  },
  {
    icon: Zap,
    title: 'Real-time Dashboard',
    desc: 'Track sales, commissions, and performance with live analytics dashboard',
    color: '#00ffff',
  },
];

const tiers = [
  { name: 'BRONZE', devices: '1-25', commissions: '15%', color: '#8B4513' },
  { name: 'SILVER', devices: '26-100', commissions: '18%', color: '#a0a0a0' },
  { name: 'GOLD', devices: '100+', commissions: '22%', color: '#ffaa00' },
];

export default function DealersLandingPage({ onNavigate }: DealersLandingPageProps) {
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
                <button key={item.page} onClick={() => onNavigate(item.page)} className={`nav-item ${item.page === 'dealers-page' ? 'active' : ''}`}>
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
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,170,0,0.15) 0%, transparent 70%)',
        }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-neon-gold/40 bg-neon-gold/5 rounded-sm">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="font-orbitron text-yellow-400 text-xs tracking-widest">PARTNER PROGRAM</span>
          </div>

          <h1 className="font-orbitron font-black text-white text-5xl sm:text-6xl mb-4 tracking-tight">
            Become a <span className="text-yellow-400">Dealer Partner</span>
          </h1>
          <p className="text-cyber-text font-rajdhani text-lg max-w-2xl mx-auto mb-8">
            Join the fastest-growing PisoTab ecosystem and earn recurring revenue
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => onNavigate('register')} className="btn-neon-solid px-8 py-3 rounded-sm text-sm flex items-center gap-2">
              APPLY NOW <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => onNavigate('contact')} className="btn-neon-blue px-8 py-3 rounded-sm text-sm">
              LEARN MORE
            </button>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title text-3xl mb-4">Why Become a Dealer?</h2>
            <p className="text-cyber-text font-rajdhani text-lg">Complete support and tools to succeed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="glass-card border border-cyber-border/50 p-6 rounded-sm hover:border-opacity-80 transition-all">
                <div className="w-12 h-12 flex items-center justify-center border rounded-sm mb-4" style={{
                  borderColor: benefit.color + '40', background: benefit.color + '15',
                }}>
                  <benefit.icon className="w-6 h-6" style={{ color: benefit.color }} />
                </div>
                <h3 className="font-orbitron font-bold text-white text-sm tracking-widest mb-2">{benefit.title}</h3>
                <p className="text-cyber-text text-sm font-rajdhani">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIER STRUCTURE */}
      <section className="relative py-24 bg-cyber-navy/50 border-t border-cyber-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title text-3xl mb-4">Dealer Tier Program</h2>
            <p className="text-cyber-text font-rajdhani text-lg">Grow and unlock exclusive benefits</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <div key={i} className="glass-card border rounded-sm p-8" style={{ borderColor: tier.color + '40' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="font-orbitron font-black text-2xl" style={{ color: tier.color }}>
                    {tier.name}
                  </div>
                  <Star className="w-5 h-5" style={{ color: tier.color }} />
                </div>

                <div className="mb-6 pb-6 border-b border-cyber-border/30">
                  <div className="text-cyber-text text-xs font-rajdhani mb-2">Devices Required</div>
                  <div className="font-orbitron font-bold text-white text-xl">{tier.devices}</div>
                  <div className="text-cyber-text text-xs font-rajdhani mt-3">Commission Rate</div>
                  <div className="font-orbitron font-black text-2xl" style={{ color: tier.color }}>{tier.commissions}</div>
                </div>

                <ul className="space-y-2">
                  {[
                    'Priority support',
                    'Marketing materials',
                    'Advanced analytics',
                    'Training programs',
                    'Quarterly bonuses',
                    'Exclusive deals',
                  ].map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-cyber-text text-xs font-rajdhani">
                      <ChevronRight className="w-3 h-3" style={{ color: tier.color }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="section-title text-3xl text-center mb-12">How It Works</h2>

          <div className="space-y-4">
            {[
              { num: '1', title: 'Apply to Join', desc: 'Fill out the application form with your business details' },
              { num: '2', title: 'Get Approved', desc: 'Our team reviews and approves your application' },
              { num: '3', title: 'Training & Setup', desc: 'Receive training and access to dealer dashboard' },
              { num: '4', title: 'Start Selling', desc: 'Activate devices and start earning commissions' },
            ].map((step, i) => (
              <div key={i} className="glass-card border border-cyber-border/50 p-5 rounded-sm flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-neon-blue flex-shrink-0 font-orbitron font-bold text-neon-blue">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-white tracking-wider">{step.title}</h3>
                  <p className="text-cyber-text text-sm font-rajdhani mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-orbitron font-bold text-2xl text-white mb-4">Ready to Join?</h2>
          <p className="text-cyber-text font-rajdhani mb-8">Apply now and start building your PisoTab business</p>
          <button onClick={() => onNavigate('register')} className="btn-neon-solid px-8 py-3 rounded-sm text-sm flex items-center gap-2 mx-auto">
            APPLY AS DEALER <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
