"use client";
import { useState } from "react";

import { getDeviceType, getUserLocation } from "@/utils/detectDevice";

export default function AddToWalletButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    const device = getDeviceType();
    const location = await getUserLocation();

    console.log("User device:", device);
    console.log("User location:", location);

    // if (device === "Android") {
    //   // Example: redirect to Google Wallet Pass
    //   window.location.href = "https://pay.google.com/gp/v/save/EXAMPLE_PASS_ID";
    // } else if (device === "iOS") {
    //   // Example: redirect to Apple Wallet pass (.pkpass file)
    //   window.location.href = "https://example.com/your-pass.pkpass";
    // } else {
    //   alert("Please open on a mobile device (Android/iOS).");
    // }

    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-600 text-white rounded-md"
      disabled={loading}
    >
      {loading ? "Checking..." : "Add to Wallet"}
    </button>
  );
}
