// DeviceInfo.tsx
"use client";
import React, { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";

export default function DeviceInfo() {
  const [device, setDevice] = useState<any>(null);

  useEffect(() => {
    const result = UAParser();
    setDevice(result);
  }, []);

  if (!device) return <p>Loading device info...</p>;

  return (
    <div className="p-4 rounded-xl shadow-md bg-white">
      <h2 className="font-bold text-lg mb-2">Device Info</h2>
      <p><strong>Browser:</strong> {device.browser.name} {device.browser.version}</p>
      <p><strong>OS:</strong> {device.os.name} {device.os.version}</p>
      <p><strong>Device:</strong> {device.device.model || "Desktop"}</p>
    </div>
  );
}
