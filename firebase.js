import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  query, 
  orderBy, 
  limit,
  onSnapshot,
  where,
  GeoPoint
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyADJaaIfG9_Yvr-k7eHQ8VyjZuKg9BSAOk",
  authDomain: "semproj-7100a.firebaseapp.com",
  projectId: "semproj-7100a",
  storageBucket: "semproj-7100a.firebasestorage.app",
  messagingSenderId: "1010777842976",
  appId: "1:1010777842976:web:343054a0d7071916126345"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Real-time flood data listener
export function getRealTimeFloodData(callback) {
  const q = query(
    collection(db, "floodData"),
    orderBy("timestamp", "desc"),
    limit(1)
  );

  return onSnapshot(q, (snapshot) => {
    snapshot.forEach((doc) => {
      callback({
        id: doc.id,
        ...doc.data()
      });
    });
  });
}

// Get historical data for charts
export function getHistoricalData(days, callback) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const q = query(
    collection(db, "floodData"),
    where("timestamp", ">=", startDate),
    where("timestamp", "<=", endDate),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const data = [];
    snapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(data);
  });
}

// Update alert status in Firestore
export async function updateAlertStatus(deviceId, status) {
  try {
    await updateDoc(doc(db, "floodData", deviceId), {
      alertStatus: status
    });
  } catch (error) {
    console.error("Error updating alert status:", error);
  }
}

export { db, auth, GeoPoint };