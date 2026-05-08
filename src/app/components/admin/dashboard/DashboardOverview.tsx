import {
  useEffect,
  useState
} from "react";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit
} from "firebase/firestore";

import {
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Activity,
  AlertTriangle,
  Wifi,
  WifiOff,
  Clock
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";

import { db } from "../../../firebase/firebase";

export function DashboardOverview() {

  const [selectedZone, setSelectedZone] =
    useState("Bird Zone");

  const [liveData, setLiveData] =
    useState<any>(null);

  const [chartData, setChartData] =
    useState<any[]>([]);

  const [recentLogs, setRecentLogs] =
    useState<any[]>([]);

  const zones = [
    "Bird Zone",
    "Reptile Area",
    "Cat Habitat",
    "Aquatic Zone",
    "Savannah Zone",
    "Primate Section"
  ];

  // REALTIME ZONE DATA
  useEffect(() => {

    const unsubscribe = onSnapshot(

      collection(db, "zones"),

      (snapshot) => {

        const zoneDoc = snapshot.docs.find(
          (doc) => doc.id === selectedZone
        );

        if (zoneDoc) {

          setLiveData(zoneDoc.data());

        }

        else {

          setLiveData(null);

        }

      }

    );

    return () => unsubscribe();

  }, [selectedZone]);

  // CHART DATA
  useEffect(() => {

    const q = query(

      collection(db, "historical_data"),

      orderBy("createdAt", "desc"),

      limit(15)

    );

    const unsubscribe = onSnapshot(

      q,

      (snapshot) => {

        const filtered = snapshot.docs

          .map((doc) => ({

            id: doc.id,

            ...doc.data()

          }))

          .filter(
            (item: any) =>
              item.zone === selectedZone
          )

          .reverse();

        const formatted = filtered.map(
          (item: any) => ({

            time:
              item.timestamp || "--",

            temperature:
              Number(item.temperature) || 0,

            humidity:
              Number(item.humidity) || 0,

            rain:
              Number(item.rain) || 0

          })
        );

        setChartData(formatted);

        setRecentLogs(
          filtered
            .sort(

              (a: any, b: any) =>

                Number(b.createdAt || 0) -

                Number(a.createdAt || 0)

            )
            .slice(0, 5)
        );

      }

    );

    return () => unsubscribe();

  }, [selectedZone]);

  // ==========================================
  // DEVICE ONLINE DETECTION
  // ==========================================

  const currentTime =
    Math.floor(
      Date.now() / 1000
    );

  const lastUpdated =
    Number(
      liveData?.lastUpdated || 0
    );

  const deviceOnline =

    currentTime -
    lastUpdated <= 90;

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Smart Environment Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Real-time environmental monitoring and analytics
            </p>

          </div>

          <div className="flex items-center gap-4">

            <select
              value={selectedZone}
              onChange={(e) =>
                setSelectedZone(e.target.value)
              }
              className="px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >

              {zones.map((zone) => (

                <option
                  key={zone}
                  value={zone}
                >
                  {zone}
                </option>

              ))}

            </select>

            <div className={`px-4 py-3 rounded-xl flex items-center gap-2 font-medium ${deviceOnline ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>

              {deviceOnline ? (
                <Wifi className="w-5 h-5" />
              ) : (
                <WifiOff className="w-5 h-5" />
              )}

              {deviceOnline
                ? "Device Online"
                : "No Active Device"}

            </div>

          </div>

        </div>

      </div>

      {/* SENSOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

        <SensorCard
          title="Temperature"
          value={
            deviceOnline
              ? liveData?.temperature || "--"
              : "--"
          }
          unit="°C"
          icon={<Thermometer className="w-6 h-6" />}
          color="orange"
        />

        <SensorCard
          title="Humidity"
          value={
            deviceOnline
              ? liveData?.humidity || "--"
              : "--"
          }
          unit="%"
          icon={<Droplets className="w-6 h-6" />}
          color="blue"
        />

        <SensorCard
          title="Rain"
          value={
            deviceOnline
              ? liveData?.rain || "--"
              : "--"
          }
          unit="%"
          icon={<CloudRain className="w-6 h-6" />}
          color="sky"
        />

        <SensorCard
          title="Pressure"
          value={
            deviceOnline
              ? liveData?.pressure || "--"
              : "--"
          }
          unit="hPa"
          icon={<Wind className="w-6 h-6" />}
          color="emerald"
        />

        <SensorCard
          title="Gas Level"
          value={
            deviceOnline
              ? liveData?.gas || "--"
              : "--"
          }
          unit="ppm"
          icon={<Activity className="w-6 h-6" />}
          color="purple"
        />

      </div>

      {/* MAIN CHART */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

        <div className="mb-6">

          <h2 className="text-xl font-bold text-gray-800">
            Environmental Trend Analysis
          </h2>

          <p className="text-gray-500 mt-1">
            Real-time sensor trends from historical data
          </p>

        </div>

        <div className="h-[380px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#ea580c"
                strokeWidth={3}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="rain"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* SECOND SECTION */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

  {/* DEVICE STATUS */}
  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

    <div className="flex items-center justify-between mb-6">

      <div>

        <h2 className="text-xl font-bold text-gray-800">
          Device Status
        </h2>

        <p className="text-gray-500 mt-1">
          Current monitoring device information
        </p>

      </div>

      <div className={`w-4 h-4 rounded-full ${deviceOnline ? "bg-green-500" : "bg-red-500"}`} />

    </div>

    <div className="space-y-4">

      <StatusRow
        label="Monitoring Zone"
        value={selectedZone}
      />

      <StatusRow
        label="Connection"
        value={deviceOnline ? "Online" : "Offline"}
      />

      <StatusRow
        label="Last Sync"
        value={
          deviceOnline
            ? "Active"
            : "No Data"
        }
      />

      <StatusRow
        label="Signal"
        value={
          deviceOnline
            ? "Strong"
            : "Disconnected"
        }
      />

    </div>

  </div>

  {/* ALERT PANEL */}
  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

    <div className="mb-6">

      <h2 className="text-xl font-bold text-gray-800">
        Live Alerts
      </h2>

      <p className="text-gray-500 mt-1">
        Real-time environmental warnings
      </p>

    </div>

    <div className="space-y-4">

      {(deviceOnline && liveData?.temperature > 35) && (

        <AlertBox
          title="High Temperature Warning"
          description={`Temperature reached ${liveData.temperature}°C in ${selectedZone}`}
        />

      )}

      {(deviceOnline && liveData?.humidity < 55) && (

        <AlertBox
          title="Low Humidity Alert"
          description={`Humidity level dropped to ${liveData.humidity}%`}
        />

      )}

      {(deviceOnline && liveData?.gas > 300) && (

        <AlertBox
          title="Air Quality Warning"
          description={`Gas level reached ${liveData.gas} ppm`}
        />

      )}

      {!liveData && (

        <div className="text-center py-10 text-gray-400">
          No active alerts
        </div>

      )}

    </div>

  </div>

</div>

{/* RAIN CHART */}
<div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

  <div className="mb-6">

    <h2 className="text-xl font-bold text-gray-800">
      Rainfall Intensity
    </h2>

    <p className="text-gray-500 mt-1">
      Rainfall monitoring based on historical records
    </p>

  </div>

  <div className="h-[260px]">

    <ResponsiveContainer
      width="100%"
      height="100%"
    >

      <AreaChart data={chartData}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="time" />

        <YAxis />

        <Tooltip />

        <Area
          type="monotone"
          dataKey="rain"
          stroke="#0284c7"
          fill="#7dd3fc"
        />

      </AreaChart>

    </ResponsiveContainer>

  </div>

</div>

{/* RECENT LOGS */}
<div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

  <div className="p-6 border-b border-gray-100">

    <h2 className="text-xl font-bold text-gray-800">
      Recent Historical Logs
    </h2>

  </div>

  <div className="overflow-x-auto">

    <table className="w-full">

      <thead className="bg-gray-50">

        <tr>

          <th className="p-4 text-left text-gray-600">
            Zone
          </th>

          <th className="p-4 text-left text-gray-600">
            Temperature
          </th>

          <th className="p-4 text-left text-gray-600">
            Humidity
          </th>

          <th className="p-4 text-left text-gray-600">
            Rain
          </th>

          <th className="p-4 text-left text-gray-600">
            Timestamp
          </th>

        </tr>

      </thead>

      <tbody>

        {recentLogs.map((log: any) => (

          <tr
            key={log.id}
            className="border-t border-gray-100 hover:bg-gray-50"
          >

            <td className="p-4 font-medium">
              {log.zone}
            </td>

            <td className="p-4">
              {log.temperature}°C
            </td>

            <td className="p-4">
              {log.humidity}%
            </td>

            <td className="p-4">
              {log.rain}%
            </td>

            <td className="p-4 text-gray-500">
              {log.timestamp}
            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>


      </div>

    </div>

  );

}

// ==========================================
// SENSOR CARD COMPONENT
// ==========================================

function SensorCard({

  title,

  value,

  unit,

  icon,

  color

}: any) {

  const colors: any = {

    orange:
      "bg-orange-50 text-orange-600",

    blue:
      "bg-blue-50 text-blue-600",

    sky:
      "bg-sky-50 text-sky-600",

    emerald:
      "bg-emerald-50 text-emerald-600",

    purple:
      "bg-purple-50 text-purple-600"

  };

  return (

    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">

      <div className="flex items-center justify-between mb-5">

        <div>

          <p className="text-sm text-gray-500">

            {title}

          </p>

          <h3 className="text-3xl font-bold text-gray-800 mt-2">

            {value}

            <span className="text-lg ml-1">

              {unit}

            </span>

          </h3>

        </div>

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors[color]}`}>

          {icon}

        </div>

      </div>

    </div>

  );

}

// ==========================================
// STATUS ROW COMPONENT
// ==========================================

function StatusRow({

  label,

  value

}: any) {

  return (

    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-4">

      <p className="text-gray-500">

        {label}

      </p>

      <p className="font-semibold text-gray-800">

        {value}

      </p>

    </div>

  );

}

// ==========================================
// ALERT BOX COMPONENT
// ==========================================

function AlertBox({

  title,

  description

}: any) {

  return (

    <div className="border border-orange-200 bg-orange-50 rounded-2xl p-5">

      <div className="flex items-start gap-4">

        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">

          <AlertTriangle className="w-6 h-6" />

        </div>

        <div>

          <h3 className="font-bold text-orange-700 text-lg">

            {title}

          </h3>

          <p className="text-orange-600 mt-1">

            {description}

          </p>

          <div className="flex items-center gap-2 mt-3 text-sm text-orange-500">

            <Clock className="w-4 h-4" />

            Live monitoring alert

          </div>

        </div>

      </div>

    </div>

  );

}