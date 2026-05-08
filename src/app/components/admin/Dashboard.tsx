import { useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  Users,
  CloudRain,
  Bell,
  History,
  FileText,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { DashboardOverview } from './dashboard/DashboardOverview';
import { ActiveMonitoring } from './dashboard/ActiveMonitoring';
import { StaffManagement } from './dashboard/StaffManagement';
import { WeatherMonitoring } from './dashboard/WeatherMonitoring';
import { AlertsNotifications } from './dashboard/AlertsNotifications';
import { HistoricalData } from './dashboard/HistoricalData';
import { Reports } from './dashboard/Reports';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentZone, setCurrentZone] = useState('Bird Zone');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Active Monitoring Zone', icon: MapPin },
    { id: 'staff', label: 'Staff Management', icon: Users },
    { id: 'weather', label: 'Weather Monitoring', icon: CloudRain },
    { id: 'alerts', label: 'Alerts & Notifications', icon: Bell },
    { id: 'historical', label: 'Historical Data', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview currentZone={currentZone} />;
      case 'monitoring':
        return <ActiveMonitoring currentZone={currentZone} onZoneChange={setCurrentZone} />;
      case 'staff':
        return <StaffManagement />;
      case 'weather':
        return <WeatherMonitoring currentZone={currentZone} />;
      case 'alerts':
        return <AlertsNotifications />;
      case 'historical':
        return <HistoricalData />;
      case 'reports':
        return <Reports />;
      default:
        return <DashboardOverview currentZone={currentZone} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-gradient-to-b from-emerald-600 to-green-700 text-white transition-all duration-300 overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <CloudRain className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl">ZooCast</h1>
              <p className="text-xs text-emerald-100">Admin Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-white text-emerald-600 shadow-lg'
                      : 'text-white hover:bg-emerald-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-red-500 transition-all mt-8"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h2 className="text-xl text-gray-800">Welcome Back, Admin</h2>
                <p className="text-sm text-gray-500">{currentTime}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">ADM001</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
