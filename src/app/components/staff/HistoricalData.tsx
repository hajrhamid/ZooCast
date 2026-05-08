import { useEffect, useState } from 'react';

import {
  Activity,
  Search,
  Download
} from 'lucide-react';

import {
  collection,
  onSnapshot,
  query
} from 'firebase/firestore';

import {

  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend

} from "recharts";

import { db } from '../../firebase/firebase';

export function HistoricalData() {

  // =====================================
  // STATES
  // =====================================

  const [historicalRecords, setHistoricalRecords] =
    useState<any[]>([]);

  const [selectedZone, setSelectedZone] =
    useState('All Zones');

  const [searchTerm, setSearchTerm] =
    useState('');

  const [selectedDate, setSelectedDate] =
    useState('');

  const [filteredRecords, setFilteredRecords] =
    useState<any[]>([]);

  // =====================================
  // PAGINATION
  // =====================================

  const ITEMS_PER_PAGE = 30;

  const [currentPage, setCurrentPage] =
    useState(1);

  const totalPages = Math.ceil(

    filteredRecords.length /
    ITEMS_PER_PAGE

  );

  const startIndex =

    (currentPage - 1) *
    ITEMS_PER_PAGE;

  const endIndex =

    startIndex +
    ITEMS_PER_PAGE;

  const paginatedRecords =

    filteredRecords.slice(
      startIndex,
      endIndex
    );

  const groupedData: any = {};

filteredRecords.forEach((record: any) => {

  const date =

    typeof record.timestamp === "string"

      ? record.timestamp.split(",")[0]

      : "--";

  if (!groupedData[date]) {

    groupedData[date] = {

      time: date,

      temperature: [],

      humidity: [],

      rain: []

    };

  }

  groupedData[date].temperature.push(
    Number(record.temperature) || 0
  );

  groupedData[date].humidity.push(
    Number(record.humidity) || 0
  );

  groupedData[date].rain.push(
    Number(record.rain) || 0
  );

});

const chartData = Object.values(groupedData).map(

  (item: any) => ({

    time: item.time,

    temperature:

      item.temperature.reduce(
        (a: number, b: number) => a + b,
        0
      ) /

      item.temperature.length,

    humidity:

      item.humidity.reduce(
        (a: number, b: number) => a + b,
        0
      ) /

      item.humidity.length,

    rain:

      item.rain.reduce(
        (a: number, b: number) => a + b,
        0
      ) /

      item.rain.length

  })

);

  // =====================================
  // FETCH FIRESTORE
  // =====================================

  useEffect(() => {

    const q = query(

      collection(
        db,
        'historical_data'
      )

    );

    const unsubscribe = onSnapshot(

      q,

      (snapshot) => {

        const records =
          snapshot.docs.map((doc) => {

            const data =
              doc.data();

            return {

              id: doc.id,

              zone:
                data.zone || 'Unknown',

              temperature:
                Number(
                  data.temperature || 0
                ),

              humidity:
                Number(
                  data.humidity || 0
                ),

              pressure:
                Number(
                  data.pressure || 0
                ),

              gas:
                Number(
                  data.gas || 0
                ),

              rain:
                Number(
                  data.rain || 0
                ),

              // =====================================
              // TIMESTAMP
              // =====================================

              timestamp:
                data.timestamp || "No Time",

              // =====================================
              // CREATED AT
              // =====================================

              createdAt:
                Number(
                  data.createdAt || 0
                )

            };

          });

        // =====================================
        // SORT NEWEST FIRST
        // =====================================

        const sortedRecords =
          records.sort(

            (a: any, b: any) =>

              b.createdAt -
              a.createdAt

          );

        setHistoricalRecords(
          sortedRecords
        );

        setFilteredRecords(
          sortedRecords
        );

      }

    );

    return () => unsubscribe();

  }, []);

  // =====================================
  // ZONES
  // =====================================

  const zones = [

    'All Zones',

    ...new Set(

      historicalRecords.map(
        (record) => record.zone
      )

    )

  ];

  // =====================================
  // SEARCH FILTER
  // =====================================

  const handleSearch = () => {

    const filtered =
      historicalRecords.filter((record) => {

        const zoneMatch =

          selectedZone ===
            'All Zones' ||

          record.zone ===
            selectedZone;

        const searchMatch =

          record.zone
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||

          record.timestamp
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );

        const dateMatch =

          !selectedDate ||

          new Date(
            record.createdAt
          )

            .toISOString()

            .split("T")[0] ===
              selectedDate;

        return (

          zoneMatch &&
          searchMatch &&
          dateMatch

        );

      });

    setFilteredRecords(
      filtered
    );

    setCurrentPage(1);

  };

  // =====================================
  // PAGE CHANGE
  // =====================================

  const nextPage = () => {

    if (
      currentPage <
      totalPages
    ) {

      setCurrentPage(
        currentPage + 1
      );

    }

  };

  const previousPage = () => {

    if (
      currentPage > 1
    ) {

      setCurrentPage(
        currentPage - 1
      );

    }

  };

  // =====================================
  // EXPORT CSV
  // =====================================

  const exportCSV = () => {

    const headers =

      [

        'Zone',
        'Temperature',
        'Humidity',
        'Pressure',
        'Gas',
        'Rain',
        'Timestamp'

      ];

    const rows =
      filteredRecords.map(

        (record) => [

          record.zone,
          record.temperature,
          record.humidity,
          record.pressure,
          record.gas,
          record.rain,
          record.timestamp

        ]

      );

    const csvContent =

      [

        headers.join(','),

        ...rows.map(
          (row) => row.join(',')
        )

      ].join('\n');

    const blob = new Blob(

      [csvContent],

      {
        type:
          'text/csv;charset=utf-8;'
      }

    );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        'a'
      );

    link.href = url;

    link.download =
      'historical_data.csv';

    link.click();

  };

  // =====================================
  // UI
  // =====================================

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h2 className="text-2xl text-gray-800">

            Historical Weather Data

          </h2>

          <p className="text-gray-500">

            Environmental analytics dashboard

          </p>

        </div>

        <button

          onClick={exportCSV}

          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-lg hover:bg-emerald-700 transition-all"

        >

          <Download className="w-5 h-5" />

          Export CSV

        </button>

      </div>

      {/* FILTERS */}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div className="relative">

            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />

            <input

              type="text"

              placeholder="Search zone or timestamp..."

              value={searchTerm}

              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }

              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"

            />

          </div>

          <select

            value={selectedZone}

            onChange={(e) =>
              setSelectedZone(
                e.target.value
              )
            }

            className="px-4 py-3 border border-gray-300 rounded-lg"

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

          <input

            type="date"

            value={selectedDate}

            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }

            className="px-4 py-3 border border-gray-300 rounded-lg"

          />

          <button

            onClick={handleSearch}

            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"

          >

            Search Data

          </button>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

          <p className="text-sm text-gray-600">

            Avg Temperature

          </p>

          <p className="text-3xl text-gray-800 mt-2">

            {filteredRecords.length

              ? (

                  filteredRecords.reduce(

                    (sum, item) =>

                      sum + item.temperature,

                    0

                  ) /

                  filteredRecords.length

                ).toFixed(1)

              : '0'}°C

          </p>

        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

          <p className="text-sm text-gray-600">

            Avg Humidity

          </p>

          <p className="text-3xl text-gray-800 mt-2">

            {filteredRecords.length

              ? (

                  filteredRecords.reduce(

                    (sum, item) =>

                      sum + item.humidity,

                    0

                  ) /

                  filteredRecords.length

                ).toFixed(1)

              : '0'}%

          </p>

        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

          <p className="text-sm text-gray-600">

            Avg Rain

          </p>

          <p className="text-3xl text-gray-800 mt-2">

            {filteredRecords.length

              ? (

                  filteredRecords.reduce(

                    (sum, item) =>

                      sum + item.rain,

                    0

                  ) /

                  filteredRecords.length

                ).toFixed(1)

              : '0'}%

          </p>

        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-600">

                Total Records

              </p>

              <p className="text-3xl text-gray-800 mt-2">

                {filteredRecords.length}

              </p>

            </div>

            <Activity className="w-8 h-8 text-emerald-600" />

          </div>

        </div>

      </div>
      {/* WEATHER TRENDS CHART */}
<div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">

  <div className="mb-6">

    <h2 className="text-2xl font-bold text-gray-800">
      Weather Trends - Historical Data
    </h2>

    <p className="text-gray-500 mt-1">
      Environmental monitoring analysis from historical records
    </p>

  </div>

  <div className="h-[420px]">

    <ResponsiveContainer
      width="100%"
      height="100%"
    >

      <LineChart data={chartData}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="time" />

        <YAxis />

        <Tooltip />

        <Legend />

        {/* TEMPERATURE */}
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#ef4444"
          strokeWidth={3}
          dot={{ r: 4 }}
          name="Avg Temperature (°C)"
        />

        {/* HUMIDITY */}
        <Line
          type="monotone"
          dataKey="humidity"
          stroke="#2563eb"
          strokeWidth={3}
          dot={{ r: 4 }}
          name="Avg Humidity (%)"
        />

        {/* RAIN */}
        <Line
          type="monotone"
          dataKey="rain"
          stroke="#7c3aed"
          strokeWidth={3}
          dot={{ r: 4 }}
          name="Total Rainfall (mm)"
        />

      </LineChart>

    </ResponsiveContainer>

  </div>

</div>
      {/* TABLE */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="p-6 border-b border-gray-200">

          <h3 className="text-lg text-gray-800">

            Historical Records

          </h3>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="px-6 py-4 text-left text-sm text-gray-600">

                  Zone

                </th>

                <th className="px-6 py-4 text-left text-sm text-gray-600">

                  Temperature

                </th>

                <th className="px-6 py-4 text-left text-sm text-gray-600">

                  Humidity

                </th>

                <th className="px-6 py-4 text-left text-sm text-gray-600">

                  Rain

                </th>

                <th className="px-6 py-4 text-left text-sm text-gray-600">

                  Timestamp

                </th>

              </tr>

            </thead>

            <tbody>

              {paginatedRecords.map((record) => (

                <tr
                  key={record.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >

                  <td className="px-6 py-4 text-sm text-gray-800">

                    {record.zone}

                  </td>

                  <td className="px-6 py-4 text-sm text-gray-800">

                    {record.temperature}°C

                  </td>

                  <td className="px-6 py-4 text-sm text-gray-800">

                    {record.humidity}%

                  </td>

                  <td className="px-6 py-4 text-sm text-gray-800">

                    {record.rain}%

                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">

                    {record.timestamp}

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