import { useState } from 'react';
import { Monitor, Wifi, WifiOff, Search, Plus, RefreshCw, MapPin, Battery, Activity } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

interface DevicesPageProps {
  onNavigate: (page: string) => void;
}

const devices = [
  { id: 'PISOTAB-001', name: 'Unit Alpha', location: 'Manila - SM Mall', status: 'online', license: 'PRO', battery: 94, uptime: '12d 4h', activations: 284, lastSeen: 'Just now' },
  { id: 'PISOTAB-002', name: 'Unit Beta', location: 'Quezon - Ayala', status: 'online', license: 'BUSINESS', battery: 78, uptime: '8d 2h', activations: 156, lastSeen: '2m ago' },
  { id: 'PISOTAB-003', name: 'Unit Gamma', location: 'Cebu - IT Park', status: 'offline', license: 'PRO', battery: 45, uptime: '0d 0h', activations: 98, lastSeen: '3h ago' },
  { id: 'PISOTAB-004', name: 'Unit Delta', location: 'Davao - Gaisano', status: 'online', license: 'ENTERPRISE', battery: 100, uptime: '21d 8h', activations: 512, lastSeen: 'Just now' },
  { id: 'PISOTAB-005', name: 'Unit Epsilon', location: 'Iloilo - SM', status: 'online', license: 'PRO', battery: 88, uptime: '5d 11h', activations: 203, lastSeen: '5m ago' },
  { id: 'PISOTAB-006', name: 'Unit Zeta', location: 'Baguio - Session', status: 'offline', license: 'TRIAL', battery: 12, uptime: '0d 0h', activations: 44, lastSeen: '1d ago' },
];

export default function DevicesPage({ onNavigate }: DevicesPageProps) {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [filter, setFilter] = useState('all');

  const filtered = devices.filter(d => {
    const matchSearch = d.id.toLowerCase().includes(search.toLowerCase()) || d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || d.status === filter;
    return matchSearch && matchFilter;
  });

  const online = devices.filter(d => d.status === 'online').length;
  const offline = devices.filter(d => d.status === 'offline').length;

  return (
    <DashboardLayout activePage="devices" onNavigate={onNavigate} isAdmin>
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Devices', value: devices.length, color: '#00d4ff', icon: Monitor },
          { label: 'Online', value: online, color: '#00ff88', icon: Wifi },
          { label: 'Offline', value: offline, color: '#ff0033', icon: WifiOff },
          { label: 'Alerts', value: 3, color: '#ffaa00', icon: Activity },
        ].map((s, i) => (
          <div key={i} className="stat-card p-4 rounded-sm flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center border rounded-sm" style={{ borderColor: s.color + '40', background: s.color + '15' }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <div className="font-orbitron font-bold text-xl text-white">{s.value}</div>
              <div className="text-cyber-text text-xs font-rajdhani">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'online', 'offline'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-orbitron tracking-wider rounded-sm border transition-all ${
                filter === f
                  ? 'border-neon-blue text-neon-blue bg-neon-blue/10'
                  : 'border-cyber-border text-cyber-text hover:border-neon-blue hover:text-neon-blue'
              }`}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyber-text/60" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search devices..." className="cyber-input pl-8 pr-3 py-2 text-xs rounded-sm w-full sm:w-52" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 transition-all rounded-sm text-xs font-orbitron">
            <Plus className="w-3.5 h-3.5" /> ADD
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-cyber-border text-cyber-text hover:border-neon-blue hover:text-neon-blue transition-all rounded-sm">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <div className="flex border border-cyber-border rounded-sm overflow-hidden">
            {(['grid', 'table'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-2.5 py-1.5 text-xs transition-all ${view === v ? 'bg-neon-blue/20 text-neon-blue' : 'text-cyber-text hover:text-neon-blue'}`}>
                {v === 'grid' ? '▦' : '☰'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid view */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((device, i) => (
            <div key={i} className="glass-card border rounded-sm p-5 relative overflow-hidden group transition-all duration-300 cursor-pointer"
              style={{
                borderColor: device.status === 'online' ? 'rgba(0,255,136,0.3)' : 'rgba(255,0,51,0.3)',
                boxShadow: device.status === 'online' ? '0 0 10px rgba(0,255,136,0.05)' : '0 0 10px rgba(255,0,51,0.05)',
              }}>
              {/* Status indicator */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{
                    background: device.status === 'online' ? '#00ff88' : '#ff0033',
                    boxShadow: `0 0 8px ${device.status === 'online' ? '#00ff88' : '#ff0033'}`,
                    animation: device.status === 'online' ? 'pulse 2s infinite' : 'none',
                  }} />
                  <span className="font-orbitron text-xs" style={{ color: device.status === 'online' ? '#00ff88' : '#ff0033', fontSize: '10px' }}>
                    {device.status.toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-orbitron px-2 py-0.5 border rounded-sm"
                  style={{ color: '#00d4ff', borderColor: 'rgba(0,212,255,0.4)', background: 'rgba(0,212,255,0.1)', fontSize: '10px' }}>
                  {device.license}
                </span>
              </div>

              <div className="mb-3">
                <div className="font-orbitron font-bold text-white text-sm mb-0.5">{device.name}</div>
                <div className="text-neon-blue text-xs font-orbitron">{device.id}</div>
              </div>

              <div className="flex items-center gap-1.5 text-cyber-text text-xs font-rajdhani mb-4">
                <MapPin className="w-3 h-3" /> {device.location}
              </div>

              {/* Battery */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-cyber-text text-xs font-rajdhani flex items-center gap-1"><Battery className="w-3 h-3" /> Battery</span>
                  <span className="text-xs font-orbitron" style={{ color: device.battery > 50 ? '#00ff88' : device.battery > 20 ? '#ffaa00' : '#ff0033' }}>
                    {device.battery}%
                  </span>
                </div>
                <div className="cyber-progress h-1.5">
                  <div className="cyber-progress-bar h-full" style={{
                    width: `${device.battery}%`,
                    background: device.battery > 50 ? '#00ff88' : device.battery > 20 ? '#ffaa00' : '#ff0033',
                  }} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-cyber-border/30">
                {[
                  { label: 'Uptime', val: device.uptime },
                  { label: 'Activations', val: device.activations },
                  { label: 'Last Seen', val: device.lastSeen },
                ].map((m, j) => (
                  <div key={j}>
                    <div className="text-white text-xs font-orbitron" style={{ fontSize: '11px' }}>{m.val}</div>
                    <div className="text-cyber-text/60 text-xs font-rajdhani mt-0.5" style={{ fontSize: '10px' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table view */}
      {view === 'table' && (
        <div className="glass-card border border-cyber-border/50 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full cyber-table">
              <thead>
                <tr>
                  <th className="text-left">DEVICE ID</th>
                  <th className="text-left">NAME</th>
                  <th className="text-left hidden md:table-cell">LOCATION</th>
                  <th className="text-left">STATUS</th>
                  <th className="text-left hidden lg:table-cell">LICENSE</th>
                  <th className="text-left hidden lg:table-cell">ACTIVATIONS</th>
                  <th className="text-left">LAST SEEN</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={i}>
                    <td><span className="font-orbitron text-neon-blue text-xs">{d.id}</span></td>
                    <td><span className="text-white text-xs font-orbitron">{d.name}</span></td>
                    <td className="hidden md:table-cell"><span className="text-cyber-text text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{d.location}</span></td>
                    <td>
                      <span className={d.status === 'online' ? 'badge-active' : 'badge-expired'}>
                        {d.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell"><span className="text-neon-cyan text-xs font-orbitron">{d.license}</span></td>
                    <td className="hidden lg:table-cell"><span className="text-white text-xs font-orbitron">{d.activations}</span></td>
                    <td><span className="text-cyber-text text-xs">{d.lastSeen}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
