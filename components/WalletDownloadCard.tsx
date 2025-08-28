import React from "react";

interface Props {
  os: string;
}

const WalletDownloadCard: React.FC<Props> = ({ os }) => {
  let title = "";
  let link = "";
  let buttonText = "";

  if (os.toLowerCase().includes("mac") || os.toLowerCase().includes("ios")) {
    title = "Download Apple Wallet";
    link = "https://apps.apple.com/us/app/apple-wallet/id1160481993";
    buttonText = "Go to App Store";
  } else if (os.toLowerCase().includes("android")) {
    title = "Download Google Wallet";
    link = "https://play.google.com/store/apps/details?id=com.google.android.apps.walletnfcrel&hl=en_IN&pli=1";
    buttonText = "Go to Play Store";
  } else {
    return null;
  }

  return (
    <div className="p-4 bg-blue-50 rounded-xl shadow-md mt-6 flex flex-col items-center">
      <h3 className="font-semibold mb-2 text-lg">{title}</h3>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          {buttonText}
        </button>
      </a>
    </div>
  );
};

export default WalletDownloadCard;
