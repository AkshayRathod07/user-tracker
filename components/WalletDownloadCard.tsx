import React from "react";

interface Props {
  os: string;
}

const WalletDownloadCard: React.FC<Props> = ({ os }) => {
  // console.log("OS detected:", os);
  let title = "";
  let link = "";

  if (os.toLowerCase().includes("mac") || os.toLowerCase().includes("ios")) {
    title = "Download Apple Wallet";
    link = "https://apps.apple.com/us/app/apple-wallet/id1160481993";
  } else if (os.toLowerCase().includes("android") || os.toLowerCase().includes("windows")) {
    title = "Download Google Wallet";
    link = "https://play.google.com/store/apps/details?id=com.google.android.apps.walletnfcrel&hl=en_IN&pli=1";
  } else {
    return null;
  }
  
    // Deep links for Apple Wallet and Google Wallet
    const appleWalletDeepLink = "applewallet://";
    const googleWalletDeepLink = "intent://wallet#Intent;scheme=android;package=com.google.android.apps.walletnfcrel;end";

    // Handler for open/fallback logic
    const handleOpenOrStore = () => {
      let deepLink = "";
    const storeLink = link;
      if (title === "Download Apple Wallet") {
        deepLink = appleWalletDeepLink;
      } else if (title === "Download Google Wallet") {
        deepLink = googleWalletDeepLink;
      }
      // Try to open app
      window.location.href = deepLink;
      // Fallback to store after 1 second
      setTimeout(() => {
        window.open(storeLink, "_blank");
      }, 1000);
    };

  return (
    <div className="p-4 bg-blue-50 rounded-xl shadow-md mt-6 flex flex-col items-center">
      <h3 className="font-semibold mb-2 text-lg">{title}</h3>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={handleOpenOrStore}
      >
        {title === "Download Apple Wallet" ? "Open Apple Wallet / Go to App Store" : "Open Google Wallet / Go to Play Store"}
      </button>
    </div>
  );
};

export default WalletDownloadCard;
