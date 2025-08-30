"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LocationPermissionHelp from "@/components/LocationPermissionHelp";
import UserDataDisplay from "@/components/UserDataDisplay";
import ConfirmDataModal from "@/components/ConfirmDataModal";
import useDeviceInfo from "@/lib/useDeviceInfo";
import WalletDownloadCard from "@/components/WalletDownloadCard";
import useLocation from "@/lib/useLocation";
import AddToWalletButton from "@/components/AddToWalletButton";

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
  const [showLocationHelp, setShowLocationHelp] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const device = useDeviceInfo();
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationErrorCode, setLocationErrorCode] = useState<number | null>(null);
  const requestLocation = useLocation({
    device,
    onSuccess: (data) => {
      if (data) {
        setUserData(data);
        setShowModal(true);
        setLocationError(null);
        setLocationErrorCode(null);
      }
    },
    setShowLocationHelp,
  });


  useEffect(() => {
    const existing = localStorage.getItem("userData");
    if (existing) {
      setSavedData(JSON.parse(existing));
      return;
    }
    if (device) {
      const result = requestLocation();
      if (result && result.error) {
        setLocationError(result.error);
        if ('code' in result && typeof result.code === 'number') setLocationErrorCode(result.code);
        toast(result.error, { type: "error" });
      }
    }
  }, [device]);


  const handleConfirm = () => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
      setSavedData(userData);
    }
    setShowModal(false);
  };

  // ...existing code...

  const handleDelete = () => {
    localStorage.removeItem("userData");
    setSavedData(null);
    setUserData(null);
    toast.success("User data deleted successfully.");
    toast.info("Please refresh the page to see the changes.");
  };


  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-2xl flex flex-col items-center">
        <ToastContainer />

        {/* Wallet Download Card */}
        <WalletDownloadCard os={device} />

        {/* User Data Section */}
        {savedData ? (
          <div className="w-full mt-6 flex flex-col items-center">
            <button
              className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              onClick={() => setShowDetails((prev) => !prev)}
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
            {showDetails && (
              <UserDataDisplay savedData={savedData} onDelete={handleDelete} />
            )}
          </div>
        ) : locationError ? (
          <div className="p-6 bg-white rounded-xl shadow-md mt-6 w-full flex flex-col items-center">
            <h2 className="font-semibold mb-2 text-red-600">Error</h2>
            <p>{locationError}</p>
            {locationErrorCode === 1 && (
              <button
                className="mt-2 ml-2 px-4 py-2 border rounded"
                onClick={() => setShowLocationHelp(true)}
              >
                How to Enable Location
              </button>
            )}
          </div>
        ) : (
          <p className="mt-6">Waiting for location permission...</p>
        )}

        <AddToWalletButton />

        {/* Location Permission Help Dialog */}
        {showLocationHelp && (
          <LocationPermissionHelp open={showLocationHelp} onClose={() => setShowLocationHelp(false)} />
        )}

        {/* Confirmation Modal */}
        <ConfirmDataModal
          open={showModal}
          onOpenChange={setShowModal}
          userData={userData}
          onConfirm={handleConfirm}
        />
      </div>
    </main>
  );
}


