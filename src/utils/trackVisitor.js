import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function trackVisitor(pageName = "unknown") {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const geoData = await response.json();

    await addDoc(collection(db, "analytics"), {
      page: pageName,
      ip: geoData.ip,
      country: geoData.country_name,
      country_code: geoData.country_code,
      city: geoData.city || "Unknown",
      region: geoData.region || "Unknown",
      latitude: geoData.latitude,
      longitude: geoData.longitude,
      timezone: geoData.timezone,
      isp: geoData.org || "Unknown",
      userAgent: navigator.userAgent,
      referrer: document.referrer || "direct",
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Analytics unavailable:", error.message);
  }
}
