import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';
import LicensePage from './pages/LicensePage';
import DownloadsPage from './pages/DownloadsPage';
import DevicesPage from './pages/DevicesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import DealerPage from './pages/DealerPage';
import SettingsPage from './pages/SettingsPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import DealersLandingPage from './pages/DealersLandingPage';
import DownloadsLandingPage from './pages/DownloadsLandingPage';
import ContactPage from './pages/ContactPage';

type Page =
  | 'landing' | 'login' | 'register'
  | 'dashboard' | 'admin'
  | 'licenses' | 'downloads' | 'devices'
  | 'analytics' | 'dealer' | 'settings'
  | 'features' | 'pricing' | 'dealers-page' | 'downloads-page' | 'contact';

export default function App() {
  const [page, setPage] = useState<Page>('landing');

  const navigate = (p: string) => setPage(p as Page);

  switch (page) {
    case 'landing': return <LandingPage onNavigate={navigate} />;
    case 'login': return <LoginPage onNavigate={navigate} />;
    case 'register': return <RegisterPage onNavigate={navigate} />;
    case 'dashboard': return <DashboardPage onNavigate={navigate} />;
    case 'admin': return <AdminDashboard onNavigate={navigate} />;
    case 'licenses': return <LicensePage onNavigate={navigate} />;
    case 'downloads': return <DownloadsPage onNavigate={navigate} />;
    case 'devices': return <DevicesPage onNavigate={navigate} />;
    case 'analytics': return <AnalyticsPage onNavigate={navigate} />;
    case 'dealer': return <DealerPage onNavigate={navigate} />;
    case 'settings': return <SettingsPage onNavigate={navigate} />;
    case 'features': return <FeaturesPage onNavigate={navigate} />;
    case 'pricing': return <PricingPage onNavigate={navigate} />;
    case 'dealers-page': return <DealersLandingPage onNavigate={navigate} />;
    case 'downloads-page': return <DownloadsLandingPage onNavigate={navigate} />;
    case 'contact': return <ContactPage onNavigate={navigate} />;
    default: return <LandingPage onNavigate={navigate} />;
  }
}
