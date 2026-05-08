// ==========================================
// ADMIN FILE
// src/app/components/admin/Reports.tsx
// ==========================================

import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

import { db } from "../../../firebase/firebase";

import {
  FileText,
  Download,
  Eye,
  Calendar
} from "lucide-react";

export function Reports() {

  const [reports, setReports] =
    useState<any[]>([]);

  const [filteredReports, setFilteredReports] =
    useState<any[]>([]);

  const [zones, setZones] =
    useState<string[]>([]);

  const [selectedZone, setSelectedZone] =
    useState("All Zones");

  const [selectedType, setSelectedType] =
    useState("All Types");

  const [selectedDate, setSelectedDate] =
    useState("All Time");

  // =====================================
  // FETCH ZONES
  // =====================================

  useEffect(() => {

    const unsubscribe =
      onSnapshot(

        collection(
          db,
          "zones_list"
        ),

        (snapshot) => {

          const zoneData =
            snapshot.docs.map(
              (doc) =>
                doc.data().name
            );

          setZones(zoneData);

        }

      );

    return () =>
      unsubscribe();

  }, []);

  // =====================================
  // FETCH REPORTS
  // =====================================

  useEffect(() => {

    const q = query(

      collection(db, "reports"),

      orderBy(
        "createdAt",
        "desc"
      )

    );

    const unsubscribe =
      onSnapshot(

        q,

        (snapshot) => {

          const reportData =
            snapshot.docs.map(
              (doc) => ({

                id: doc.id,

                ...doc.data()

              })
            );

          setReports(
            reportData
          );

          setFilteredReports(
            reportData
          );

        }

      );

    return () =>
      unsubscribe();

  }, []);

  // =====================================
  // FILTERING
  // =====================================

  useEffect(() => {

    let filtered =
      [...reports];

    // Zone Filter

    if (
      selectedZone !==
      "All Zones"
    ) {

      filtered =
        filtered.filter(

          (report) =>

            report.zone ===
            selectedZone

        );

    }

    // Type Filter

    if (
      selectedType !==
      "All Types"
    ) {

      filtered =
        filtered.filter(

          (report) =>

            report.reportType ===
            selectedType

        );

    }

    // Date Filter

    if (
      selectedDate !==
      "All Time"
    ) {

      const now =
        new Date();

      filtered =
        filtered.filter(
          (report) => {

            const reportDate =
              new Date(
                report.date
              );

            const diff =
              now.getTime() -
              reportDate.getTime();

            if (
              selectedDate ===
              "Last 7 Days"
            ) {

              return (
                diff <
                7 *
                  24 *
                  60 *
                  60 *
                  1000
              );

            }

            if (
              selectedDate ===
              "Last 30 Days"
            ) {

              return (
                diff <
                30 *
                  24 *
                  60 *
                  60 *
                  1000
              );

            }

            return true;

          }
        );

    }

    setFilteredReports(
      filtered
    );

  }, [

    reports,
    selectedZone,
    selectedType,
    selectedDate

  ]);

  // =====================================
  // STATISTICS
  // =====================================

  const totalReports =
    reports.length;

  const thisMonth =
    reports.filter(
      (report: any) => {

        const reportDate =
          new Date(
            report.date
          );

        const now =
          new Date();

        return (

          reportDate.getMonth() ===
            now.getMonth() &&

          reportDate.getFullYear() ===
            now.getFullYear()

        );

      }
    ).length;

  // =====================================
  // DOWNLOAD TXT
  // =====================================

  const downloadReport =
    (report: any) => {

      const content =

        `ZooCast Weather Report\n\n` +

        `Title: ${report.title}\n` +

        `Type: ${report.reportType}\n` +

        `Zone: ${report.zone}\n` +

        `Date: ${report.date}\n` +

        `Submitted By: ${report.submittedBy}\n\n` +

        `Observation:\n${report.observation}\n\n` +

        `Action Taken:\n${report.action}`;

      const blob =
        new Blob(

          [content],

          {

            type:
              "text/plain"

          }

        );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;

      a.download =
        `${report.title}.txt`;

      a.click();

      window.URL.revokeObjectURL(
        url
      );

    };

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <h2 className="text-2xl text-gray-800">

          Reports

        </h2>

      </div>

      {/* FILTER SECTION */}

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">

        <h3 className="text-lg text-gray-800 mb-4">

          Filter Reports

        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* REPORT TYPE */}

          <div>

            <label className="block text-sm text-gray-700 mb-2">

              Report Type

            </label>

            <select

              value={
                selectedType
              }

              onChange={(e) =>

                setSelectedType(
                  e.target.value
                )

              }

              className="w-full px-4 py-2 border border-gray-300 rounded-lg"

            >

              <option>
                All Types
              </option>

              <option>
                Weekly Summary
              </option>

              <option>
                Monthly Analysis
              </option>

              <option>
                Quarterly Report
              </option>

              <option>
                Alert Summary
              </option>

              <option>
                Custom Report
              </option>

            </select>

          </div>

          {/* ZONE */}

          <div>

            <label className="block text-sm text-gray-700 mb-2">

              Zone

            </label>

            <select

              value={
                selectedZone
              }

              onChange={(e) =>

                setSelectedZone(
                  e.target.value
                )

              }

              className="w-full px-4 py-2 border border-gray-300 rounded-lg"

            >

              <option>
                All Zones
              </option>

              {zones.map(
                (zone) => (

                  <option
                    key={zone}
                  >

                    {zone}

                  </option>

                )
              )}

            </select>

          </div>

          {/* DATE */}

          <div>

            <label className="block text-sm text-gray-700 mb-2">

              Date Range

            </label>

            <select

              value={
                selectedDate
              }

              onChange={(e) =>

                setSelectedDate(
                  e.target.value
                )

              }

              className="w-full px-4 py-2 border border-gray-300 rounded-lg"

            >

              <option>
                All Time
              </option>

              <option>
                Last 7 Days
              </option>

              <option>
                Last 30 Days
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* REPORT CARDS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {filteredReports.map(
          (report) => (

            <div

              key={report.id}

              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"

            >

              <div className="flex items-start justify-between mb-4">

                <div className="flex items-start space-x-3">

                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">

                    <FileText className="w-5 h-5 text-blue-600" />

                  </div>

                  <div>

                    <h4 className="text-sm text-gray-800 mb-1">

                      {report.title}

                    </h4>

                    <p className="text-xs text-gray-600">

                      Submitted by:
                      {" "}
                      {report.submittedBy}

                    </p>

                  </div>

                </div>

              </div>

              <div className="space-y-2 mb-4">

                <div className="flex items-center text-xs text-gray-600">

                  <Calendar className="w-4 h-4 mr-2" />

                  <span>

                    {report.date}

                  </span>

                </div>

                <p className="text-xs">

                  <strong>

                    Zone:
                  </strong>

                  {" "}
                  {report.zone}

                </p>

                <p className="text-xs">

                  <strong>

                    Type:
                  </strong>

                  {" "}
                  {report.reportType}

                </p>

              </div>

              <div className="mb-4">

                <p className="text-xs font-semibold text-gray-700 mb-1">

                  Observation

                </p>

                <p className="text-xs text-gray-600">

                  {report.observation}

                </p>

              </div>

              <div className="mb-4">

                <p className="text-xs font-semibold text-gray-700 mb-1">

                  Action Taken

                </p>

                <p className="text-xs text-gray-600">

                  {report.action}

                </p>

              </div>

              {/* BUTTONS */}

              <div className="flex space-x-2 pt-4 border-t border-gray-200">

                {/* PREVIEW */}

                <button

                  onClick={() => {

                    alert(

                      `REPORT PREVIEW\n\n` +

                      `Title: ${report.title}\n\n` +

                      `Zone: ${report.zone}\n\n` +

                      `Type: ${report.reportType}\n\n` +

                      `Observation:\n${report.observation}\n\n` +

                      `Action:\n${report.action}`

                    );

                  }}

                  className="flex-1 flex items-center justify-center space-x-2 text-sm text-blue-600 border border-blue-200 px-3 py-2 rounded-lg"

                >

                  <Eye className="w-4 h-4" />

                  <span>

                    Preview

                  </span>

                </button>

                {/* DOWNLOAD */}

                <button

                  onClick={() =>
                    downloadReport(
                      report
                    )
                  }

                  className="flex-1 flex items-center justify-center space-x-2 text-sm bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-2 rounded-lg"

                >

                  <Download className="w-4 h-4" />

                  <span>

                    Download

                  </span>

                </button>

              </div>

            </div>

          )
        )}

      </div>

      {/* REPORT STATS */}

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">

        <h3 className="text-lg text-gray-800 mb-4">

          Report Statistics

        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div>

            <p className="text-sm text-gray-600 mb-1">

              Total Reports

            </p>

            <h3 className="text-2xl text-gray-800">

              {totalReports}

            </h3>

          </div>

          <div>

            <p className="text-sm text-gray-600 mb-1">

              This Month

            </p>

            <h3 className="text-2xl text-gray-800">

              {thisMonth}

            </h3>

          </div>

          <div>

            <p className="text-sm text-gray-600 mb-1">

              Filtered Results

            </p>

            <h3 className="text-2xl text-gray-800">

              {filteredReports.length}

            </h3>

          </div>

          <div>

            <p className="text-sm text-gray-600 mb-1">

              Downloads

            </p>

            <h3 className="text-2xl text-gray-800">

              0

            </h3>

          </div>

        </div>

      </div>

    </div>

  );

}