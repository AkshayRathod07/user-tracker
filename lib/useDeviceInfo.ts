import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";

export default function useDeviceInfo() {
  const [device, setDevice] = useState("");

  useEffect(() => {
    const result = UAParser();
    const os = result.os?.name ? `${result.os.name} ${result.os.version || ''}` : '';
    const browser = result.browser?.name ? `${result.browser.name} ${result.browser.version || ''}` : '';
    const deviceType = result.device?.type ? `${result.device.type}` : '';
    const deviceString = [os, browser, deviceType].filter(Boolean).join(' | ');
    setDevice(deviceString);
  }, []);

  return device;
}
