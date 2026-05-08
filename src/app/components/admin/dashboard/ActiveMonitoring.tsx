import { useState } from 'react';

import {
  MapPin,
  Check
} from 'lucide-react';

import {
  doc,
  setDoc
} from "firebase/firestore";

import {
  db
} from "../../../firebase/firebase";

interface ActiveMonitoringProps {
  currentZone: string;
  onZoneChange: (zone: string) => void;
}

const zones = [
  'Bird Zone',
  'Reptile Area',
  'Cat Habitat',
  'Savannah Zone',
  'Aquatic Zone',
  'Primate Section'
];

export function ActiveMonitoring({

  currentZone,
  onZoneChange

}: ActiveMonitoringProps) {

  const [selectedZone, setSelectedZone] =
    useState(currentZone);

  const handleUpdateZone = async () => {

    try {

      // UPDATE LOCAL STATE
      onZoneChange(selectedZone);

      // SAVE TO FIREBASE
      await setDoc(
        doc(db, "system", "activeZone"),
        {
          zone: selectedZone,
          updatedAt: new Date()
        }
      );

      alert("Active zone updated!");

    }

    catch (error) {

      console.log(error);

      alert("Failed to update zone");

    }

  };

  return (

    <div className="space-y-6">

      <h2 className="text-2xl text-gray-800">
        Active Monitoring Zone
      </h2>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">

        <div className="flex items-center space-x-3 mb-6">

          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">

            <MapPin className="w-6 h-6 text-emerald-600" />

          </div>

          <div>

            <p className="text-sm text-gray-600">
              Currently Monitoring
            </p>

            <h3 className="text-xl text-gray-800">
              {currentZone}
            </h3>

          </div>

        </div>

        <div className="border-t border-gray-200 pt-6">

          <h4 className="text-sm text-gray-700 mb-4">
            Select Active Monitoring Zone
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

            {zones.map((zone) => (

              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedZone === zone
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 bg-white hover:border-emerald-300'
                }`}
              >

                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-800">
                    {zone}
                  </span>

                  {selectedZone === zone && (

                    <Check className="w-5 h-5 text-emerald-600" />

                  )}

                </div>

              </button>

            ))}

          </div>

          <button
            onClick={handleUpdateZone}
            className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
          >

            Update Active Zone

          </button>

        </div>

      </div>

      {/* Zone Information */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">

        <h4 className="text-lg text-gray-800 mb-4">
          Zone Information: {selectedZone}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>

            <p className="text-sm text-gray-600 mb-1">
              Total Sensors
            </p>

            <p className="text-2xl text-gray-800">
              12
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-600 mb-1">
              Active Alerts
            </p>

            <p className="text-2xl text-gray-800">
              2
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-600 mb-1">
              Last Data Sync
            </p>

            <p className="text-2xl text-gray-800">
              30s
            </p>

          </div>

        </div>

      </div>

      {/* Zone Map Preview */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">

        <h4 className="text-lg text-gray-800 mb-4">
          Zone Layout
        </h4>

        <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center h-64">

          <div className="text-center">

            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />

            <p className="text-gray-600">
              Zone Map Visualization
            </p>

            <p className="text-sm text-gray-500">
              {selectedZone}
            </p>

          </div>

        </div>

      </div>

    </div>

  );
}