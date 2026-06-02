import { Download, Smartphone, Monitor, FileText, Cpu, ChevronRight, Star, Shield, Clock } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

interface DownloadsPageProps {
  onNavigate: (page: string) => void;
}

const downloads = [
  {
    name: 'Android Launcher',
    version: 'v2.4.1',
    description: 'Latest version for Android devices. Full IoT support and kiosk mode.',
    date: '2025-01-15',
    size: '48.2 MB',
    compatibility: 'Android 8.0+',
    icon: Smartphone,
    color: '#00d4ff',
    badge: 'LATEST',
    downloads: '12,458',
    rating: 4.9,
  },
  {
    name: 'Windows Tool',
    version: 'v1.6.0',
    description: 'Management tool for Windows. Configure, monitor and manage devices.',
    date: '2025-01-10',
    size: '82.4 MB',
    compatibility: 'Windows 10/11',
    icon: Monitor,
    color: '#00ffff',
    badge: 'STABLE',
    downloads: '8,231',
    rating: 4.7,
  },
  {
    name: 'Documentation',
    version: 'v2.4.1',
    description: 'User guides and setup instructions. Full API reference included.',
    date: '2025-01-20',
    size: '12.1 MB',
    compatibility: 'All Platforms',
    icon: FileText,
    color: '#ff00aa',
    badge: 'UPDATED',
    downloads: '5,680',
    rating: 4.8,
  },
  {
    name: 'Firmware Pack',
    version: 'v3.2.0',
    description: 'Firmware and IoT files package. For hardware configuration.',
    date: '2024-12-28',
    size: '156.8 MB',
    compatibility: 'IoT Devices',
    icon: Cpu,
    color: '#ff0033',
    badge: 'FIRMWARE',
    downloads: '3,942',
    rating: 4.6,
  },
];

const badgeColor = (b: string) => {
  if (b === 'LATEST') return '#00ff88';
  if (b === 'STABLE') return '#00d4ff';
  if (b === 'UPDATED') return '#ff00aa';
  return '#ff0033';
};

export default function DownloadsPage({ onNavigate }: DownloadsPageProps) {
  return (
    <DashboardLayout activePage="downloads" onNavigate={onNavigate} isAdmin>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-orbitron font-bold text-white text-lg tracking-widest">DOWNLOAD CENTER</h1>
          <p className="text-cyber-text text-sm font-rajdhani mt-1">Official BYG-PISOTAB PRO releases and tools</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" style={{ boxShadow: '0 0 8px #00ff88' }} />
          <span className="text-neon-green text-xs font-orbitron">ALL SYSTEMS OPERATIONAL</span>
        </div>
      </div>

      {/* Version notice */}
      <div className="glass-card border border-neon-blue/30 rounded-sm p-4 mb-6 flex items-center gap-4">
        <Shield className="w-5 h-5 text-neon-blue flex-shrink-0" />
        <div>
          <div className="text-white text-sm font-orbitron font-bold">Verified & Secure Downloads</div>
          <div className="text-cyber-text text-xs font-rajdhani mt-0.5">All files are digitally signed and verified by BYG-PISOTAB PRO security team.</div>
        </div>
      </div>

      {/* Download cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {downloads.map((dl, i) => (
          <div key={i} className="glass-card border border-cyber-border/50 rounded-sm overflow-hidden group hover:border-opacity-80 transition-all duration-300 flex flex-col"
            style={{ borderColor: dl.color + '30' }}>
            {/* Top color bar */}
            <div className="h-0.5 w-full" style={{ background: dl.color, boxShadow: `0 0 8px ${dl.color}` }} />

            <div className="p-5 flex-1 flex flex-col">
              {/* Icon + badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 flex items-center justify-center border rounded-sm"
                  style={{ borderColor: dl.color + '40', background: dl.color + '15' }}>
                  <dl.icon className="w-6 h-6" style={{ color: dl.color }} />
                </div>
                <span className="text-xs font-orbitron px-2 py-0.5 rounded-sm border"
                  style={{
                    color: badgeColor(dl.badge),
                    borderColor: badgeColor(dl.badge) + '50',
                    background: badgeColor(dl.badge) + '15',
                    fontSize: '10px',
                    boxShadow: `0 0 8px ${badgeColor(dl.badge)}30`,
                  }}>
                  {dl.badge}
                </span>
              </div>

              {/* Name + version */}
              <h3 className="font-orbitron font-bold text-white text-sm tracking-wide mb-0.5">{dl.name}</h3>
              <div className="text-xs font-orbitron mb-3" style={{ color: dl.color }}>{dl.version}</div>

              <p className="text-cyber-text text-xs font-rajdhani leading-relaxed mb-4 flex-1">{dl.description}</p>

              {/* Meta */}
              <div className="space-y-2 mb-4">
                {[
                  { icon: Clock, label: 'Released', val: dl.date },
                  { icon: Download, label: 'Size', val: dl.size },
                  { icon: Monitor, label: 'For', val: dl.compatibility },
                ].map((m, j) => (
                  <div key={j} className="flex items-center justify-between text-xs">
                    <span className="text-cyber-text/60 font-rajdhani flex items-center gap-1">
                      <m.icon className="w-3 h-3" />{m.label}
                    </span>
                    <span className="text-cyber-text font-orbitron" style={{ fontSize: '10px' }}>{m.val}</span>
                  </div>
                ))}
              </div>

              {/* Rating + downloads */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3 h-3" style={{ color: j < Math.floor(dl.rating) ? '#ffaa00' : '#1a3a5c', fill: j < Math.floor(dl.rating) ? '#ffaa00' : 'none' }} />
                  ))}
                  <span className="text-cyber-text text-xs ml-1 font-orbitron" style={{ fontSize: '10px' }}>{dl.rating}</span>
                </div>
                <span className="text-cyber-text text-xs font-orbitron" style={{ fontSize: '10px' }}>{dl.downloads} DL</span>
              </div>

              {/* Download button */}
              <button className="w-full py-2.5 text-xs font-orbitron tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all duration-300 border"
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

      {/* Changelog */}
      <div className="glass-card border border-cyber-border/50 rounded-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-cyber-border/40">
          <h3 className="font-orbitron font-bold text-white text-xs tracking-widest">CHANGELOG</h3>
          <button className="text-neon-blue text-xs font-orbitron flex items-center gap-1 hover:text-neon-cyan transition-colors">
            VIEW ALL <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {[
            { v: 'v2.4.1', date: '2025-01-15', items: ['Added offline validation mode', 'Improved IoT relay response time', 'Fixed coin slot calibration bug'] },
            { v: 'v2.4.0', date: '2025-01-01', items: ['New dashboard analytics', 'Multi-device license support', 'Enhanced security protocols'] },
            { v: 'v2.3.5', date: '2024-12-15', items: ['Performance improvements', 'Bug fixes and stability', 'Updated UI components'] },
          ].map((log, i) => (
            <div key={i} className="border-l-2 border-neon-blue/30 pl-4 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-orbitron font-bold text-neon-blue text-xs">{log.v}</span>
                <span className="text-cyber-text text-xs font-orbitron">{log.date}</span>
              </div>
              <ul className="space-y-1">
                {log.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-cyber-text text-xs font-rajdhani">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
