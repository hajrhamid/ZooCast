// ==========================================
// src/app/components/staff/WeatherReports.tsx
// FINAL USER-SPECIFIC REPORT VERSION
// EACH USER ONLY SEES THEIR OWN REPORTS
// ==========================================

import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";

import {
  Plus,
  Pencil,
  Trash2
} from "lucide-react";

import { db } from "../../firebase/firebase";

export function WeatherReports() {

  // ==========================================
  // STATES
  // ==========================================

  const [reports, setReports] =
    useState<any[]>([]);

  const [zones, setZones] =
    useState<string[]>([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState("");

  const [editingData, setEditingData] =
    useState<any>(null);

  // ==========================================
  // CURRENT LOGIN USER
  // ==========================================

  const currentUser =
    localStorage.getItem(
      "staffID"
    ) || "";

  console.log(
    "CURRENT LOGIN USER:",
    currentUser
  );

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] =
    useState({

      title: "",

      reportType:
        "Weekly Summary",

      zone: "",

      observation: "",

      action: "",

      date:
        new Date()
          .toISOString()
          .split("T")[0]

    });

  // ==========================================
  // FETCH ZONES
  // ==========================================

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

          if (
            zoneData.length > 0
          ) {

            setFormData(
              (prev) => ({

                ...prev,

                zone:
                  zoneData[0]

              })
            );

          }

        }

      );

    return () =>
      unsubscribe();

  }, []);

  // ==========================================
  // FETCH REPORTS
  // ONLY FETCH REPORTS
  // CREATED BY CURRENT USER
  // ==========================================

  useEffect(() => {

    if (!currentUser)
      return;

    const q = query(

      collection(
        db,
        "reports"
      ),

      where(
        "submittedBy",
        "==",
        currentUser
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

          // SORT LATEST FIRST

          reportData.sort(
            (a: any, b: any) => {

              const aTime =
                a.createdAt?.seconds
                  ? a.createdAt.seconds * 1000
                  : 0;

              const bTime =
                b.createdAt?.seconds
                  ? b.createdAt.seconds * 1000
                  : 0;

              return bTime - aTime;

            }
          );

          setReports(
            reportData
          );

        },

        (error) => {

          console.error(
            "FETCH REPORT ERROR:",
            error
          );

        }

      );

    return () =>
      unsubscribe();

  }, [currentUser]);

  // ==========================================
  // STATS
  // ==========================================

  const totalReports =
    reports.length;

  const yourReports =
    reports.length;

  const thisWeek =
    reports.filter(
      (report: any) => {

        const reportDate =
          new Date(
            report.date
          );

        const now =
          new Date();

        const diff =
          now.getTime() -
          reportDate.getTime();

        return (
          diff <
          7 *
            24 *
            60 *
            60 *
            1000
        );

      }
    ).length;

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

  // ==========================================
  // SUBMIT REPORT
  // ==========================================

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        if (!currentUser) {

          alert(
            "No user login detected"
          );

          return;

        }

        await addDoc(

          collection(
            db,
            "reports"
          ),

          {

            ...formData,

            submittedBy:
              currentUser,

            createdAt:
              serverTimestamp()

          }

        );

        alert(
          "Report submitted successfully!"
        );

        setShowForm(false);

        setFormData({

          title: "",

          reportType:
            "Weekly Summary",

          zone:
            zones[0] || "",

          observation: "",

          action: "",

          date:
            new Date()
              .toISOString()
              .split("T")[0]

        });

      } catch (error) {

        console.error(
          "SUBMIT REPORT ERROR:",
          error
        );

        alert(
          "Failed to submit report"
        );

      }

    };

  // ==========================================
  // DELETE REPORT
  // ==========================================

  const handleDelete =
  async (
    id: string
  ) => {

    try {

      if (!id) {

        alert(
          "Report ID not found"
        );

        return;

      }

      const confirmDelete =
        window.confirm(
          "Delete this report?"
        );

      if (!confirmDelete)
        return;

      console.log(
        "DELETING REPORT:",
        id
      );

      await deleteDoc(

        doc(
          db,
          "reports",
          id
        )

      );

      alert(
        "Report deleted successfully"
      );

    }

    catch (error) {

      console.error(
        "DELETE ERROR:",
        error
      );

      alert(
        "Failed to delete report"
      );

    }

  };

  // ==========================================
  // EDIT REPORT
  // ==========================================

  const handleEdit =
    (
      report: any
    ) => {

      setEditingId(
        report.id
      );

      setEditingData(
        report
      );

    };

  // ==========================================
  // UPDATE REPORT
  // ==========================================

  const handleUpdate =
    async () => {

      try {

        await updateDoc(

          doc(
            db,
            "reports",
            editingId
          ),

          {

            title:
              editingData.title,

            reportType:
              editingData.reportType,

            zone:
              editingData.zone,

            observation:
              editingData.observation,

            action:
              editingData.action

          }

        );

        setEditingId("");

      } catch (error) {

        console.error(
          "UPDATE ERROR:",
          error
        );

      }

    };

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-gray-800">
            Weather Reports
          </h2>

          <p className="text-gray-500">
            Create and manage your weather reports
          </p>

        </div>

        <button

          onClick={() =>
            setShowForm(
              !showForm
            )
          }

          className="px-5 py-3 bg-orange-600 text-white rounded-xl flex items-center gap-2"

        >

          <Plus className="w-5 h-5" />

          New Report

        </button>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p>Total Reports</p>
          <h2 className="text-3xl font-bold">
            {totalReports}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p>This Week</p>
          <h2 className="text-3xl font-bold">
            {thisWeek}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p>This Month</p>
          <h2 className="text-3xl font-bold">
            {thisMonth}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p>Your Reports</p>
          <h2 className="text-3xl font-bold">
            {yourReports}
          </h2>
        </div>

      </div>

      {/* FORM */}

      {showForm && (

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-sm space-y-4"
        >

          <input
            type="text"
            placeholder="Report Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title:
                  e.target.value
              })
            }
            className="w-full border p-3 rounded-lg"
            required
          />

          <select
            value={
              formData.reportType
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                reportType:
                  e.target.value
              })
            }
            className="w-full border p-3 rounded-lg"
          >

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

          <select
            value={formData.zone}
            onChange={(e) =>
              setFormData({
                ...formData,
                zone:
                  e.target.value
              })
            }
            className="w-full border p-3 rounded-lg"
          >

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

          <textarea
            placeholder="Observation"
            value={
              formData.observation
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                observation:
                  e.target.value
              })
            }
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            placeholder="Action Taken"
            value={
              formData.action
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                action:
                  e.target.value
              })
            }
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            className="bg-orange-600 text-white px-5 py-3 rounded-lg"
          >
            Submit Report
          </button>

        </form>

      )}

      {/* REPORT LIST */}

      <div className="space-y-4">

        {reports.length === 0 && (

          <div className="bg-white p-6 rounded-xl shadow-sm text-center text-gray-500">
            No reports found for this user
          </div>

        )}

        {reports.map(
          (report: any) => (

            <div
              key={report.id}
              className="bg-white p-6 rounded-xl shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-xl font-bold">
                    {report.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {report.reportType}
                  </p>

                </div>

                <p className="text-sm text-gray-400">
                  {report.date}
                </p>

              </div>

              <div className="mt-4 space-y-2">

                <p>
                  <b>Zone:</b>
                  {" "}
                  {report.zone}
                </p>

                <p>
                  <b>Submitted By:</b>
                  {" "}
                  {report.submittedBy}
                </p>

                <p>
                  <b>Observation:</b>
                  {" "}
                  {report.observation}
                </p>

                <p>
                  <b>Action Taken:</b>
                  {" "}
                  {report.action}
                </p>

              </div>

              <div className="flex gap-3 mt-5">

                <button

                  onClick={() =>
                    handleEdit(
                      report
                    )
                  }

                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"

                >

                  <Pencil className="w-4 h-4" />

                  Edit

                </button>

                <button

                  onClick={() =>
                    handleDelete(
                      report.id
                    )
                  }

                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg"

                >

                  <Trash2 className="w-4 h-4" />

                  Delete

                </button>

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

}