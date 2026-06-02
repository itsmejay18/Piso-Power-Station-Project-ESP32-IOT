import { useState } from 'react';
import {
  LayoutDashboard, Monitor, Key, Download, Users, BarChart2,
  Settings, FileText, HelpCircle, LogOut, Zap, Menu, X,
  Bell, ChevronDown, Shield
} from 'lucide-react';

interface NavItem {
  icon: React.ElementType;
  label: string;
  page: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' },
  { icon: Monitor, label: 'Devices', page: 'devices', badge: 3 },
  { icon: Key, label: 'Licenses', page: 'licenses' },
  { icon: Download, label: 'Downloads', page: 'downloads' },
  { icon: Users, label: 'Dealers', page: 'dealer' },
  { icon: BarChart2, label: 'Analytics', page: 'analytics' },
  { icon: Settings, label: 'Settings', page: 'settings' },
  { icon: FileText, label: 'Logs', page: 'dashboard' },
  { icon: HelpCircle, label: 'Support', page: 'dashboard' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  isAdmin?: boolean;
}

export default function DashboardLayout({ children, activePage, onNavigate, isAdmin = false }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const adminItems: NavItem[] = [
    ...navItems,
    { icon: Shield, label: 'Admin Panel', page: 'admin' },
  ];

  const items = isAdmin ? adminItems : navItems;

  return (
    <div className="min-h-screen bg-cyber-dark flex">
      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative lg:flex flex-col w-64 min-h-screen bg-cyber-navy border-r border-cyber-border/50 z-40 transition-transform duration-300 ${
        sidebarOpen ? 'flex translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
        style={{ boxShadow: '4px 0 20px rgba(0,212,255,0.05)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 p-5 border-b border-cyber-border/30">
          <div className="w-9 h-9 border-2 border-neon-blue flex items-center justify-center flex-shrink-0"
            style={{ boxShadow: '0 0 12px #00d4ff' }}>
            <Zap className="w-5 h-5 text-neon-blue" />
          </div>
          <div>
            <div className="font-orbitron font-bold text-white text-xs tracking-widest">BYG-PISOTAB</div>
            <div className="font-orbitron font-black text-neon-red text-xs" style={{ textShadow: '0 0 8px #ff0033' }}>PRO</div>
          </div>
          <button className="lg:hidden ml-auto text-cyber-text" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-cyber-border/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-neon-blue flex items-center justify-center text-xs font-orbitron font-bold text-neon-blue"
              style={{ background: 'rgba(0,212,255,0.1)', boxShadow: '0 0 8px rgba(0,212,255,0.3)' }}>
              AD
            </div>
            <div>
              <div className="text-white text-xs font-orbitron font-bold">Admin</div>
              <div className="text-neon-blue text-xs font-rajdhani">Super Admin</div>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-neon-green" style={{ boxShadow: '0 0 6px #00ff88' }} />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {items.map(item => (
            <button key={item.page + item.label}
              onClick={() => { onNavigate(item.page); setSidebarOpen(false); }}
              className={`sidebar-item w-full text-left relative ${activePage === item.page ? 'active' : ''}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto w-5 h-5 rounded-full text-xs font-orbitron flex items-center justify-center"
                  style={{ background: '#ff0033', color: '#fff', boxShadow: '0 0 8px #ff0033', fontSize: '10px' }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-cyber-border/30">
          <button onClick={() => onNavigate('landing')}
            className="sidebar-item w-full text-left text-neon-red hover:text-neon-red hover:bg-red-900/20 border-l-neon-red">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 glass-panel border-b border-cyber-border/30 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-cyber-text hover:text-neon-blue" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <div className="text-white font-orbitron font-bold text-sm capitalize tracking-wider">
                {activePage === 'dashboard' ? 'Dashboard' : activePage.charAt(0).toUpperCase() + activePage.slice(1)}
              </div>
              <div className="text-cyber-text text-xs font-rajdhani">Welcome back, Admin!</div>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-cyber-panel border border-cyber-border/50 rounded-sm px-3 py-2 w-48">
              <svg className="w-3.5 h-3.5 text-cyber-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input placeholder="Search..." className="bg-transparent text-cyber-text text-xs font-rajdhani outline-none w-full placeholder-cyber-text/40" />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-9 h-9 border border-cyber-border/50 flex items-center justify-center text-cyber-text hover:text-neon-blue hover:border-neon-blue transition-all rounded-sm">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-orbitron flex items-center justify-center"
                  style={{ background: '#ff0033', color: '#fff', fontSize: '9px', boxShadow: '0 0 6px #ff0033' }}>
                  5
                </span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 glass-panel border border-cyber-border rounded-sm z-50"
                  style={{ boxShadow: '0 10px 40px rgba(0,212,255,0.1)' }}>
                  <div className="px-4 py-3 border-b border-cyber-border/30">
                    <span className="font-orbitron text-xs text-neon-blue tracking-wider">NOTIFICATIONS</span>
                  </div>
                  {['New device activated', 'License expiring soon', 'System update available', 'New dealer registered', 'Alert: Device offline'].map((n, i) => (
                    <div key={i} className="px-4 py-3 border-b border-cyber-border/20 hover:bg-cyber-card cursor-pointer transition-colors">
                      <div className="text-white text-xs font-rajdhani">{n}</div>
                      <div className="text-cyber-text/60 text-xs mt-0.5">{i + 1}m ago</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-cyber-border/50 hover:border-neon-blue transition-all rounded-sm">
                <div className="w-6 h-6 rounded-full border border-neon-blue flex items-center justify-center text-xs font-orbitron text-neon-blue"
                  style={{ background: 'rgba(0,212,255,0.1)' }}>AD</div>
                <span className="text-white text-xs font-rajdhani hidden sm:block">Admin</span>
                <ChevronDown className="w-3 h-3 text-cyber-text" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 glass-panel border border-cyber-border rounded-sm z-50">
                  {['Profile', 'Settings', 'Help'].map(i => (
                    <button key={i} className="block w-full text-left px-4 py-3 text-cyber-text hover:text-neon-blue hover:bg-cyber-card text-xs font-rajdhani tracking-wider transition-colors border-b border-cyber-border/20">
                      {i}
                    </button>
                  ))}
                  <button onClick={() => onNavigate('landing')} className="block w-full text-left px-4 py-3 text-neon-red text-xs font-rajdhani tracking-wider hover:bg-red-900/20 transition-colors">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
