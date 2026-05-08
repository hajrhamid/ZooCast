import { AlertTriangle, CheckCircle, XCircle, Settings } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'Normal' | 'Warning' | 'Critical';
  time: string;
  zone: string;
}

export function AlertsNotifications() {
  const alerts: Alert[] = [
    {
      id: '1',
      title: 'Heavy Rain Warning',
      description: 'Rainfall exceeds 4mm/h threshold',
      severity: 'Warning',
      time: '5 min ago',
      zone: 'Bird Zone'
    },
    {
      id: '2',
      title: 'High Temperature Detected',
      description: 'Temperature reached 32°C in Reptile Area',
      severity: 'Critical',
      time: '15 min ago',
      zone: 'Reptile Area'
    },
    {
      id: '3',
      title: 'Humidity Level Normal',
      description: 'Humidity returned to optimal range',
      severity: 'Normal',
      time: '1 hour ago',
      zone: 'Cat Habitat'
    },
    {
      id: '4',
      title: 'Low Temperature Alert',
      description: 'Temperature dropped below 18°C',
      severity: 'Warning',
      time: '2 hours ago',
      zone: 'Savannah Zone'
    },
    {
      id: '5',
      title: 'System Status Normal',
      description: 'All sensors functioning correctly',
      severity: 'Normal',
      time: '3 hours ago',
      zone: 'All Zones'
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-50 border-red-300 text-red-700';
      case 'Warning':
        return 'bg-yellow-50 border-yellow-300 text-yellow-700';
      case 'Normal':
        return 'bg-green-50 border-green-300 text-green-700';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-700';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'Warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'Normal':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gray-800">Alerts & Notifications</h2>
        <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Settings className="w-4 h-4" />
          <span>Alert Settings</span>
        </button>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Critical Alerts</p>
              <h3 className="text-3xl text-gray-800">1</h3>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Warnings</p>
              <h3 className="text-3xl text-gray-800">2</h3>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Normal Status</p>
              <h3 className="text-3xl text-gray-800">2</h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg text-gray-800">Active Alerts</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-6 border-l-4 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm text-gray-800">{alert.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        alert.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                        alert.severity === 'Warning' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Zone: {alert.zone}</span>
                      <span>•</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Threshold Management */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg text-gray-800 mb-4">Alert Threshold Settings</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Temperature Max (°C)</label>
              <input
                type="number"
                defaultValue="35"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Temperature Min (°C)</label>
              <input
                type="number"
                defaultValue="20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Humidity Max (%)</label>
              <input
                type="number"
                defaultValue="80"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Humidity Min (%)</label>
              <input
                type="number"
                defaultValue="40"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Rainfall Threshold (mm/h)</label>
              <input
                type="number"
                defaultValue="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all">
                Save Thresholds
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
