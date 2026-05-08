import { Thermometer, Droplets, CloudRain, Wind, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeatherMonitoringProps {
  currentZone: string;
}

const realtimeData = [
  { time: '14:00', temp: 27, humidity: 68, rainfall: 0 },
  { time: '14:05', temp: 27.5, humidity: 67, rainfall: 1 },
  { time: '14:10', temp: 28, humidity: 65, rainfall: 3 },
  { time: '14:15', temp: 28.2, humidity: 64, rainfall: 5 },
  { time: '14:20', temp: 27.8, humidity: 66, rainfall: 4 },
  { time: '14:25', temp: 27.5, humidity: 67, rainfall: 2 },
];

export function WeatherMonitoring({ currentZone }: WeatherMonitoringProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gray-800">Weather Monitoring</h2>
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-green-500 animate-pulse" />
          <span className="text-sm text-gray-600">Live Data - {currentZone}</span>
        </div>
      </div>

      {/* Current Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Thermometer className="w-8 h-8" />
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">Real-time</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Temperature</p>
          <h3 className="text-3xl">27.8°C</h3>
          <p className="text-xs opacity-75 mt-2">Range: 20-35°C</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Droplets className="w-8 h-8" />
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">Real-time</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Humidity</p>
          <h3 className="text-3xl">66%</h3>
          <p className="text-xs opacity-75 mt-2">Range: 40-80%</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CloudRain className="w-8 h-8" />
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">Real-time</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Rainfall</p>
          <h3 className="text-3xl">2 mm/h</h3>
          <p className="text-xs opacity-75 mt-2">Threshold: 4 mm/h</p>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Wind className="w-8 h-8" />
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">Real-time</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Wind Speed</p>
          <h3 className="text-3xl">12 km/h</h3>
          <p className="text-xs opacity-75 mt-2">Direction: NE</p>
        </div>
      </div>

      {/* Real-time Charts */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg text-gray-800 mb-4">Temperature Trend (Last 30 Minutes)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={realtimeData}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Area type="monotone" dataKey="temp" stroke="#ef4444" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg text-gray-800 mb-4">Humidity Trend (Last 30 Minutes)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={realtimeData}>
              <defs>
                <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHumidity)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg text-gray-800 mb-4">Rainfall Trend (Last 30 Minutes)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={realtimeData}>
              <defs>
                <linearGradient id="colorRainfall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area type="monotone" dataKey="rainfall" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRainfall)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensor Status */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg text-gray-800 mb-4">Sensor Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <p className="text-sm text-gray-700">Temperature Sensor</p>
              <p className="text-xs text-gray-600">ID: TEMP-001</p>
            </div>
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Online</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <p className="text-sm text-gray-700">Humidity Sensor</p>
              <p className="text-xs text-gray-600">ID: HUM-001</p>
            </div>
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Online</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <p className="text-sm text-gray-700">Rain Gauge</p>
              <p className="text-xs text-gray-600">ID: RAIN-001</p>
            </div>
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
