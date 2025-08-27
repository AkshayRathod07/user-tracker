"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeviceInfo from "@/components/DeviceInfo";

type UserData = {
  coords: { lat: number; lon: number };
  device: string;
  time: string;
  address?: string;
};

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [savedData, setSavedData] = useState<UserData | null>(null);

  //  Encapsulate location request in a function
  const requestLocation = useCallback(() => {
  if (!navigator.geolocation) {
    toast("Your browser does not support Geolocation API", { type: "error" });
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        const geoData = await res.json();

        const data: UserData = {
          coords: { lat, lon },
          device: navigator.userAgent,
          time: new Date().toISOString(),
          address: `${geoData.city || ""}, ${geoData.principalSubdivision || ""}, ${geoData.countryName || ""}`,
        };

        setUserData(data);
        setShowModal(true);
      } catch (e) {
        const errorMsg = typeof e === "object" && e !== null && "message" in e ? (e as { message: string }).message : String(e);
        toast(`Failed to fetch address details: ${errorMsg}`, { type: "error" });
      }
    },
    (err) => {
      let message = "Unknown error getting location";
      if (err.code === 1) message = "Permission denied. Please allow location access.";
      if (err.code === 2) message = "Location unavailable. Please try again.";
      if (err.code === 3) message = "Request timed out. Please refresh and retry.";

      toast(
        <div>
          <p>{message}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              toast.dismiss();
              requestLocation();
            }}
          >
            Retry
          </Button>
        </div>,
        { type: "error", autoClose: false }
      );
    },
    {
      enableHighAccuracy: true, // forces GPS/WiFi based positioning
      timeout: 10000,           // wait max 10s
      maximumAge: 0             // always request fresh
    }
  );
}, []);


  useEffect(() => {
    const existing = localStorage.getItem("userData");
    if (existing) {
      setSavedData(JSON.parse(existing));
      return;
    }
    requestLocation(); //  First call
  }, [requestLocation]);

  const handleConfirm = () => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
      setSavedData(userData);
    }
    setShowModal(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6"> User Tracking </h1>
      <ToastContainer />

      {savedData ? (
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="font-semibold mb-2">Your Data </h2>
          <p><b>Latitude:</b> {savedData.coords.lat}</p>
          <p><b>Longitude:</b> {savedData.coords.lon}</p>
          <p><b>Device:</b> {savedData.device}</p>
          <p><b>Timestamp:</b> {savedData.time}</p>
          <p><b>Address:</b> {savedData.address}</p>
        </div>
      ) : (
        <p>Waiting for location permission...</p>
      )}

      {/* Confirmation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Data</DialogTitle>
            <DialogDescription>
              We will save the following details securely:
            </DialogDescription>
          </DialogHeader>

          <DeviceInfo />

          {userData && (
            <div className="space-y-2 p-2 bg-gray-50 rounded-lg">
              {/* <p><b>Latitude:</b> {userData.coords.lat}</p>
              <p><b>Longitude:</b> {userData.coords.lon}</p> */}
              {/* <p><b>Device:</b> {userData.device}</p> */}
              <p><b>Time:</b> {userData.time}</p>
              <p><b>Address:</b> {userData.address}</p>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm & Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
