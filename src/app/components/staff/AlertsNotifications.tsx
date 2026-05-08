import { AlertTriangle, AlertCircle, CheckCircle, Bell, Clock } from 'lucide-react';

const alerts = [
  {
    id: 1,
    severity: 'warning',
    title: 'High Temperature Warning',
    message: 'Temperature in Bird Zone has reached 31.2°C, approaching upper threshold of 35°C.',
    zone: 'Bird Zone',
    timestamp: '2026-05-02 13:00',
    status: 'active'
  },
  {
    id: 2,
    severity: 'warning',
    title: 'Low Humidity Alert',
    message: 'Humidity level dropped to 53.8%, below optimal range for Bird Zone.',
    zone: 'Bird Zone',
    timestamp: '2026-05-02 12:45',
    status: 'active'
  },
  {
    id: 3,
    severity: 'critical',
    title: 'Heavy Rainfall Detected',
    message: 'Rainfall exceeded 5mm/hour in Reptile Zone. Potential flooding risk.',
    zone: 'Reptile Zone',
    timestamp: '2026-05-01 14:30',
    status: 'resolved'
  },
  {
    id: 4,
    severity: 'normal',
    title: 'Weather Normalized',
    message: 'All environmental parameters in Mammal Zone are within normal range.',
    zone: 'Mammal Zone',
    timestamp: '2026-05-01 10:15',
    status: 'resolved'
  },
  {
    id: 5,
    severity: 'critical',
    title: 'Extreme Temperature Alert',
    message: 'Temperature dropped to 18°C in Reptile Zone, below critical threshold of 20°C.',
    zone: 'Reptile Zone',
    timestamp: '2026-04-30 22:00',
    status: 'resolved'
  },
  {
    id: 6,
    severity: 'warning',
    title: 'High Humidity Warning',
    message: 'Humidity reached 72% in Bird Zone, exceeding optimal range.',
    zone: 'Bird Zone',
    timestamp: '2026-04-29 16:20',
    status: 'resolved'
  },
];

const getSeverityConfig = (severity: string) => {
  switch (severity) {
    case 'critical':
      return {
        icon: AlertTriangle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600',
        iconBg: 'bg-red-100',
        textColor: 'text-red-800',
        badge: 'bg-red-100 text-red-700'
      };
    case 'warning':
      return {
        icon: AlertCircle,
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        iconColor: 'text-orange-600',
        iconBg: 'bg-orange-100',
        textColor: 'text-orange-800',
        badge: 'bg-orange-100 text-orange-700'
      };
    default:
      return {
        icon: CheckCircle,
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        iconColor: 'text-orange-600',
        iconBg: 'bg-orange-100',
        textColor: 'text-orange-800',
        badge: 'bg-orange-100 text-orange-700'
      };
  }
};

export function AlertsNotifications() {
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Alerts & Notifications</h2>
        <p className="text-gray-500">Weather alerts based on threshold monitoring</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Critical Alerts</span>
          </div>
          <p className="text-3xl font-bold text-red-600">0</p>
          <p className="text-xs text-gray-500 mt-1">Active critical warnings</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Warning Alerts</span>
          </div>
          <p className="text-3xl font-bold text-orange-600">{activeAlerts.length}</p>
          <p className="text-xs text-gray-500 mt-1">Requires attention</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Resolved Today</span>
          </div>
          <p className="text-3xl font-bold text-orange-600">1</p>
          <p className="text-xs text-gray-500 mt-1">Issues resolved</p>
        </div>
      </div>

      {/* Active Alerts */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-800">Active Alerts</h3>
          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
            {activeAlerts.length}
          </span>
        </div>

        <div className="space-y-3">
          {activeAlerts.map((alert) => {
            const config = getSeverityConfig(alert.severity);
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={`${config.bgColor} border ${config.borderColor} rounded-xl p-5`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${config.iconBg} p-3 rounded-lg flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${config.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-semibold ${config.textColor}`}>{alert.title}</h4>
                      <span className={`px-3 py-1 ${config.badge} rounded-full text-xs font-medium uppercase`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className={`text-sm ${config.textColor} mb-3`}>{alert.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{alert.timestamp}</span>
                      </div>
                      <span className="px-2 py-1 bg-white rounded text-xs font-medium">
                        {alert.zone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alert History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Alert History</h3>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {resolvedAlerts.map((alert) => {
                  const config = getSeverityConfig(alert.severity);

                  return (
                    <tr key={alert.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 ${config.badge} rounded-full text-xs font-medium uppercase`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-800">{alert.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.message}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {alert.zone}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {alert.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          Resolved
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alert Configuration Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h4 className="font-semibold text-blue-800 mb-2">Alert Thresholds</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium">Temperature</p>
            <p className="text-xs mt-1">Critical: &lt;20°C or &gt;35°C</p>
            <p className="text-xs">Warning: 20-22°C or 33-35°C</p>
          </div>
          <div>
            <p className="font-medium">Humidity</p>
            <p className="text-xs mt-1">Critical: &lt;30% or &gt;80%</p>
            <p className="text-xs">Warning: 30-40% or 70-80%</p>
          </div>
          <div>
            <p className="font-medium">Rainfall</p>
            <p className="text-xs mt-1">Critical: &gt;5mm/hour</p>
            <p className="text-xs">Warning: 3-5mm/hour</p>
          </div>
        </div>
      </div>
    </div>
  );
}
