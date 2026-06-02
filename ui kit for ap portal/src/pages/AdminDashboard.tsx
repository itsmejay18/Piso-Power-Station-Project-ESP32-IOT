import { useEffect, useState } from 'react';
import {
  Shield, Users, Key, Monitor, TrendingUp, AlertTriangle,
  CheckCircle, XCircle, Clock, Activity, Database, Server
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import NeonChart from '../components/NeonChart';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

const systemLogs = [
  { type: 'success', msg: 'License BYG-PRO-4521-ABCD activated', time: '2 mins ago' },
  { type: 'warning', msg: 'Device PISOTAB-003 went offline', time: '15 mins ago' },
  { type: 'success', msg: 'New dealer DLR-057 registered', time: '1 hour ago' },
  { type: 'error', msg: 'Failed activation attempt — Invalid key', time: '2 hours ago' },
  { type: 'info', msg: 'System backup completed successfully', time: '4 hours ago' },
  { type: 'success', msg: 'License BYG-ENT-9812-ZXCV renewed', time: '5 hours ago' },
];

const systemHealth = [
  { label: 'API Server', status: 'online', uptime: '99.98%', color: '#00ff88' },
  { label: 'Database', status: 'online', uptime: '99.99%', color: '#00ff88' },
  { label: 'Cloud Sync', status: 'online', uptime: '99.95%', color: '#00ff88' },
  { label: 'IoT Bridge', status: 'degraded', uptime: '98.2%', color: '#ffaa00' },
  { label: 'SMS Service', status: 'online', uptime: '99.87%', color: '#00ff88' },
  { label: 'CDN', status: 'online', uptime: '100%', color: '#00ff88' },
];

const dailyData = [
  { label: '00', value: 120 }, { label: '04', value: 45 }, { label: '08', value: 380 },
  { label: '12', value: 620 }, { label: '16', value: 890 }, { label: '20', value: 540 }, { label: '24', value: 280 },
];

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const liveUsers = 432 + (tick % 7) - 3;

  return (
    <DashboardLayout activePage="admin" onNavigate={onNavigate} isAdmin>
      {/* Admin banner */}
      <div className="flex items-center gap-3 mb-6 px-4 py-3 border border-neon-red/40 bg-neon-red/5 rounded-sm"
        style={{ boxShadow: '0 0 20px rgba(255,0,51,0.08)' }}>
        <Shield className="w-5 h-5 text-neon-red" />
        <div>
          <div className="text-neon-red font-orbitron font-bold text-xs tracking-widest">ADMIN CONTROL CENTER</div>
          <div className="text-cyber-text text-xs font-rajdhani">Full system access — handle with care</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-red animate-pulse" style={{ boxShadow: '0 0 6px #ff0033' }} />
          <span className="text-neon-red text-xs font-orbitron">LIVE</span>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: '3,284', icon: Users, color: '#00d4ff', change: '+284 this month' },
          { label: 'Active Licenses', value: '2,784', icon: Key, color: '#ff0033', change: '+126 this week' },
          { label: 'Online Devices', value: liveUsers.toString(), icon: Monitor, color: '#00ff88', change: 'Real-time' },
          { label: 'System Health', value: '99.8%', icon: Activity, color: '#ffaa00', change: 'All systems OK' },
        ].map((kpi, i) => (
          <div key={i} className="stat-card p-4 rounded-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 flex items-center justify-center border rounded-sm"
                style={{ borderColor: kpi.color + '40', background: kpi.color + '15' }}>
                <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
              {i === 2 && (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" style={{ boxShadow: '0 0 4px #00ff88' }} />
                  <span className="text-neon-green text-xs font-orbitron" style={{ fontSize: '9px' }}>LIVE</span>
                </div>
              )}
            </div>
            <div className="font-orbitron font-black text-2xl mb-0.5" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-white text-xs font-orbitron mb-0.5">{kpi.label}</div>
            <div className="text-cyber-text/60 text-xs font-rajdhani">{kpi.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Daily traffic chart */}
        <div className="lg:col-span-2 glass-card border border-cyber-border/50 p-5 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-orbitron font-bold text-white text-xs tracking-widest">DAILY TRAFFIC</h3>
              <div className="text-cyber-text text-xs font-rajdhani mt-0.5">Today's activation patterns</div>
            </div>
            <div className="text-neon-blue text-xs font-orbitron flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +18% vs yesterday
            </div>
          </div>
          <NeonChart data={dailyData} color="#ff0033" height={100} type="line" />
          <div className="flex justify-between mt-2">
            {dailyData.map((d, i) => (
              <span key={i} className="text-cyber-text/60 font-orbitron" style={{ fontSize: '9px' }}>{d.label}:00</span>
            ))}
          </div>
        </div>

        {/* System health */}
        <div className="glass-card border border-cyber-border/50 p-5 rounded-sm">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-neon-blue" />
            <h3 className="font-orbitron font-bold text-white text-xs tracking-widest">SYSTEM HEALTH</h3>
          </div>
          <div className="space-y-2.5">
            {systemHealth.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                  background: s.color,
                  boxShadow: `0 0 6px ${s.color}`,
                  animation: s.status === 'online' ? 'pulse 2s infinite' : 'none',
                }} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xs font-orbitron" style={{ fontSize: '11px' }}>{s.label}</span>
                    <span className="text-xs font-orbitron" style={{ color: s.color, fontSize: '10px' }}>{s.uptime}</span>
                  </div>
                  <div className="cyber-progress h-1 mt-0.5">
                    <div className="h-full transition-all duration-1000" style={{
                      width: s.uptime.replace('%', '') + '%',
                      background: s.color,
                    }} />
                  </div>
                </div>
                <span className="text-xs font-orbitron capitalize" style={{ color: s.color, fontSize: '9px' }}>
                  {s.status === 'degraded' ? 'WARN' : 'OK'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System logs */}
        <div className="glass-card border border-cyber-border/50 rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-cyber-border/40">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-neon-blue" />
              <h3 className="font-orbitron font-bold text-white text-xs tracking-widest">SYSTEM LOGS</h3>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
              <span className="text-neon-blue text-xs font-orbitron" style={{ fontSize: '9px' }}>LIVE</span>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {systemLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-cyber-border/15">
                {log.type === 'success' && <CheckCircle className="w-3.5 h-3.5 text-neon-green mt-0.5 flex-shrink-0" />}
                {log.type === 'error' && <XCircle className="w-3.5 h-3.5 text-neon-red mt-0.5 flex-shrink-0" />}
                {log.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 mt-0.5 flex-shrink-0" />}
                {log.type === 'info' && <Clock className="w-3.5 h-3.5 text-neon-blue mt-0.5 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-rajdhani truncate">{log.msg}</div>
                  <div className="text-cyber-text/60 text-xs font-orbitron mt-0.5" style={{ fontSize: '9px' }}>{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick admin actions */}
        <div className="glass-card border border-cyber-border/50 rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-cyber-border/40">
            <h3 className="font-orbitron font-bold text-white text-xs tracking-widest">QUICK ACTIONS</h3>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {[
              { label: 'Generate License', action: 'licenses', color: '#00d4ff', icon: Key },
              { label: 'Add Device', action: 'devices', color: '#00ff88', icon: Monitor },
              { label: 'Create Dealer', action: 'dealer', color: '#ffaa00', icon: Users },
              { label: 'View Analytics', action: 'analytics', color: '#ff00aa', icon: Activity },
              { label: 'System Settings', action: 'settings', color: '#ff0033', icon: Shield },
              { label: 'Downloads', action: 'downloads', color: '#00ffff', icon: Database },
            ].map((action, i) => (
              <button key={i} onClick={() => onNavigate(action.action)}
                className="flex flex-col items-center gap-2 p-3 border border-cyber-border/50 rounded-sm hover:border-opacity-80 transition-all duration-300 group"
                style={{ borderColor: action.color + '30' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = action.color + '60'; (e.currentTarget as HTMLButtonElement).style.background = action.color + '08'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = action.color + '30'; (e.currentTarget as HTMLButtonElement).style.background = ''; }}>
                <div className="w-9 h-9 flex items-center justify-center border rounded-sm" style={{
                  borderColor: action.color + '40', background: action.color + '15',
                }}>
                  <action.icon className="w-4 h-4" style={{ color: action.color }} />
                </div>
                <span className="text-xs font-orbitron text-cyber-text group-hover:text-white transition-colors text-center tracking-wide" style={{ fontSize: '10px' }}>
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
