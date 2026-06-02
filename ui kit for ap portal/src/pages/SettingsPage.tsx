import { useState } from 'react';
import { Settings, User, Shield, Bell, Database, Globe, Key, Save, Eye, EyeOff } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'system', label: 'System', icon: Settings },
  { id: 'api', label: 'API Keys', icon: Key },
];

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({
    device: true, license: true, dealer: false, system: true, email: true, sms: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout activePage="settings" onNavigate={onNavigate} isAdmin>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab sidebar */}
        <div className="lg:w-52 flex-shrink-0">
          <div className="glass-card border border-cyber-border/50 rounded-sm overflow-hidden">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-orbitron tracking-wider transition-all border-l-2 ${
                  activeTab === tab.id
                    ? 'text-neon-blue bg-neon-blue/10 border-neon-blue'
                    : 'text-cyber-text hover:text-neon-blue hover:bg-neon-blue/5 border-transparent'
                }`}>
                <tab.icon className="w-4 h-4" />
                {tab.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="glass-card border border-cyber-border/50 rounded-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-cyber-border/40 flex items-center gap-3">
                <User className="w-4 h-4 text-neon-blue" />
                <h2 className="font-orbitron font-bold text-white text-xs tracking-widest">PROFILE SETTINGS</h2>
              </div>
              <div className="p-6 space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-5 pb-5 border-b border-cyber-border/30">
                  <div className="w-16 h-16 rounded-full border-2 border-neon-blue flex items-center justify-center text-xl font-orbitron font-bold text-neon-blue"
                    style={{ background: 'rgba(0,212,255,0.1)', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
                    AD
                  </div>
                  <div>
                    <div className="text-white font-orbitron font-bold text-sm">Admin User</div>
                    <div className="text-neon-blue text-xs font-rajdhani mt-0.5">Super Administrator</div>
                    <button className="mt-2 text-xs font-orbitron text-cyber-text hover:text-neon-blue transition-colors">CHANGE AVATAR</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'FULL NAME', val: 'Admin User', type: 'text' },
                    { label: 'USERNAME', val: 'admin_byg', type: 'text' },
                    { label: 'EMAIL ADDRESS', val: 'admin@byg-pisotab.com', type: 'email' },
                    { label: 'PHONE', val: '+63 9XX XXX 0000', type: 'tel' },
                  ].map((field, i) => (
                    <div key={i}>
                      <label className="block text-neon-blue text-xs font-orbitron tracking-widest mb-2">{field.label}</label>
                      <input type={field.type} defaultValue={field.val} className="cyber-input w-full px-3 py-2.5 text-sm rounded-sm" />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-neon-blue text-xs font-orbitron tracking-widest mb-2">BUSINESS NAME</label>
                  <input type="text" defaultValue="BYG Solutions Inc." className="cyber-input w-full px-3 py-2.5 text-sm rounded-sm" />
                </div>
                <div>
                  <label className="block text-neon-blue text-xs font-orbitron tracking-widest mb-2">TIMEZONE</label>
                  <select className="cyber-input w-full px-3 py-2.5 text-sm rounded-sm appearance-none">
                    <option>Asia/Manila (GMT+8)</option>
                    <option>UTC</option>
                  </select>
                </div>

                <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-2.5 text-xs font-orbitron rounded-sm transition-all ${
                  saved ? 'bg-neon-green/20 border border-neon-green text-neon-green' : 'btn-neon-solid'
                }`}>
                  <Save className="w-3.5 h-3.5" />
                  {saved ? 'SAVED!' : 'SAVE CHANGES'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="glass-card border border-cyber-border/50 rounded-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-cyber-border/40 flex items-center gap-3">
                  <Shield className="w-4 h-4 text-neon-red" />
                  <h2 className="font-orbitron font-bold text-white text-xs tracking-widest">CHANGE PASSWORD</h2>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { label: 'CURRENT PASSWORD', ph: '••••••••' },
                    { label: 'NEW PASSWORD', ph: 'Min 8 characters' },
                    { label: 'CONFIRM NEW PASSWORD', ph: 'Repeat password' },
                  ].map((f, i) => (
                    <div key={i}>
                      <label className="block text-neon-red text-xs font-orbitron tracking-widest mb-2">{f.label}</label>
                      <div className="relative">
                        <input type={showKey ? 'text' : 'password'} placeholder={f.ph}
                          className="cyber-input w-full px-3 pr-10 py-2.5 text-sm rounded-sm" />
                        {i === 1 && (
                          <button type="button" onClick={() => setShowKey(!showKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-text hover:text-neon-blue">
                            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button onClick={handleSave} className="btn-neon-red px-6 py-2.5 text-xs rounded-sm flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" />
                    {saved ? 'UPDATED!' : 'UPDATE PASSWORD'}
                  </button>
                </div>
              </div>

              <div className="glass-card border border-cyber-border/50 rounded-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-cyber-border/40">
                  <h2 className="font-orbitron font-bold text-white text-xs tracking-widest">TWO-FACTOR AUTHENTICATION</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white text-sm font-orbitron font-bold mb-1">Authenticator App</div>
                      <div className="text-cyber-text text-xs font-rajdhani">Add extra security with TOTP authenticator</div>
                    </div>
                    <button className="btn-neon-blue px-4 py-2 text-xs rounded-sm">ENABLE 2FA</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="glass-card border border-cyber-border/50 rounded-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-cyber-border/40 flex items-center gap-3">
                <Bell className="w-4 h-4 text-neon-cyan" />
                <h2 className="font-orbitron font-bold text-white text-xs tracking-widest">NOTIFICATION SETTINGS</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { key: 'device', label: 'Device Alerts', desc: 'Online/offline and hardware alerts' },
                  { key: 'license', label: 'License Notifications', desc: 'Expiry reminders and activations' },
                  { key: 'dealer', label: 'Dealer Updates', desc: 'New dealers and tier changes' },
                  { key: 'system', label: 'System Alerts', desc: 'Updates and maintenance windows' },
                  { key: 'email', label: 'Email Notifications', desc: 'Send alerts to your email' },
                  { key: 'sms', label: 'SMS Alerts', desc: 'Critical alerts via SMS' },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between py-3 border-b border-cyber-border/20">
                    <div>
                      <div className="text-white text-sm font-orbitron font-bold">{n.label}</div>
                      <div className="text-cyber-text text-xs font-rajdhep mt-0.5">{n.desc}</div>
                    </div>
                    <button
                      onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                        notifs[n.key as keyof typeof notifs] ? 'bg-neon-blue/30 border border-neon-blue' : 'bg-cyber-panel border border-cyber-border'
                      }`}
                      style={notifs[n.key as keyof typeof notifs] ? { boxShadow: '0 0 10px rgba(0,212,255,0.4)' } : {}}>
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
                        notifs[n.key as keyof typeof notifs] ? 'left-6 bg-neon-blue' : 'left-0.5 bg-cyber-text/40'
                      }`} style={notifs[n.key as keyof typeof notifs] ? { boxShadow: '0 0 6px #00d4ff' } : {}} />
                    </button>
                  </div>
                ))}
                <button onClick={handleSave} className="btn-neon-solid px-6 py-2.5 text-xs rounded-sm flex items-center gap-2">
                  <Save className="w-3.5 h-3.5" />
                  {saved ? 'SAVED!' : 'SAVE PREFERENCES'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-4">
              <div className="glass-card border border-cyber-border/50 rounded-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-cyber-border/40 flex items-center gap-3">
                  <Database className="w-4 h-4 text-neon-blue" />
                  <h2 className="font-orbitron font-bold text-white text-xs tracking-widest">SYSTEM CONFIGURATION</h2>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { label: 'SYSTEM NAME', val: 'BYG-PISOTAB PRO', type: 'text' },
                    { label: 'ADMIN EMAIL', val: 'admin@byg-pisotab.com', type: 'email' },
                    { label: 'MAX DEVICES PER LICENSE', val: '10', type: 'number' },
                    { label: 'SESSION TIMEOUT (MIN)', val: '30', type: 'number' },
                  ].map((f, i) => (
                    <div key={i}>
                      <label className="block text-neon-blue text-xs font-orbitron tracking-widest mb-2">{f.label}</label>
                      <input type={f.type} defaultValue={f.val} className="cyber-input w-full px-3 py-2.5 text-sm rounded-sm" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-neon-blue text-xs font-orbitron tracking-widest mb-2">MAINTENANCE MODE</label>
                    <select className="cyber-input w-full px-3 py-2.5 text-sm rounded-sm appearance-none">
                      <option>Disabled</option>
                      <option>Enabled</option>
                      <option>Scheduled</option>
                    </select>
                  </div>
                  <button onClick={handleSave} className="btn-neon-solid px-6 py-2.5 text-xs rounded-sm flex items-center gap-2">
                    <Save className="w-3.5 h-3.5" />
                    {saved ? 'SAVED!' : 'SAVE CONFIGURATION'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="glass-card border border-cyber-border/50 rounded-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-cyber-border/40 flex items-center gap-3">
                <Key className="w-4 h-4 text-neon-pink" />
                <h2 className="font-orbitron font-bold text-white text-xs tracking-widest">API KEY MANAGEMENT</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { name: 'Production Key', key: 'byg_prod_xxxxxxxxxxxxxxxxxxxxxxxx', scope: 'Full Access', status: 'active' },
                  { name: 'Testing Key', key: 'byg_test_xxxxxxxxxxxxxxxxxxxxxxxx', scope: 'Read Only', status: 'active' },
                  { name: 'Webhook Key', key: 'byg_hook_xxxxxxxxxxxxxxxxxxxxxxxx', scope: 'Webhooks', status: 'active' },
                ].map((api, i) => (
                  <div key={i} className="border border-cyber-border/40 rounded-sm p-4 hover:border-neon-blue/30 transition-all">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="text-white font-orbitron font-bold text-sm">{api.name}</div>
                        <div className="text-cyber-text text-xs font-rajdhani mt-0.5">{api.scope}</div>
                      </div>
                      <span className="badge-active">{api.status.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-neon-blue font-orbitron text-xs bg-cyber-panel px-3 py-2 rounded-sm truncate"
                        style={{ fontSize: '11px' }}>
                        {showKey ? api.key : api.key.slice(0, 12) + '••••••••••••••••'}
                      </code>
                      <button onClick={() => setShowKey(!showKey)} className="text-cyber-text hover:text-neon-blue transition-colors">
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button className="btn-neon-blue px-3 py-1.5 text-xs rounded-sm">COPY</button>
                    </div>
                  </div>
                ))}
                <button className="btn-neon-blue w-full py-3 rounded-sm text-xs flex items-center justify-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> GENERATE NEW KEY
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
