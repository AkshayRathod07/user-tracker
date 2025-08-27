export function getDeviceType () {
  const userAgent = navigator.userAgent;

  console.log("User Agent:", userAgent);

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "iOS";
  }

  return "unknown";
}

export async function getUserLocation(): Promise<{lat: number, lng: number} | null> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Location error:", err);
        resolve(null);
      }
    );
  });
}

