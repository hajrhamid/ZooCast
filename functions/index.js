const functions = require("firebase-functions");

const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.saveHistoricalData =

functions.firestore

.document("zones/{zoneId}")

.onUpdate(async (change, context) => {

  const newData =
    change.after.data();

  // DEVICE OFF
  if (
    !newData ||
    !newData.timestamp
  ) {

    return null;

  }

  try {

    await db.collection(

      "historical_data"

    ).add({

      zone:
        context.params.zoneId,

      temperature:
        newData.temperature || 0,

      humidity:
        newData.humidity || 0,

      pressure:
        newData.pressure || 0,

      gas:
        newData.gas || 0,

      rain:
        newData.rain || 0,

      timestamp:
        new Date()
          .toLocaleString(),

      createdAt:
        admin.firestore.FieldValue.serverTimestamp()

    });

    console.log(
      "Historical data saved"
    );

  }

  catch (error) {

    console.log(error);

  }

  return null;

});