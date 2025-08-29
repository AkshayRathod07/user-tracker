import { useCallback } from "react";

type UserData = {
  coords: { lat: number; lon: number };
  device: string;
  time: string;
  address?: string;
};

type LocationOptions = {
  device: string;
  onSuccess: (data: UserData) => void;
  onError?: () => void;
  setShowLocationHelp: (show: boolean) => void;
};

export default function useLocation({ device, onSuccess, setShowLocationHelp }: LocationOptions) {
    // Memoize the requestLocation function so it is stable across renders
    const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      onSuccess(null);
      return { error: "Your browser does not support Geolocation API" };
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const geoData = await res.json();
          const data: UserData = {
            coords: { lat, lon },
            device,
            time: new Date().toISOString(),
            address: geoData.display_name || "Address not found",
          };
          onSuccess(data);
        } catch (e) {
          const errorMsg = typeof e === "object" && e !== null && "message" in e ? (e as { message: string }).message : String(e);
          onSuccess(null);
          return { error: `Failed to fetch address details: ${errorMsg}` };
        }
      },
      (err) => {
        let message = "Unknown error getting location";
        if (err.code === 1) message = "Permission denied. Please allow location access.";
        if (err.code === 2) message = "Location unavailable. Please try again.";
        if (err.code === 3) message = "Request timed out. Please refresh and retry.";
        onSuccess(null);
        return { error: message, code: err.code };
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
    return {};
    }, [device, onSuccess]);
    return requestLocation;
}
