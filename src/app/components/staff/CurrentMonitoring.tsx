import { useEffect, useState } from "react";

import {
  MapPin,
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  AlertCircle
} from 'lucide-react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import {
  onSnapshot,
  doc
} from "firebase/firestore";

import {
  db
} from "../../firebase/firebase";

const realtimeData = [
  { time: '12:50', temp: 30.2, humidity: 55 },
  { time: '12:52', temp: 30.5, humidity: 54.8 },
  { time: '12:54', temp: 30.7, humidity: 54.5 },
  { time: '12:56', temp: 30.9, humidity: 54.2 },
  { time: '12:58', temp: 31.0, humidity: 54.0 },
  { time: '13:00', temp: 31.2, humidity: 53.8 },
];

export function CurrentMonitoring() {

  const [weatherData, setWeatherData] =
    useState<any>(null);

  const [activeZone, setActiveZone] =
    useState("Loading...");

  // ACTIVE ZONE
  useEffect(() => {

    const unsubscribe = onSnapshot(

      doc(db, "system", "activeZone"),

      (snapshot) => {

        if (snapshot.exists()) {

          setActiveZone(
            snapshot.data().zone
          );

        }

      }

    );

    return () => unsubscribe();

  }, []);

  // WEATHER DATA BASED ON ACTIVE ZONE
  useEffect(() => {

    if (activeZone === "Loading...") return;

    const unsubscribe = onSnapshot(

      doc(db, "zones", activeZone),

      (snapshot) => {

        if (snapshot.exists()) {

          setWeatherData(
            snapshot.data()
          );

        }

      }

    );

    return () => unsubscribe();

  }, [activeZone]);

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Real-Time Weather Monitoring
        </h2>

        <p className="text-gray-500">
          Live environmental data from portable IoT device
        </p>

      </div>

      {/* ACTIVE ZONE */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">

        <div className="flex items-center gap-2 mb-2">

          <MapPin className="w-5 h-5" />

          <span className="text-orange-100 text-sm font-medium">
            Currently Monitoring Active Zone
          </span>

        </div>

        <h3 className="text-3xl font-bold">
          {activeZone}
        </h3>

      </div>

      {/* LIVE WEATHER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* TEMPERATURE */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">

          <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">

            <Thermometer className="w-6 h-6 text-orange-600" />

          </div>

          <p className="text-sm text-gray-500 mb-1">
            Temperature
          </p>

          <p className="text-4xl font-bold text-gray-800">
            {weatherData?.temperature || 0}°C
          </p>

        </div>

        {/* HUMIDITY */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">

          <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">

            <Droplets className="w-6 h-6 text-blue-600" />

          </div>

          <p className="text-sm text-gray-500 mb-1">
            Humidity
          </p>

          <p className="text-4xl font-bold text-gray-800">
            {weatherData?.humidity || 0}%
          </p>

        </div>

        {/* RAIN */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">

          <div className="bg-sky-100 p-3 rounded-lg w-fit mb-4">

            <CloudRain className="w-6 h-6 text-sky-600" />

          </div>

          <p className="text-sm text-gray-500 mb-1">
            Rain Level
          </p>

          <p className="text-4xl font-bold text-gray-800">
            {weatherData?.rain || 0}%
          </p>

        </div>

        {/* PRESSURE */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">

          <div className="bg-emerald-100 p-3 rounded-lg w-fit mb-4">

            <Wind className="w-6 h-6 text-emerald-600" />

          </div>

          <p className="text-sm text-gray-500 mb-1">
            Pressure
          </p>

          <p className="text-4xl font-bold text-gray-800">
            {weatherData?.pressure || 0}
          </p>

        </div>

      </div>

      {/* TREND CHART */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">

        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Real-Time Trend
        </h3>

        <ResponsiveContainer width="100%" height={300}>

          <AreaChart data={realtimeData}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="time"
              stroke="#6b7280"
            />

            <YAxis
              stroke="#6b7280"
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="temp"
              stroke="#f97316"
              fill="#fed7aa"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

      {/* ALERT */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">

        <div className="flex items-start gap-3">

          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />

          <div>

            <h4 className="font-semibold text-orange-800 mb-1">
              Active Warning
            </h4>

            <p className="text-sm text-orange-700">
              High temperature detected in {activeZone}.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}