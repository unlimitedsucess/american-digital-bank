import { Smartphone, Monitor, Send, Lock } from "lucide-react";

export const services = [
  {
    slug: "mobile-banking",
    icon: Smartphone,
    title: "Mobile Banking",
    description: "Complete banking at your fingertips with our award-winning mobile app.",
    features: [
      "Account balance and transaction history",
      "Mobile check deposit",
      "Bill pay and transfers",
      "ATM and branch locator",
      "Biometric login",
    ],
    image: "/mobile-banking-app.png",
  },
  {
    slug: "online-banking",
    icon: Monitor,
    title: "Online Banking",
    description: "Secure and convenient online banking platform available 24/7.",
    features: [
      "Real-time account management",
      "Advanced security features",
      "Customizable dashboard",
      "Document storage",
      "Investment tracking",
    ],
    image: "/online-banking-dashboard.jpg",
  },
  {
    slug: "wire-transfers",
    icon: Send,
    title: "Wire Transfers",
    description: "Fast and secure domestic and international wire transfers.",
    features: [
      "Same-day domestic transfers",
      "International wire transfers",
      "Competitive exchange rates",
      "Transfer tracking",
      "Secure encryption",
    ],
    image: "/wire-transfer-banking.jpg",
  },
  {
    slug: "secure-payments",
    icon: Lock,
    title: "Secure Payments",
    description: "Make payments with confidence using advanced encryption.",
    features: [
      "Contactless payments",
      "Bill splitting",
      "Merchant partnerships",
      "Fraud monitoring",
      "Instant alerts",
    ],
    image: "/secure-payments.jpg",
  },
];
