"use client";

export default function AddToWalletButton() {
  const handleAddToWallet = async () => {
    const res = await fetch("/api/wallet/event/android");
    const data = await res.json();
    console.log("add wallet", data);

    if (data.saveUrl) {
      window.open(data.saveUrl, "_blank");
    } else {
      alert("Failed to generate pass: " + (data.error || "No save URL returned"));
    }
  };

  return (
    <button
      onClick={handleAddToWallet}
      className="bg-green-600 text-white px-4 py-2 rounded-lg"
    >
      Add to Google Wallet
    </button>
  );
}
