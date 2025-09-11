"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DepositPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const router = useRouter();

  const wallets = [
    { id: "btc", label: "Bitcoin (BTC)" },
    { id: "usdt", label: "USDT (ERC20)" },
    { id: "usdt-tr", label: "USDT (TRC20)" },
    { id: "usdt-be", label: "USDT (BEP20)" },
    { id: "eth", label: "Ethereum (ETH)" },
    { id: "so", label: "Solana" },
    { id: "tn", label: "TON" },
    { id: "bn", label: "Binance coin (BNB)" },
    { id: "dog", label: "Dogecoin (DOGE)" },
    { id: "lit", label: "Litecoin (LTC)" },
    { id: "tr", label: "Tron (TRX)" },
    { id: "pr", label: "Polygon (MATIC)" },
  ];

  const handleWalletSelect = (wallet: string) => {
    setSelectedWallet(wallet);
    setErrorVisible(true);
    setIsOpen(false);
  };

  return (
    <div className="bg-black flex items-center justify-center min-h-screen">
      <div className="bg-[#0B1221] p-6 rounded-lg border border-blue-500 w-[400px] text-white text-center relative">
        <h1 className="text-2xl font-bold mb-2">Flash</h1>
        <p className="mb-4">Cryptocurrency Automatic Gateway</p>

        <ul className="text-sm text-left mb-4">
          <li>• Minimum deposit is $50.</li>
          <li>• Select your preferred payment gateway.</li>
          <li>• Send the deposit to the provided wallet address.</li>
          <li>• You will be automatically redirected once processed.</li>
        </ul>

        {/* Custom Select */}
        <div className="relative">
          <input
            readOnly
            value={selectedWallet || ""}
            placeholder="Payment Gateway"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full p-2 rounded text-black bg-white cursor-pointer"
          />

          {isOpen && (
            <div className="absolute z-50 left-0 right-0 mt-1 text-black max-h-48 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  onClick={() => handleWalletSelect(wallet.label)}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {wallet.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error message */}
        {errorVisible && (
          <p className="text-red-500 text-sm mt-2">
            Unavailable now, please try again later.
          </p>
        )}

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
