import { Download, Smartphone, Monitor, FileText, Cpu, Star, FileCode, Settings, Zap } from 'lucide-react';

interface DownloadsLandingPageProps {
  onNavigate: (page: string) => void;
}

const downloads = [
  {
    name: 'Android Launcher',
    version: 'v2.4.1',
    desc: 'Latest version for Android devices. Full IoT support and kiosk mode.',
    size: '48.2 MB',
    compatibility: 'Android 8.0+',
    icon: Smartphone,
    color: '#00d4ff',
    rating: 4.9,
    downloads: '12,458',
  },
  {
    name: 'Windows Tool',
    version: 'v1.6.0',
    desc: 'Management tool for Windows. Configure, monitor and manage devices.',
    size: '82.4 MB',
    compatibility: 'Windows 10/11',
    icon: Monitor,
    color: '#00ffff',
    rating: 4.7,
    downloads: '8,231',
  },
  {
    name: 'Documentation',
    version: 'v2.4.1',
    desc: 'User guides and setup instructions. Full API reference included.',
    size: '12.1 MB',
    compatibility: 'All Platforms',
    icon: FileText,
    color: '#ff00aa',
    rating: 4.8,
    downloads: '5,680',
  },
  {
    name: 'Firmware Pack',
    version: 'v3.2.0',
    desc: 'Firmware and IoT files package. For hardware configuration.',
    size: '156.8 MB',
    compatibility: 'IoT Devices',
    icon: Cpu,
    color: '#ff0033',
    rating: 4.6,
    downloads: '3,942',
  },
  {
    name: 'SDK & API',
    version: 'v2.0',
    desc: 'Developer SDK for custom integrations and extensions.',
    size: '28.5 MB',
    compatibility: 'All Platforms',
    icon: FileCode,
    color: '#00ff88',
    rating: 4.8,
    downloads: '2,145',
  },
  {
    name: 'Admin Tools',
    version: 'v1.3.5',
    desc: 'Administrative tools for system management and configuration.',
    size: '35.2 MB',
    compatibility: 'Windows/Mac',
    icon: Settings,
    color: '#ffaa00',
    rating: 4.5,
    downloads: '1,856',
  },
];

export default function DownloadsLandingPage({ onNavigate }: DownloadsLandingPageProps) {
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
                <button key={item.page} onClick={() => onNavigate(item.page)} className={`nav-item ${item.page === 'downloads-page' ? 'active' : ''}`}>
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
          background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.1) 0%, transparent 70%)',
        }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-neon-blue/40 bg-neon-blue/5 rounded-sm">
            <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
            <span className="font-orbitron text-neon-blue text-xs tracking-widest">OFFICIAL RELEASES</span>
          </div>

          <h1 className="font-orbitron font-black text-white text-5xl sm:text-6xl mb-4">
            Download <span className="text-neon-cyan">BYG-PISOTAB PRO</span>
          </h1>
          <p className="text-cyber-text font-rajdhani text-lg max-w-2xl mx-auto">
            Get the latest versions, tools, and documentation
          </p>
        </div>
      </section>

      {/* DOWNLOADS GRID */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((dl, i) => (
              <div key={i} className="glass-card border rounded-sm overflow-hidden group hover:border-opacity-80 transition-all duration-300 flex flex-col"
                style={{ borderColor: dl.color + '30' }}>
                {/* Top bar */}
                <div className="h-1 w-full" style={{ background: dl.color, boxShadow: `0 0 8px ${dl.color}` }} />

                <div className="p-6 flex-1 flex flex-col">
                  {/* Icon */}
                  <div className="w-12 h-12 flex items-center justify-center border rounded-sm mb-4"
                    style={{ borderColor: dl.color + '40', background: dl.color + '15' }}>
                    <dl.icon className="w-6 h-6" style={{ color: dl.color }} />
                  </div>

                  {/* Title */}
                  <h3 className="font-orbitron font-bold text-white text-sm tracking-wide mb-0.5">{dl.name}</h3>
                  <div className="text-xs font-orbitron mb-3" style={{ color: dl.color }}>{dl.version}</div>

                  <p className="text-cyber-text text-xs font-rajdhani leading-relaxed mb-4 flex-1">{dl.desc}</p>

                  {/* Meta */}
                  <div className="space-y-1.5 mb-4 pb-4 border-b border-cyber-border/20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-cyber-text/60 font-rajdhani">Size</span>
                      <span className="text-cyber-text font-orbitron" style={{ fontSize: '10px' }}>{dl.size}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-cyber-text/60 font-rajdhani">Compatible</span>
                      <span className="text-cyber-text font-orbitron" style={{ fontSize: '10px' }}>{dl.compatibility}</span>
                    </div>
                  </div>

                  {/* Rating and downloads */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="w-3 h-3" style={{
                          color: j < Math.floor(dl.rating) ? '#ffaa00' : '#1a3a5c',
                          fill: j < Math.floor(dl.rating) ? '#ffaa00' : 'none',
                        }} />
                      ))}
                      <span className="text-cyber-text text-xs ml-1 font-orbitron" style={{ fontSize: '10px' }}>{dl.rating}</span>
                    </div>
                    <span className="text-cyber-text/60 text-xs font-orbitron" style={{ fontSize: '10px' }}>{dl.downloads} downloads</span>
                  </div>

                  {/* Download button */}
                  <button className="w-full py-2.5 text-xs font-orbitron tracking-wider rounded-sm flex items-center justify-center gap-2 border transition-all duration-300"
                    style={{
                      color: dl.color,
                      borderColor: dl.color + '60',
                      background: dl.color + '10',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = dl.color + '25';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 20px ${dl.color}40`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = dl.color + '10';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
                    }}>
                    <Download className="w-3.5 h-3.5" />
                    DOWNLOAD
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYSTEM REQUIREMENTS */}
      <section className="relative py-24 bg-cyber-navy/50 border-t border-cyber-border/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="section-title text-3xl text-center mb-12">System Requirements</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'For Android Devices',
                reqs: ['Android 8.0 or higher', 'Minimum 2GB RAM', 'Minimum 50MB storage', 'Internet connection (optional)'],
              },
              {
                title: 'For Windows Devices',
                reqs: ['Windows 10/11 (x64)', 'Minimum 4GB RAM', 'Minimum 200MB storage', 'Microsoft .NET Framework 4.8+'],
              },
              {
                title: 'For Firmware',
                reqs: ['Compatible IoT boards', 'USB programming cable', 'Windows/Linux machine', 'Admin privileges'],
              },
              {
                title: 'For Development',
                reqs: ['Node.js 16+', 'Postman or similar tool', 'Code editor (VS Code)', 'API key access'],
              },
            ].map((sec, i) => (
              <div key={i} className="glass-card border border-cyber-border/50 p-6 rounded-sm">
                <h3 className="font-orbitron font-bold text-white text-sm tracking-widest mb-4">{sec.title}</h3>
                <ul className="space-y-2">
                  {sec.reqs.map((req, j) => (
                    <li key={j} className="flex items-start gap-2 text-cyber-text text-xs font-rajdhani">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-blue mt-1.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHANGELOG */}
      <section className="relative py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-title text-3xl text-center mb-12">Latest Release Notes</h2>

          <div className="space-y-6">
            {[
              {
                version: 'v2.4.1',
                date: 'January 15, 2025',
                changes: [
                  'Added offline validation mode for Android',
                  'Improved IoT relay response time by 40%',
                  'Fixed coin slot calibration bug',
                  'Enhanced security with new encryption',
                ],
              },
              {
                version: 'v2.4.0',
                date: 'January 1, 2025',
                changes: [
                  'Complete dashboard redesign',
                  'Multi-device license support',
                  'New analytics engine',
                  'Dealer portal integration',
                ],
              },
              {
                version: 'v2.3.5',
                date: 'December 15, 2024',
                changes: [
                  'Performance improvements across all modules',
                  'Bug fixes and stability enhancements',
                  'Updated UI components',
                  'Improved API response times',
                ],
              },
            ].map((log, i) => (
              <div key={i} className="glass-card border border-cyber-border/50 p-6 rounded-sm">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-cyber-border/20">
                  <div>
                    <div className="font-orbitron font-bold text-neon-blue text-sm">{log.version}</div>
                    <div className="text-cyber-text text-xs font-rajdhani">{log.date}</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {log.changes.map((change, j) => (
                    <li key={j} className="flex items-start gap-2 text-cyber-text text-xs font-rajdhani">
                      <div className="w-1 h-1 rounded-full bg-neon-cyan mt-1.5 flex-shrink-0" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
