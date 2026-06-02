import { useEffect, useState } from 'react';
import { Monitor, Key, Zap, Wifi, TrendingUp, TrendingDown, AlertTriangle, Users, DollarSign, Activity } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import NeonChart from '../components/NeonChart';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

const activityData = [
  { label: 'Mon', value: 420 }, { label: 'Tue', value: 680 }, { label: 'Wed', value: 530 },
  { label: 'Thu', value: 790 }, { label: 'Fri', value: 650 }, { label: 'Sat', value: 920 },
  { label: 'Sun', value: 750 },
];

const weeklyData = [
  { label: 'W1', value: 2100 }, { label: 'W2', value: 3400 }, { label: 'W3', value: 2800 },
  { label: 'W4', value: 4200 }, { label: 'W5', value: 3600 },
];

const recentActivations = [
  { id: 'PISOTAB-001', type: 'PRO', time: '2 mins ago', status: 'active' },
  { id: 'PISOTAB-002', type: 'BUSINESS', time: '10 mins ago', status: 'active' },
  { id: 'PISOTAB-003', type: 'PRO', time: '1 hour ago', status: 'active' },
  { id: 'PISOTAB-004', type: 'TRIAL', time: '2 hours ago', status: 'expired' },
  { id: 'PISOTAB-005', type: 'ENTERPRISE', time: '3 hours ago', status: 'active' },
];

const statCards = [
  { label: 'Total Devices', value: '1,245', change: '+18.5%', up: true, icon: Monitor, color: '#00d4ff', sub: 'Active' },
  { label: 'Active Licenses', value: '2,784', change: '+12.2%', up: true, icon: Key, color: '#ff0033', sub: 'Valid' },
  { label: 'Total Activations', value: '8,652', change: '+22.7%', up: true, icon: Zap, color: '#00ffff', sub: 'All time' },
  { label: 'Online Now', value: '432', change: '+9.3%', up: true, icon: Wifi, color: '#00ff88', sub: 'Live' },
];

const lowerStats = [
  { label: 'Expiring Licenses', value: '86', color: '#ffaa00', action: 'View All', icon: AlertTriangle },
  { label: 'Inactive Devices', value: '22', color: '#ff0033', action: 'View All', icon: Monitor },
  { label: 'Total Dealers', value: '56', color: '#00d4ff', action: 'View All', icon: Users },
  { label: 'Total Revenue', value: '₱289,450', color: '#00ff88', action: 'View All', icon: DollarSign },
];

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [animValues, setAnimValues] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const targets = [1245, 2784, 8652, 432];
    const duration = 1500;
    const steps = 60;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimValues(targets.map(t => Math.floor(t * eased)));
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout activePage="dashboard" onNavigate={onNavigate} isAdmin>
      {/* Top stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <div key={i} className="stat-card p-4 rounded-sm relative overflow-hidden group cursor-pointer" onClick={() => onNavigate(i === 0 ? 'devices' : i === 1 ? 'licenses' : 'analytics')}>
            {/* BG glow */}
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none opacity-10 transition-opacity group-hover:opacity-20"
              style={{ background: `radial-gradient(circle, ${card.color}, transparent)`, transform: 'translate(30%, -30%)' }} />

            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 flex items-center justify-center border rounded-sm" style={{
                borderColor: card.color + '40', background: card.color + '15',
              }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-orbitron ${card.up ? 'text-neon-green' : 'text-neon-red'}`}>
                {card.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {card.change}
              </div>
            </div>

            <div className="font-orbitron font-black text-2xl text-white mb-0.5" style={{ textShadow: `0 0 15px ${card.color}40` }}>
              {i < 4 ? animValues[i].toLocaleString() : card.value}
            </div>
            <div className="text-cyber-text text-xs font-rajdhani tracking-wider">{card.label}</div>
            <div className="text-xs mt-1 font-orbitron" style={{ color: card.color + 'aa', fontSize: '10px' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Device Activity chart */}
        <div className="lg:col-span-2 glass-card border border-cyber-border/50 p-5 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-orbitron font-bold text-white text-xs tracking-widest">DEVICE ACTIVITY</h3>
              <div className="text-cyber-text text-xs mt-0.5 font-rajdhani">This Week</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1 rounded" style={{ background: '#00d4ff' }} />
                <span className="text-cyber-text text-xs font-rajdhani">Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1 rounded" style={{ background: '#ff0033' }} />
                <span className="text-cyber-text text-xs font-rajdhani">Inactive</span>
              </div>
            </div>
          </div>
          <NeonChart data={activityData} color="#00d4ff" height={100} type="line" />
          <div className="flex justify-between mt-2">
            {activityData.map((d, i) => (
              <span key={i} className="text-cyber-text/60 text-xs font-orbitron" style={{ fontSize: '10px' }}>{d.label}</span>
            ))}
          </div>
        </div>

        {/* Recent Activations */}
        <div className="glass-card border border-cyber-border/50 p-5 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-orbitron font-bold text-white text-xs tracking-widest">RECENT ACTIVATIONS</h3>
            <Activity className="w-4 h-4 text-neon-blue animate-pulse" />
          </div>
          <div className="space-y-3">
            {recentActivations.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-cyber-border/20">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                  background: a.status === 'active' ? '#00ff88' : '#ff0033',
                  boxShadow: `0 0 6px ${a.status === 'active' ? '#00ff88' : '#ff0033'}`,
                }} />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-orbitron truncate">{a.id}</div>
                  <div className="text-cyber-text text-xs font-rajdhani">{a.time}</div>
                </div>
                <span className={`text-xs font-orbitron px-2 py-0.5 rounded-sm ${a.status === 'active' ? 'badge-active' : 'badge-expired'}`}
                  style={{ fontSize: '9px' }}>
                  {a.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {lowerStats.map((s, i) => (
          <div key={i} className="glass-card border border-cyber-border/50 p-4 rounded-sm flex items-center gap-4 group hover:border-opacity-80 transition-all cursor-pointer"
            style={{ borderColor: s.color + '30' }}>
            <div className="w-10 h-10 flex items-center justify-center border rounded-sm flex-shrink-0" style={{
              borderColor: s.color + '40', background: s.color + '15',
            }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-orbitron font-black text-xl text-white">{s.value}</div>
              <div className="text-cyber-text text-xs font-rajdhani truncate">{s.label}</div>
            </div>
            <button className="text-xs font-orbitron tracking-wider opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: s.color, fontSize: '9px' }}>
              {s.action}
            </button>
          </div>
        ))}
      </div>

      {/* Weekly revenue bar chart */}
      <div className="glass-card border border-cyber-border/50 p-5 rounded-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-orbitron font-bold text-white text-xs tracking-widest">WEEKLY REVENUE</h3>
          <div className="text-neon-green text-xs font-orbitron flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% THIS MONTH
          </div>
        </div>
        <NeonChart data={weeklyData} color="#00ff88" height={80} type="bar" />
        <div className="flex justify-between mt-2">
          {weeklyData.map((d, i) => (
            <span key={i} className="text-cyber-text/60 text-xs font-orbitron" style={{ fontSize: '10px' }}>{d.label}</span>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
