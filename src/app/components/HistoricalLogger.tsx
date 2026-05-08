import { useEffect } from "react";

import {
  collection,
  addDoc,
  onSnapshot,
  doc
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export function HistoricalLogger() {

  // ==========================================
  // ZONES
  // ==========================================

  const zones = [

    "Aquatic Zone",

    "Bird Zone",

    "Cat Habitat",

    "Primate Section",

    "Reptile Area",

    "Savannah Zone"

  ];

  useEffect(() => {

    const realtimeData:
      Record<string, any> = {};

    // ==========================================
    // LISTEN TO ZONES
    // ==========================================

    const unsubscribes =
      zones.map((zone) => {

        return onSnapshot(

          doc(
            db,
            "zones",
            zone
          ),

          (snapshot) => {

            if (
              snapshot.exists()
            ) {

              realtimeData[zone] =
                snapshot.data();

              console.log(
                `📡 Listening: ${zone}`
              );

            }

          }

        );

      });

    // ==========================================
    // LOGGER LOOP
    // ==========================================

    const interval =
      setInterval(

        async () => {

          try {

            for (
              const zone of zones
            ) {

              const weatherData =
                realtimeData[zone];

              if (
                !weatherData
              ) continue;

              // ==========================================
              // DEVICE OFF DETECTION
              // ==========================================

              const now =
                Math.floor(
                  Date.now() / 1000
                );

              const lastUpdated =
                Number(
                  weatherData.lastUpdated || 0
                );

              // ==========================================
              // DEVICE TIMEOUT
              // 90 SECONDS
              // ==========================================

              const isDeviceOnline =

                now -
                lastUpdated <= 90;

              if (
                !isDeviceOnline
              ) {

                console.log(
                  `❌ DEVICE OFF: ${zone}`
                );

                continue;

              }

              // ==========================================
              // TIMESTAMP
              // ==========================================

              const currentTimestamp =

                new Date().toLocaleString(

                  "en-MY",

                  {

                    year: "numeric",

                    month: "2-digit",

                    day: "2-digit",

                    hour: "2-digit",

                    minute: "2-digit",

                    second: "2-digit",

                    hour12: true

                  }

                );

              // ==========================================
              // SAVE HISTORICAL DATA
              // ==========================================

              await addDoc(

                collection(
                  db,
                  "historical_data"
                ),

                {

                  zone: zone,

                  temperature:
                    Number(
                      weatherData.temperature || 0
                    ),

                  humidity:
                    Number(
                      weatherData.humidity || 0
                    ),

                  pressure:
                    Number(
                      weatherData.pressure || 0
                    ),

                  gas:
                    Number(
                      weatherData.gas || 0
                    ),

                  rain:
                    Number(
                      weatherData.rain || 0
                    ),

                  timestamp:
                    currentTimestamp,

                  createdAt:
                    Date.now()

                }

              );

              console.log(
                `✅ SAVED: ${zone}`
              );

            }

          }

          catch (error) {

            console.log(
              "❌ LOGGER ERROR:",
              error
            );

          }

        },

        60000

      );

    return () => {

      clearInterval(
        interval
      );

      unsubscribes.forEach(

        (unsubscribe) =>
          unsubscribe()

      );

    };

  }, []);

  return null;

}