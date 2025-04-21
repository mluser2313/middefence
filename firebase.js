import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  query, 
  where,
  onSnapshot,
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

// Real-time shuttle tracking
export function getRealTimeShuttleData(callback) {
  const q = query(collection(db, "shuttles"), where("status", "==", "active"));

  return onSnapshot(q, (snapshot) => {
    const shuttles = [];
    snapshot.forEach((doc) => {
      shuttles.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(shuttles);
  });
}

// Shuttle utilization history
export function getShuttleHistory(days, callback) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const q = query(
    collection(db, "shuttleHistory"),
    where("timestamp", ">=", startDate),
    where("timestamp", "<=", endDate)
  );

  return onSnapshot(q, (snapshot) => {
    const data = [];
    snapshot.forEach((doc) => {
      data.push(doc.data());
    });
    callback(data);
  });
}

// Update seat availability
export async function updateSeatAvailability(shuttleId, seats) {
  try {
    await updateDoc(doc(db, "shuttles", shuttleId), {
      availableSeats: seats
    });
  } catch (error) {
    console.error("Error updating seats:", error);
  }
}

// User authentication functions
export async function loginUser(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export { db, auth, GeoPoint };