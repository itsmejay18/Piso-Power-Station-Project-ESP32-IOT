import { useState } from 'react';
import { Key, Plus, Copy, Trash2, RefreshCw, Filter, Search } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

interface LicensePageProps {
  onNavigate: (page: string) => void;
}

const licenseTypes = ['PRO', 'BUSINESS', 'ENTERPRISE', 'TRIAL'];

const generated = [
  { key: 'BYG-PRO-XXXX-XXXX', type: 'PRO', expiry: '2025-12-31', status: 'active', device: 'PISOTAB-001' },
  { key: 'BYG-BUS-XXXX-XXXX', type: 'BUSINESS', expiry: '2025-10-31', status: 'active', device: 'PISOTAB-002' },
  { key: 'BYG-ENT-XXXX-XXXX', type: 'ENTERPRISE', expiry: '2026-12-31', status: 'active', device: 'PISOTAB-003' },
  { key: 'BYG-TRI-XXXX-XXXX', type: 'TRIAL', expiry: '2025-06-30', status: 'pending', device: 'Unassigned' },
  { key: 'BYG-PRO-YYYY-YYYY', type: 'PRO', expiry: '2025-11-30', status: 'expired', device: 'PISOTAB-004' },
  { key: 'BYG-BUS-ZZZZ-ZZZZ', type: 'BUSINESS', expiry: '2026-03-15', status: 'active', device: 'PISOTAB-005' },
];

function generateKey(type: string) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `BYG-${type.slice(0, 3).toUpperCase()}-${segment()}-${segment()}`;
}

export default function LicensePage({ onNavigate }: LicensePageProps) {
  const [licType, setLicType] = useState('PRO');
  const [expiry, setExpiry] = useState('2025-12-31');
  const [deviceLimit, setDeviceLimit] = useState('1');
  const [dealer, setDealer] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedKey(generateKey(licType));
      setGenerating(false);
    }, 1000);
  };

  const handleCopy = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filtered = generated.filter(l =>
    l.key.toLowerCase().includes(search.toLowerCase()) ||
    l.type.toLowerCase().includes(search.toLowerCase()) ||
    l.device.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) => {
    if (s === 'active') return '#00ff88';
    if (s === 'expired') return '#ff0033';
    return '#ffaa00';
  };

  const typeColor = (t: string) => {
    if (t === 'PRO') return '#00d4ff';
    if (t === 'BUSINESS') return '#ff0033';
    if (t === 'ENTERPRISE') return '#ff00aa';
    return '#ffaa00';
  };

  return (
    <DashboardLayout activePage="licenses" onNavigate={onNavigate} isAdmin>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Generator panel */}
        <div className="xl:col-span-1">
          <div className="glass-card border border-neon-blue/40 rounded-sm overflow-hidden"
            style={{ boxShadow: '0 0 30px rgba(0,212,255,0.08)' }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-cyber-border/40"
              style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.08), transparent)' }}>
              <Key className="w-5 h-5 text-neon-blue" />
              <h2 className="font-orbitron font-bold text-white text-xs tracking-widest">GENERATE NEW LICENSE</h2>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-neon-blue text-xs font-orbitron tracking-widest mb-2">LICENSE TYPE</label>
                <select value={licType} onChange={e => setLicType(e.target.value)}
                  className="cyber-input w-full px-3 py-2.5 text-sm rounded-sm appearance-none">
                  {licenseTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-neon-blue text-xs font-orbitron tracking-widest mb-2">EXPIRATION DATE</label>
                <input type="date" value={expiry} onChange={e => setExpiry(e.target.value)}
                  className="cyber-input w-full px-3 py-2.5 text-sm rounded-sm" />
              </div>

              <div>
                <label className="block text-neon-blue text-xs font-orbitron tracking-widest mb-2">DEVICE LIMIT</label>
                <input type="number" value={deviceLimit} onChange={e => setDeviceLimit(e.target.value)}
                  min="1" max="100"
                  className="cyber-input w-full px-3 py-2.5 text-sm rounded-sm" />
              </div>

              <div>
                <label className="block text-neon-blue text-xs font-orbitron tracking-widest mb-2">DEALER (OPTIONAL)</label>
                <select value={dealer} onChange={e => setDealer(e.target.value)}
                  className="cyber-input w-full px-3 py-2.5 text-sm rounded-sm appearance-none">
                  <option value="">Select Dealer</option>
                  <option value="d1">Dealer A — Metro Manila</option>
                  <option value="d2">Dealer B — Cebu</option>
                  <option value="d3">Dealer C — Davao</option>
                </select>
              </div>

              <button onClick={handleGenerate} disabled={generating}
                className="btn-neon-solid w-full py-3 rounded-sm text-xs flex items-center justify-center gap-2">
                {generating ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> GENERATING...</>
                ) : (
                  <><Plus className="w-4 h-4" /> GENERATE LICENSE</>
                )}
              </button>

              {/* Generated key display */}
              {generatedKey && (
                <div className="relative rounded-sm p-4 border border-neon-green/40 bg-neon-green/5"
                  style={{ boxShadow: '0 0 20px rgba(0,255,136,0.1)' }}>
                  <div className="text-neon-green text-xs font-orbitron tracking-widest mb-2">GENERATED KEY</div>
                  <div className="font-orbitron font-bold text-white text-sm mb-3 break-all"
                    style={{ textShadow: '0 0 10px rgba(0,255,136,0.5)' }}>
                    {generatedKey}
                  </div>
                  <button onClick={handleCopy}
                    className="flex items-center gap-2 text-xs font-orbitron tracking-wider transition-colors"
                    style={{ color: copied ? '#00ff88' : '#00d4ff' }}>
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'COPIED!' : 'COPY KEY'}
                  </button>
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-neon-green/60" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-neon-green/60" />
                </div>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: 'Total Keys', value: '2,784', color: '#00d4ff' },
              { label: 'Active', value: '2,698', color: '#00ff88' },
              { label: 'Expired', value: '86', color: '#ff0033' },
              { label: 'Pending', value: '42', color: '#ffaa00' },
            ].map((s, i) => (
              <div key={i} className="glass-card border border-cyber-border/40 p-3 rounded-sm text-center">
                <div className="font-orbitron font-bold text-lg text-white" style={{ color: s.color }}>{s.value}</div>
                <div className="text-cyber-text text-xs font-rajdhani mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* License table */}
        <div className="xl:col-span-2">
          <div className="glass-card border border-cyber-border/50 rounded-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-cyber-border/40"
              style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.05), transparent)' }}>
              <h2 className="font-orbitron font-bold text-white text-xs tracking-widest">GENERATED LICENSES</h2>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyber-text/60" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search keys..." className="cyber-input pl-8 pr-3 py-2 text-xs rounded-sm w-full sm:w-44" />
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 border border-cyber-border/50 text-cyber-text hover:border-neon-blue hover:text-neon-blue transition-all rounded-sm text-xs font-orbitron">
                  <Filter className="w-3.5 h-3.5" /> FILTER
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full cyber-table">
                <thead>
                  <tr>
                    <th className="text-left">LICENSE KEY</th>
                    <th className="text-left">TYPE</th>
                    <th className="text-left hidden md:table-cell">EXPIRATION</th>
                    <th className="text-left">STATUS</th>
                    <th className="text-left hidden lg:table-cell">DEVICE</th>
                    <th className="text-left">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lic, i) => (
                    <tr key={i}>
                      <td>
                        <span className="font-orbitron text-white text-xs" style={{ fontSize: '11px' }}>{lic.key}</span>
                      </td>
                      <td>
                        <span className="text-xs font-orbitron px-2 py-0.5 rounded-sm border"
                          style={{
                            color: typeColor(lic.type),
                            borderColor: typeColor(lic.type) + '50',
                            background: typeColor(lic.type) + '15',
                            fontSize: '10px',
                          }}>
                          {lic.type}
                        </span>
                      </td>
                      <td className="hidden md:table-cell">
                        <span className="text-cyber-text font-orbitron" style={{ fontSize: '11px' }}>{lic.expiry}</span>
                      </td>
                      <td>
                        <span className={`${lic.status === 'active' ? 'badge-active' : lic.status === 'expired' ? 'badge-expired' : 'badge-pending'}`}>
                          {lic.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell">
                        <span className="text-cyber-text text-xs">{lic.device}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button className="w-6 h-6 flex items-center justify-center text-cyber-text hover:text-neon-blue transition-colors">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button className="w-6 h-6 flex items-center justify-center text-cyber-text hover:text-neon-red transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 border-t border-cyber-border/30 flex items-center justify-between">
              <span className="text-cyber-text text-xs font-rajdhani">Showing {filtered.length} of {generated.length} licenses</span>
              <div className="flex items-center gap-2">
                {['<', '1', '2', '3', '>'].map((p, i) => (
                  <button key={i} className={`w-7 h-7 text-xs font-orbitron flex items-center justify-center border transition-all ${
                    p === '1' ? 'border-neon-blue text-neon-blue bg-neon-blue/10' : 'border-cyber-border text-cyber-text hover:border-neon-blue hover:text-neon-blue'
                  }`}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
