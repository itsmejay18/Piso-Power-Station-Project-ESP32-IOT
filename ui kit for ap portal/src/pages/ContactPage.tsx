import { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle, Clock, Zap, Facebook, Linkedin, Twitter } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      alert('Message sent! We will contact you soon.');
    }, 1500);
  };

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
                <button key={item.page} onClick={() => onNavigate(item.page)} className={`nav-item ${item.page === 'contact' ? 'active' : ''}`}>
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
            <span className="font-orbitron text-neon-red text-xs tracking-widest">GET IN TOUCH</span>
          </div>

          <h1 className="font-orbitron font-black text-white text-5xl sm:text-6xl mb-4">
            Contact <span className="text-neon-red">BYG-PISOTAB PRO</span>
          </h1>
          <p className="text-cyber-text font-rajdhani text-lg max-w-2xl mx-auto">
            We're here to help. Reach out anytime!
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact form */}
            <div className="glass-card border border-cyber-border/50 p-8 rounded-sm">
              <h2 className="font-orbitron font-bold text-white text-lg tracking-widest mb-6">SEND US A MESSAGE</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neon-blue text-xs font-orbitron tracking-widest mb-2">FULL NAME</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name" className="cyber-input w-full px-3 py-2.5 text-sm rounded-sm" required />
                  </div>
                  <div>
                    <label className="block text-neon-blue text-xs font-orbitron tracking-widest mb-2">EMAIL</label>
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      type="email" placeholder="your@email.com" className="cyber-input w-full px-3 py-2.5 text-sm rounded-sm" required />
                  </div>
                </div>

                <div>
                  <label className="block text-neon-blue text-xs font-orbitron tracking-widest mb-2">PHONE</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    type="tel" placeholder="+63 9XX XXX XXXX" className="cyber-input w-full px-3 py-2.5 text-sm rounded-sm" />
                </div>

                <div>
                  <label className="block text-neon-blue text-xs font-orbitron tracking-widest mb-2">SUBJECT</label>
                  <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="cyber-input w-full px-3 py-2.5 text-sm rounded-sm appearance-none" required>
                    <option value="">Select a subject</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="dealer">Dealer Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neon-blue text-xs font-orbitron tracking-widest mb-2">MESSAGE</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Your message..." className="cyber-input w-full px-3 py-2.5 text-sm rounded-sm h-32 resize-none" required />
                </div>

                <button type="submit" disabled={sending}
                  className="btn-neon-solid w-full py-3 rounded-sm text-sm flex items-center justify-center gap-2">
                  {sending ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> SENDING...</>
                  ) : (
                    <><Send className="w-4 h-4" /> SEND MESSAGE</>
                  )}
                </button>
              </form>
            </div>

            {/* Contact info */}
            <div className="space-y-6">
              {/* Quick contact */}
              <div className="space-y-4">
                <h2 className="font-orbitron font-bold text-white text-lg tracking-widest">QUICK CONTACT</h2>

                {[
                  {
                    icon: Phone,
                    label: 'Phone',
                    value: '+63 (2) XXXX XXXX',
                    color: '#00d4ff',
                  },
                  {
                    icon: Mail,
                    label: 'Email',
                    value: 'support@byg-pisotab.com',
                    color: '#ff0033',
                  },
                  {
                    icon: MapPin,
                    label: 'Address',
                    value: 'Makati, Metro Manila, Philippines',
                    color: '#00ff88',
                  },
                  {
                    icon: Clock,
                    label: 'Hours',
                    value: 'Mon - Fri: 9AM - 6PM (GMT+8)',
                    color: '#00ffff',
                  },
                ].map((contact, i) => (
                  <div key={i} className="glass-card border border-cyber-border/50 p-4 rounded-sm flex items-start gap-4">
                    <div className="w-10 h-10 flex items-center justify-center border rounded-sm flex-shrink-0"
                      style={{ borderColor: contact.color + '40', background: contact.color + '15' }}>
                      <contact.icon className="w-5 h-5" style={{ color: contact.color }} />
                    </div>
                    <div>
                      <div className="font-orbitron font-bold text-white text-xs tracking-widest">{contact.label}</div>
                      <div className="text-cyber-text text-sm font-rajdhani mt-1">{contact.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Support channels */}
              <div>
                <h2 className="font-orbitron font-bold text-white text-lg tracking-widest mb-4">OTHER CHANNELS</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: MessageCircle, label: 'Live Chat', color: '#ff00aa' },
                    { icon: Facebook, label: 'Facebook', color: '#4267B2' },
                    { icon: Linkedin, label: 'LinkedIn', color: '#0077B5' },
                    { icon: Twitter, label: 'Twitter', color: '#1DA1F2' },
                  ].map((channel, i) => (
                    <button key={i} className="glass-card border border-cyber-border/50 p-4 rounded-sm flex items-center gap-2 hover:border-opacity-80 transition-all"
                      style={{ borderColor: channel.color + '30' }}>
                      <channel.icon className="w-4 h-4" style={{ color: channel.color }} />
                      <span className="text-cyber-text text-xs font-orbitron tracking-wider">{channel.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Response time */}
              <div className="glass-card border border-neon-green/30 bg-neon-green/5 p-4 rounded-sm">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-orbitron font-bold text-neon-green text-xs tracking-widest">RESPONSE TIME</div>
                    <div className="text-cyber-text text-sm font-rajdhani mt-1">We typically respond within 2 business hours</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="relative py-24 bg-cyber-navy/50 border-t border-cyber-border/30">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-title text-3xl text-center mb-12">Common Questions</h2>

          <div className="space-y-3">
            {[
              { q: 'What is the response time for sales inquiries?', a: 'Sales inquiries are typically answered within 2-4 hours during business hours.' },
              { q: 'Do you offer phone support?', a: 'Yes, phone support is available for registered users. Email us first to schedule a call.' },
              { q: 'How can I become a dealer?', a: 'Visit our Dealer page and fill out the application form. Our team will review and contact you within 3-5 days.' },
              { q: 'Is there a community forum?', a: 'Yes, join our user community for tips, discussions, and peer support.' },
              { q: 'How do I report a bug?', a: 'Email support@byg-pisotab.com with details and we will investigate immediately.' },
            ].map((faq, i) => (
              <details key={i} className="glass-card border border-cyber-border/50 p-5 rounded-sm group cursor-pointer">
                <summary className="flex items-center justify-between font-orbitron font-bold text-white tracking-wider text-sm">
                  {faq.q}
                  <span className="text-neon-blue transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="text-cyber-text font-rajdhani text-sm mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
