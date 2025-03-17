import { useState, useEffect, useCallback } from "react";
import { db } from '../firebase';
interface AppConfig {
  appName: string;
  theme: string;
  version: string;
  apiBaseUrl: string;
  sidebarLogo:string;
  [key: string]: any; // Allow additional properties
}

const LOCAL_STORAGE_KEY = "appConfig";
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

export const useAppConfig = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check local storage first
      const storedConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
      const storedTimestamp = localStorage.getItem(`${LOCAL_STORAGE_KEY}_timestamp`);

      if (storedConfig && storedTimestamp) {
        const lastFetchTime = parseInt(storedTimestamp, 10);
        if (Date.now() - lastFetchTime < CACHE_EXPIRY_TIME) {
          setConfig(JSON.parse(storedConfig));
          setLoading(false);
          return;
        }
      }

      // Fetch from Firebase Firestore
      
      const docRef = db.collection("CONFIG").doc("APP_CONFIG"); // Update collection/doc name
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        const data = docSnap.data() as AppConfig;
        setConfig(data);

        // Store in local storage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_timestamp`, Date.now().toString());
      } else {
        throw new Error("Config document does not exist.");
      }
    } catch (error) {
      console.error("Error fetching config:", error);
      setError("Failed to load configuration.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading, error, refetch: fetchConfig };
};
