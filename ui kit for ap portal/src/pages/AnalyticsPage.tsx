import { TrendingUp, TrendingDown, BarChart2, Users, Monitor, DollarSign } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import NeonChart from '../components/NeonChart';

interface AnalyticsPageProps {
  onNavigate: (page: string) => void;
}

const monthlyData = [
  { label: 'Jan', value: 4200 }, { label: 'Feb', value: 5800 }, { label: 'Mar', value: 5100 },
  { label: 'Apr', value: 7200 }, { label: 'May', value: 6800 }, { label: 'Jun', value: 8900 },
  { label: 'Jul', value: 8200 }, { label: 'Aug', value: 9400 }, { label: 'Sep', value: 8700 },
  { label: 'Oct', value: 10200 }, { label: 'Nov', value: 11800 }, { label: 'Dec', value: 13500 },
];

const deviceData = [
  { label: 'W1', value: 320 }, { label: 'W2', value: 480 }, { label: 'W3', value: 420 },
  { label: 'W4', value: 590 }, { label: 'W5', value: 680 },
];

const revenueData = [
  { label: 'Jan', value: 28000 }, { label: 'Feb', value: 42000 }, { label: 'Mar', value: 38000 },
  { label: 'Apr', value: 55000 }, { label: 'May', value: 48000 }, { label: 'Jun', value: 68000 },
];

const topDevices = [
  { id: 'PISOTAB-004', location: 'Davao - Gaisano', revenue: '₱18,450', activations: 512, pct: 92 },
  { id: 'PISOTAB-001', location: 'Manila - SM Mall', revenue: '₱15,280', activations: 284, pct: 74 },
  { id: 'PISOTAB-002', location: 'Quezon - Ayala', revenue: '₱12,600', activations: 156, pct: 58 },
  { id: 'PISOTAB-005', location: 'Iloilo - SM', revenue: '₱10,920', activations: 203, pct: 49 },
  { id: 'PISOTAB-003', location: 'Cebu - IT Park', revenue: '₱8,350', activations: 98, pct: 32 },
];

export default function AnalyticsPage({ onNavigate }: AnalyticsPageProps) {
  return (
    <DashboardLayout activePage="analytics" onNavigate={onNavigate} isAdmin>
      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Monthly Revenue', value: '₱289,450', change: '+24.8%', up: true, icon: DollarSign, color: '#00ff88' },
          { label: 'Active Devices', value: '1,245', change: '+18.5%', up: true, icon: Monitor, color: '#00d4ff' },
          { label: 'New Users', value: '348', change: '+12.1%', up: true, icon: Users, color: '#ff00aa' },
          { label: 'Avg Daily Sessions', value: '2,840', change: '-2.3%', up: false, icon: BarChart2, color: '#ffaa00' },
        ].map((kpi, i) => (
          <div key={i} className="stat-card p-4 rounded-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 flex items-center justify-center border rounded-sm" style={{ borderColor: kpi.color + '40', background: kpi.color + '15' }}>
                <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-orbitron ${kpi.up ? 'text-neon-green' : 'text-neon-red'}`}>
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change}
              </div>
            </div>
            <div className="font-orbitron font-black text-xl text-white mb-0.5" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-cyber-text text-xs font-rajdhani">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Main charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="glass-card border border-cyber-border/50 p-5 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-orbitron font-bold text-white text-xs tracking-widest">MONTHLY ACTIVATIONS</h3>
              <div className="text-cyber-text text-xs font-rajdhani mt-0.5">Full year overview</div>
            </div>
            <div className="text-neon-blue text-xs font-orbitron">2025</div>
          </div>
          <NeonChart data={monthlyData} color="#00d4ff" height={110} type="bar" />
          <div className="flex justify-between mt-2">
            {monthlyData.map((d, i) => (
              <span key={i} className="text-cyber-text/60 font-orbitron" style={{ fontSize: '9px' }}>{d.label}</span>
            ))}
          </div>
        </div>

        <div className="glass-card border border-cyber-border/50 p-5 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-orbitron font-bold text-white text-xs tracking-widest">REVENUE TREND</h3>
              <div className="text-cyber-text text-xs font-rajdhani mt-0.5">6-month analysis</div>
            </div>
            <div className="flex items-center gap-1 text-neon-green text-xs font-orbitron">
              <TrendingUp className="w-3 h-3" /> +34.2%
            </div>
          </div>
          <NeonChart data={revenueData} color="#00ff88" height={110} type="line" />
          <div className="flex justify-between mt-2">
            {revenueData.map((d, i) => (
              <span key={i} className="text-cyber-text/60 font-orbitron" style={{ fontSize: '9px' }}>{d.label}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Device trend */}
        <div className="glass-card border border-cyber-border/50 p-5 rounded-sm">
          <h3 className="font-orbitron font-bold text-white text-xs tracking-widest mb-4">DEVICE GROWTH</h3>
          <NeonChart data={deviceData} color="#ff00aa" height={80} type="line" />
          <div className="flex justify-between mt-2">
            {deviceData.map((d, i) => (
              <span key={i} className="text-cyber-text/60 font-orbitron" style={{ fontSize: '9px' }}>{d.label}</span>
            ))}
          </div>
        </div>

        {/* License distribution */}
        <div className="glass-card border border-cyber-border/50 p-5 rounded-sm">
          <h3 className="font-orbitron font-bold text-white text-xs tracking-widest mb-4">LICENSE DISTRIBUTION</h3>
          <div className="space-y-3">
            {[
              { type: 'PRO', count: 1248, pct: 45, color: '#00d4ff' },
              { type: 'BUSINESS', count: 835, pct: 30, color: '#ff0033' },
              { type: 'ENTERPRISE', count: 556, pct: 20, color: '#ff00aa' },
              { type: 'TRIAL', count: 145, pct: 5, color: '#ffaa00' },
            ].map((lic, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-orbitron tracking-wider" style={{ color: lic.color }}>{lic.type}</span>
                  <span className="text-cyber-text text-xs font-orbitron">{lic.count} ({lic.pct}%)</span>
                </div>
                <div className="cyber-progress h-2">
                  <div className="h-full rounded-sm transition-all duration-1000"
                    style={{ width: `${lic.pct}%`, background: lic.color, boxShadow: `0 0 6px ${lic.color}` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top performing devices */}
        <div className="glass-card border border-cyber-border/50 p-5 rounded-sm">
          <h3 className="font-orbitron font-bold text-white text-xs tracking-widest mb-4">TOP PERFORMERS</h3>
          <div className="space-y-3">
            {topDevices.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center rounded-sm font-orbitron font-bold text-xs flex-shrink-0"
                  style={{ background: i === 0 ? '#ffaa00' : i === 1 ? '#a0a0a0' : i === 2 ? '#8B4513' : '#1a3a5c', color: '#fff' }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-orbitron truncate">{d.id}</div>
                  <div className="text-cyber-text text-xs font-rajdhani truncate" style={{ fontSize: '10px' }}>{d.location}</div>
                  <div className="cyber-progress h-1 mt-1">
                    <div className="h-full" style={{ width: `${d.pct}%`, background: '#00d4ff' }} />
                  </div>
                </div>
                <div className="text-neon-green text-xs font-orbitron text-right flex-shrink-0" style={{ fontSize: '10px' }}>{d.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
