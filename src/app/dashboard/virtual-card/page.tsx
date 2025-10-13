"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WireframeLoader } from "@/components/wireframe-loader";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { customerActions } from "@/store/data/customer-slice";
import { Card, ApplyedCard } from "@/types/global";
import { RootState } from "@/store";

const cardOptions = [
  { name: "visa", charge: 5 },
  { name: "master", charge: 7 },
  { name: "verve", charge: 6 },
];

// ✅ Replace with your styled CardLogo
const CardLogo = ({ type }: { type: string }) => <div>{type}</div>;

export default function CardPage() {
  const token = useSelector((state: any) => state.token?.token);
  const cards = useSelector((state: any) => state.customer.cards);
  const customerData = useSelector(
    (state: RootState) => state.customer.customerData
  );

  const formatExpiry = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2); // last 2 digits
    return `${month}/${year}`;
  };

  const dispatch = useDispatch();

  const [pinModal, setPinModal] = useState<{
    type: "apply";
    cardName?: string;
  } | null>(null);
  const [enteredPin, setEnteredPin] = useState("");
  const [formData, setFormData] = useState<ApplyedCard>({
    pin: "",
    cardType: "",
  });

  const { loading, sendHttpRequest: CardRequest } = useHttp();
  const { sendHttpRequest: userInforHttpRequest } = useHttp();

  // ✅ Handle new card apply
  const handleApply = (name: string) => {
    setFormData((prev) => ({ ...prev, cardType: name }));
    setPinModal({ type: "apply", cardName: name });
  };

  // ✅ Submit new card creation
  const handleSubmit = (pinValue: string) => {
    const submissionData = { ...formData, pin: pinValue };

    if (!submissionData.pin || !submissionData.cardType) {
      toast.error("Please fill in all fields!");
      return;
    }

    CardRequest({
      requestConfig: {
        url: "card/create",
        method: "POST",
        body: submissionData,
        token,
        isAuth: true,
        successMessage: "Successful",
      },
      successRes: () => {
        toast.success("Card created successfully!");
        setPinModal(null);
        setEnteredPin("");

        // 🔄 Refresh card list after creation
        fetchCards();
      },
    });
  };

  // ✅ Fetch cards from server
  const fetchCards = () => {
    userInforHttpRequest({
      requestConfig: {
        url: "card/all",
        method: "GET",
        token,
        isAuth: true,
      },
      successRes: (res: any) => {
        const resData = res?.data;
        console.log("User info response:", resData);

        const user = resData?.data;
        console.log("Resolved user:", user);

        // ✅ Save to Redux customer sliceA

        const mappedCards: Card[] = user.map((c: any) => ({
          _id: c._id,
          userId: c.userId,
          cardType: c.cardType,
          pin: c.pin,
          ccv: c.ccv,
          expiryDate: c.expiryDate,
          cardNumber: c.cardNumber || "**** **** **** 1234",
          holder: c.holder || "Card Holder",
          status: c.status || "active",
          transactionDate: c.transactionDate,
          updatedAt: c.updatedAt,
        }));

        dispatch(customerActions.setCards(mappedCards));
      },
    });
  };

  useEffect(() => {
    if (token) fetchCards();
  }, [token]);

  const getCardStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case "visa":
        return "bg-gradient-to-r from-blue-500 to-blue-700 text-white";
      case "mastercard":
        return "bg-gradient-to-r from-red-500 to-yellow-400 text-white";
      case "verve":
        return "bg-gradient-to-r from-purple-600 to-pink-500 text-white";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <WireframeLoader isLoading={false}>
      <DashboardSidebar>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">My Cards</h1>

          {/* ✅ Render fetched cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {cards.length === 0 ? (
              <p className="text-gray-500">No cards found.</p>
            ) : (
              cards.map((card: Card) => {
                const expiryDate = new Date(card.expiryDate);
                const isExpired = expiryDate < new Date();

                // ✅ local UI-only status
                type EffectiveStatus = "active" | "diactived" | "expired";
                const effectiveStatus: EffectiveStatus = isExpired
                  ? "expired"
                  : (card.status as EffectiveStatus);

                const handleBlock = (cardId: string) => {
                  userInforHttpRequest({
                    requestConfig: {
                      url: "/card/update",
                      method: "PATCH",
                      token,
                      isAuth: true,
                      body: { status: "de-activated", cardId },
                      successMessage: "Card blocked successfully",
                    },
                    successRes: () => {
                      fetchCards();
                      toast.success("Card blocked successfully");
                    },
                  });
                };

                return (
                  <motion.div
                    key={card._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative rounded-xl shadow-lg p-6 min-h-[220px] flex flex-col justify-between ${getCardStyle(
                      card.cardType
                    )}`}
                  >
                    {/* ✅ Show Status at Top Left */}
                    <div className="absolute top-4 left-4 text-xs font-bold uppercase">
                      <span
                        className={
                          effectiveStatus === "active"
                            ? "text-green-400"
                            : effectiveStatus === "expired"
                            ? "text-red-400"
                            : "text-gray-400"
                        }
                      >
                        {effectiveStatus}
                      </span>
                    </div>

                    {/* ✅ Card logo */}
                    <div className="absolute top-4 right-4">
                      <CardLogo type={card.cardType} />
                    </div>

                    {/* Card number */}
                    <div className="mt-6 text-xl font-mono tracking-widest">
                      {card.cardNumber}
                    </div>

                    {/* Holder */}
                    <div className="text-sm font-semibold mt-2">
                      {`${customerData.firstName} ${customerData.lastName}`}
                    </div>

                    {/* Expiry + CCV */}
                    <div className="text-xs mt-1">
                      Exp: {formatExpiry(card.expiryDate)} | CCV: {card.ccv}
                    </div>

                    {/* ✅ Block Button */}
                    <div className="mt-4">
                      <Button
                        variant="destructive"
                        disabled={effectiveStatus !== "active"} // only enabled if active
                        onClick={() => handleBlock(card._id)}
                      >
                        {loading ? (
                          <LoadingSpinner />
                        ) : card.status !== "active" ? (
                          "Blocked"
                        ) : (
                          "Block Card"
                        )}
                      </Button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* ✅ Apply for new card */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Apply for New Card</h2>
            <div className="flex flex-wrap gap-4">
              {cardOptions.map((option) => (
                <motion.div
                  key={option.name}
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 border rounded-lg shadow cursor-pointer flex flex-col items-center bg-white`}
                  onClick={() => handleApply(option.name)}
                >
                  <CardLogo type={option.name} />
                  <p className="text-sm">Charge: ${option.charge}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ✅ PIN Modal */}
          {pinModal && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-80 flex flex-col gap-4">
                <h3 className="text-lg font-semibold">
                  Enter your 4-digit PIN
                </h3>
                <Input
                  type="password"
                  maxLength={4}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  className="text-center text-xl tracking-widest"
                />

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPinModal(null);
                      setEnteredPin("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={loading}
                    onClick={() => {
                      if (enteredPin.length < 4) {
                        toast.error("Please enter your 4-digit PIN");
                        return;
                      }
                      handleSubmit(enteredPin);
                    }}
                  >
                    {loading ? <LoadingSpinner /> : "Confirm"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardSidebar>
    </WireframeLoader>
  );
}
