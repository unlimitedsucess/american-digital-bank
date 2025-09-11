"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WireframeLoader } from "@/components/wireframe-loader";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Card {
  id: number;
  type: "Visa" | "MasterCard" | "Verve" | "Discover";
  number: string;
  holder: string;
  status: "active" | "old" | "pending"; 
}

const cardOptions = [
  { name: "Visa", charge: 5 },
  { name: "MasterCard", charge: 7 },
  { name: "Verve", charge: 6 },
  { name: "Discover", charge: 6 },
];

// Example PIN (in real app, verify server-side)
const USER_PIN = "1234";

// Card logos omitted for brevity; use your existing CardLogo component
const CardLogo = ({ type }: { type: string }) => <div>{type}</div>;

export default function CardPage() {
  const [cards, setCards] = useState<Card[]>([
    { id: 1, type: "Visa", number: "**** **** **** 1234", holder: "John Doe", status: "old" },
    { id: 2, type: "MasterCard", number: "**** **** **** 5678", holder: "Jane Smith", status: "active" },
  ]);

  const [applyingCard, setApplyingCard] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pinModal, setPinModal] = useState<{ type: "apply" | "block"; cardId?: number; cardName?: string } | null>(null);
  const [enteredPin, setEnteredPin] = useState("");

  const blockCard = (id: number) => {
    setCards(cards.map(c => (c.id === id ? { ...c, status: c.status === "active" ? "old" : c.status } : c)));
  };

  const cancelPendingCard = (id: number) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const handleApply = (name: string) => {
    const hasThisType = cards.some(c => c.type === name && (c.status === "active" || c.status === "pending"));
    if (hasThisType) {
      alert(`You already have a ${name} card active or pending. Cancel it first to apply a new one.`);
      return;
    }
    setPinModal({ type: "apply", cardName: name });
  };

  const handleBlock = (id: number) => {
    setPinModal({ type: "block", cardId: id });
  };

  const confirmPin = () => {
    if (enteredPin !== USER_PIN) {
      alert("Incorrect PIN!");
      return;
    }

    if (pinModal?.type === "apply" && pinModal.cardName) {
      const newCard: Card = {
        id: Date.now(),
        type: pinModal.cardName as Card["type"],
        number: "**** **** **** 9999",
        holder: "New Card Holder",
        status: "pending",
      };
      setCards(prev => {
        const updated = [...prev, newCard];
        return updated.length > 4 ? updated.slice(updated.length - 4) : updated;
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }

    if (pinModal?.type === "block" && pinModal.cardId) {
      blockCard(pinModal.cardId);
    }

    setEnteredPin("");
    setPinModal(null);
  };

  const getCardStyle = (type: string) => {
    switch (type) {
      case "Visa": return "bg-gradient-to-r from-blue-500 to-blue-700 text-white";
      case "MasterCard": return "bg-gradient-to-r from-red-500 to-yellow-400 text-white";
      case "Verve": return "bg-gradient-to-r from-purple-600 to-pink-500 text-white";
      case "Discover": return "bg-gradient-to-r from-orange-500 to-yellow-300 text-white";
      default: return "bg-gray-300";
    }
  };

  return (
    <WireframeLoader isLoading={false}>
      <DashboardSidebar>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">My Cards</h1>

          <div className="grid md:grid-cols-2 gap-6">
            {cards.map(card => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative rounded-xl shadow-lg p-6 min-h-[180px] flex flex-col justify-between ${getCardStyle(card.type)}`}
              >
                <div className="absolute top-4 right-4">
                  <CardLogo type={card.type} />
                </div>

                <div className="mt-6 text-xl font-mono tracking-widest">{card.number}</div>
                <div className="text-sm font-semibold mt-2">{card.holder}</div>

                {card.status === "active" && (
                  <Button
                    variant="destructive"
                    className="mt-4 self-start"
                    onClick={() => handleBlock(card.id)}
                  >
                    Block Card
                  </Button>
                )}

                {card.status === "pending" && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="inline-block text-yellow-200 font-semibold bg-yellow-600 px-3 py-1 rounded">
                      Pending Approval
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => cancelPendingCard(card.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Apply for New Card</h2>
            <div className="flex flex-wrap gap-4">
              {cardOptions.map(option => {
                const isDisabled = cards.some(c => c.type === option.name && (c.status === "active" || c.status === "pending"));
                return (
                  <motion.div
                    key={option.name}
                    whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                    className={`p-4 border rounded-lg shadow cursor-pointer flex flex-col items-center bg-white ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => !isDisabled && handleApply(option.name)}
                  >
                    <CardLogo type={option.name} />
                    <h3 className="font-medium mt-1">{option.name}</h3>
                    <p className="text-sm">Charge: ${option.charge}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-green-100 text-green-800 rounded"
            >
              Successful! Your new card is under review. It will be active in 24 hrs.
            </motion.div>
          )}

          {/* PIN Modal */}
          {pinModal && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-80 flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Enter your 4-digit PIN</h3>
                <Input
                  type="password"
                  maxLength={4}
                  value={enteredPin}
                  onChange={e => setEnteredPin(e.target.value)}
                  className="text-center text-xl tracking-widest"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setPinModal(null); setEnteredPin(""); }}>Cancel</Button>
                  <Button onClick={confirmPin}>Confirm</Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </DashboardSidebar>
    </WireframeLoader>
  );
}
