import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  GeoPoint,
  addDoc,
  doc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

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
      shuttles.push({ id: doc.id, ...doc.data() });
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

// Mark attendance via QR
export async function markAttendance(studentId, shuttleId) {
  try {
    await addDoc(collection(db, "attendance"), {
      studentId,
      shuttleId,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
  }
}

// Get route for a shuttle
export async function getRoute(shuttleId) {
  const routeDoc = await getDoc(doc(db, "routes", shuttleId));
  return routeDoc.exists() ? routeDoc.data() : null;
}

// User auth
export async function loginUser(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// Get user role
export async function getUserRole(userId) {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists() ? userDoc.data().role : null;
}

export { db, auth, GeoPoint };
