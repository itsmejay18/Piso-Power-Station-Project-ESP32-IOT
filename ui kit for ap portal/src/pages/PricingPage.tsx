import { Check, ChevronRight, Zap, Users } from 'lucide-react';

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

const plans = [
  {
    name: 'Starter',
    price: '₱2,999',
    period: '/month',
    desc: 'Perfect for single device operators',
    devices: 1,
    features: [
      'Smart Launcher',
      'Basic License Management',
      '1 Device',
      'Email Support',
      'Monthly Reports',
      'Basic Analytics',
    ],
    color: '#00d4ff',
    cta: 'Start Free Trial',
  },
  {
    name: 'Professional',
    price: '₱7,999',
    period: '/month',
    desc: 'For growing businesses',
    devices: 10,
    features: [
      'Smart Launcher',
      'Cloud Licensing',
      'Up to 10 Devices',
      'Priority Support',
      'Advanced Analytics',
      'Remote Management',
      'Device Groups',
      'API Access',
    ],
    color: '#ff00aa',
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    desc: 'For large operations',
    devices: 100,
    features: [
      'All Professional Features',
      'Unlimited Devices',
      'Dedicated Support',
      'Custom Integrations',
      'White-label Option',
      'SLA Guarantee',
      'Training & Onboarding',
      'Disaster Recovery',
    ],
    color: '#00ff88',
    cta: 'Contact Sales',
  },
];

export default function PricingPage({ onNavigate }: PricingPageProps) {
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
                <button key={item.page} onClick={() => onNavigate(item.page)} className={`nav-item ${item.page === 'pricing' ? 'active' : ''}`}>
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
      <section className="relative min-h-80 flex items-center justify-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(255,0,51,0.1) 0%, transparent 70%)',
        }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-neon-red/40 bg-neon-red/5 rounded-sm">
            <div className="w-2 h-2 rounded-full bg-neon-red animate-pulse" />
            <span className="font-orbitron text-neon-red text-xs tracking-widest">SIMPLE & TRANSPARENT</span>
          </div>

          <h1 className="font-orbitron font-black text-white text-5xl sm:text-6xl mb-4">
            Plans for <span className="text-neon-red">Every Business</span>
          </h1>
          <p className="text-cyber-text font-rajdhani text-lg max-w-2xl mx-auto">
            Choose the perfect plan and scale as you grow
          </p>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div key={i} className={`relative rounded-sm overflow-hidden transition-all duration-300 ${
                plan.popular ? 'md:scale-105 md:z-10' : ''
              }`}>
                {/* Border glow */}
                {plan.popular && (
                  <div className="absolute inset-0 rounded-sm p-0.5" style={{
                    background: `linear-gradient(135deg, ${plan.color}, #ff0033)`,
                    zIndex: -1,
                  }} />
                )}

                <div className={`${plan.popular ? 'bg-cyber-card' : 'glass-card'} border rounded-sm p-8 h-full flex flex-col`}
                  style={{ borderColor: plan.color + '40' }}>
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-neon-red text-white text-xs font-orbitron rounded-sm"
                      style={{ boxShadow: '0 0 12px #ff0033' }}>
                      MOST POPULAR
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-orbitron font-bold text-white text-lg tracking-widest mb-2">{plan.name}</h3>
                    <p className="text-cyber-text text-xs font-rajdhani">{plan.desc}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="font-orbitron font-black text-3xl text-white" style={{ color: plan.color }}>
                        {plan.price}
                      </span>
                      <span className="text-cyber-text text-xs font-rajdhani">{plan.period}</span>
                    </div>
                    <div className="text-cyber-text text-xs font-rajdhani">
                      {plan.devices === 100 ? 'Unlimited devices' : `Up to ${plan.devices} device${plan.devices > 1 ? 's' : ''}`}
                    </div>
                  </div>

                  <button className={`w-full py-2.5 rounded-sm text-xs font-orbitron tracking-widest mb-8 transition-all duration-300 ${
                    plan.popular ? 'btn-neon-solid' : 'btn-neon-blue'
                  }`}>
                    {plan.cta}
                  </button>

                  <div className="space-y-3 flex-1">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                        <span className="text-cyber-text text-xs font-rajdhani">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-24 bg-cyber-navy/50 border-t border-cyber-border/30">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-title text-3xl text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                q: 'Can I change plans anytime?',
                a: 'Yes, upgrade or downgrade your plan anytime. Changes take effect on your next billing cycle.',
              },
              {
                q: 'Do you offer discounts for annual billing?',
                a: 'Yes, save 20% with annual billing. Contact our sales team for custom volume discounts.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept credit cards, bank transfers, and digital payment platforms like GCash and PayMaya.',
              },
              {
                q: 'Is there a free trial available?',
                a: 'Yes, all plans include a 14-day free trial with full access to all features.',
              },
              {
                q: 'What about customer support?',
                a: 'Starter plans get email support, Professional plans get priority support, and Enterprise plans get dedicated support.',
              },
            ].map((faq, i) => (
              <details key={i} className="glass-card border border-cyber-border/50 p-5 rounded-sm group cursor-pointer">
                <summary className="flex items-center justify-between font-orbitron font-bold text-white tracking-wider text-sm">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                </summary>
                <p className="text-cyber-text font-rajdhani text-sm mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-orbitron font-bold text-2xl text-white mb-4">Still have questions?</h2>
          <p className="text-cyber-text font-rajdhani mb-8">Our sales team is ready to help you find the perfect plan</p>
          <button onClick={() => onNavigate('contact')} className="btn-neon-solid px-8 py-3 rounded-sm text-sm">
            CONTACT SALES
          </button>
        </div>
      </section>
    </div>
  );
}
