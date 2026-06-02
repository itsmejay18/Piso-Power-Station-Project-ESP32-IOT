import { useState } from 'react';
import { Users, MapPin, TrendingUp, Star, Plus, Search, Phone, Mail, ChevronRight } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

interface DealerPageProps {
  onNavigate: (page: string) => void;
}

const dealers = [
  { id: 'DLR-001', name: 'Metro Manila Distributors', contact: 'Juan dela Cruz', email: 'metro@example.com', phone: '+63 9XX XXX 0001', region: 'Metro Manila', devices: 284, revenue: '₱82,450', status: 'active', tier: 'GOLD', rating: 4.9 },
  { id: 'DLR-002', name: 'Visayas Trading Co.', contact: 'Maria Santos', email: 'visayas@example.com', phone: '+63 9XX XXX 0002', region: 'Cebu City', devices: 156, revenue: '₱45,280', status: 'active', tier: 'SILVER', rating: 4.7 },
  { id: 'DLR-003', name: 'Mindanao TechHub', contact: 'Pedro Reyes', email: 'mndao@example.com', phone: '+63 9XX XXX 0003', region: 'Davao', devices: 212, revenue: '₱61,900', status: 'active', tier: 'GOLD', rating: 4.8 },
  { id: 'DLR-004', name: 'Northern Luzon Network', contact: 'Ana Garcia', email: 'nluzon@example.com', phone: '+63 9XX XXX 0004', region: 'Baguio', devices: 89, revenue: '₱28,600', status: 'pending', tier: 'BRONZE', rating: 4.2 },
  { id: 'DLR-005', name: 'Eastern Archipelago', contact: 'Carlos Rivera', email: 'eastern@example.com', phone: '+63 9XX XXX 0005', region: 'Leyte', devices: 64, revenue: '₱18,200', status: 'active', tier: 'BRONZE', rating: 4.5 },
  { id: 'DLR-006', name: 'WestVis Tech Services', contact: 'Rosa Mendoza', email: 'westvis@example.com', phone: '+63 9XX XXX 0006', region: 'Iloilo', devices: 128, revenue: '₱38,900', status: 'inactive', tier: 'SILVER', rating: 3.8 },
];

const tierColor = (tier: string) => {
  if (tier === 'GOLD') return '#ffaa00';
  if (tier === 'SILVER') return '#a0b0c0';
  return '#8B4513';
};

const statusStyle = (s: string) => {
  if (s === 'active') return 'badge-active';
  if (s === 'inactive') return 'badge-expired';
  return 'badge-pending';
};

export default function DealerPage({ onNavigate }: DealerPageProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof dealers[0] | null>(null);

  const filtered = dealers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.region.toLowerCase().includes(search.toLowerCase()) ||
    d.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout activePage="dealer" onNavigate={onNavigate} isAdmin>
      {/* Summary */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Dealers', value: '56', color: '#00d4ff', icon: Users },
          { label: 'Active Dealers', value: '48', color: '#00ff88', icon: TrendingUp },
          { label: 'Gold Tier', value: '12', color: '#ffaa00', icon: Star },
          { label: 'Total Revenue', value: '₱289K', color: '#ff00aa', icon: TrendingUp },
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

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Dealer list */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyber-text/60" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search dealers..." className="cyber-input pl-8 pr-3 py-2 text-xs rounded-sm w-52" />
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 border border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 transition-all rounded-sm text-xs font-orbitron">
              <Plus className="w-3.5 h-3.5" /> NEW DEALER
            </button>
          </div>

          <div className="space-y-3">
            {filtered.map((dealer, i) => (
              <div key={i}
                onClick={() => setSelected(selected?.id === dealer.id ? null : dealer)}
                className={`glass-card border rounded-sm p-4 cursor-pointer transition-all duration-300 ${
                  selected?.id === dealer.id ? 'border-neon-blue/60' : 'border-cyber-border/50 hover:border-neon-blue/30'
                }`}
                style={selected?.id === dealer.id ? { boxShadow: '0 0 20px rgba(0,212,255,0.1)' } : {}}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {/* Tier badge */}
                  <div className="w-10 h-10 flex items-center justify-center border rounded-sm flex-shrink-0" style={{
                    borderColor: tierColor(dealer.tier) + '60',
                    background: tierColor(dealer.tier) + '15',
                  }}>
                    <Star className="w-5 h-5" style={{ color: tierColor(dealer.tier) }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="font-orbitron font-bold text-white text-sm">{dealer.name}</span>
                      <span className="text-xs font-orbitron px-2 py-0.5 rounded-sm border" style={{
                        color: tierColor(dealer.tier),
                        borderColor: tierColor(dealer.tier) + '50',
                        background: tierColor(dealer.tier) + '15',
                        fontSize: '10px',
                      }}>{dealer.tier}</span>
                    </div>
                    <div className="flex items-center gap-3 text-cyber-text text-xs font-rajdhani">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{dealer.region}</span>
                      <span className="text-neon-blue font-orbitron" style={{ fontSize: '10px' }}>{dealer.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0 flex-wrap">
                    <div className="text-center">
                      <div className="font-orbitron font-bold text-white text-sm">{dealer.devices}</div>
                      <div className="text-cyber-text text-xs font-rajdhani">Devices</div>
                    </div>
                    <div className="text-center">
                      <div className="font-orbitron font-bold text-neon-green text-sm">{dealer.revenue}</div>
                      <div className="text-cyber-text text-xs font-rajdhani">Revenue</div>
                    </div>
                    <span className={statusStyle(dealer.status)}>{dealer.status.toUpperCase()}</span>
                    <ChevronRight className={`w-4 h-4 text-cyber-text transition-transform ${selected?.id === dealer.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded details */}
                {selected?.id === dealer.id && (
                  <div className="mt-4 pt-4 border-t border-cyber-border/30 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-neon-blue text-xs font-orbitron tracking-wider mb-2">CONTACT INFO</div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-cyber-text text-xs font-rajdhani">
                          <Users className="w-3 h-3" /> {dealer.contact}
                        </div>
                        <div className="flex items-center gap-2 text-cyber-text text-xs font-rajdhani">
                          <Mail className="w-3 h-3" /> {dealer.email}
                        </div>
                        <div className="flex items-center gap-2 text-cyber-text text-xs font-rajdhani">
                          <Phone className="w-3 h-3" /> {dealer.phone}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-neon-blue text-xs font-orbitron tracking-wider mb-2">PERFORMANCE</div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className="w-3 h-3" style={{ color: j < Math.floor(dealer.rating) ? '#ffaa00' : '#1a3a5c', fill: j < Math.floor(dealer.rating) ? '#ffaa00' : 'none' }} />
                        ))}
                        <span className="text-cyber-text text-xs ml-1">{dealer.rating}/5.0</span>
                      </div>
                      <div className="cyber-progress h-1.5">
                        <div className="cyber-progress-bar h-full" style={{ width: `${(dealer.devices / 300) * 100}%` }} />
                      </div>
                      <div className="text-cyber-text text-xs mt-1 font-rajdhani">{dealer.devices} / 300 device quota</div>
                    </div>
                    <div className="flex items-end gap-2">
                      <button className="btn-neon-blue px-4 py-2 text-xs rounded-sm flex-1">MANAGE</button>
                      <button className="btn-neon-red px-4 py-2 text-xs rounded-sm">MESSAGE</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
