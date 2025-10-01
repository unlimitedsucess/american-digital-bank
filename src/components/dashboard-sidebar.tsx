"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AmericanHLogo } from "./skyflex-logo";
import { useRouter } from "next/navigation";
import {
  Home,
  CreditCard,
  ArrowUpDown,
  Send,
  Wallet,
  PiggyBank,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  ChevronDown,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useLogout } from "@/utils/logout";
const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Online Deposit", href: "/dashboard/deposit", icon: Wallet },
  { name: "Domestic Transfer", href: "/dashboard/domestic-transfer", icon: ArrowUpDown },
  { name: "Wire Transfer", href: "/dashboard/wire-transfer", icon: Send },
  { name: "Virtual Card", href: "/dashboard/virtual-card", icon: CreditCard },
  { name: "Loan & Mortgages", href: "/dashboard/loans", icon: PiggyBank },
  { name: "Transaction", href: "/dashboard/transactions", icon: FileText },
  { name: "Withdrawal", href: "/dashboard/withdrawal", icon: ArrowUpDown },
  { name: "Account Manager", href: "/dashboard/account-manager", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];


interface DashboardSidebarProps {
  children: React.ReactNode;
}

export function DashboardSidebar({ children }: DashboardSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // sidebar open by default on desktop
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter()

  const pathname = usePathname();
  const customerData = useSelector(
    (state: RootState) => state.customer.customerData
  );
  const dispatch = useDispatch();
  const logout = useLogout(dispatch,false)

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div className="min-h-screen bg-background gap-0 flex">
      {/* Overlay (only mobile) */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.33, ease: "easeInOut" }}
            className={`${
              isMobile
                ? "fixed inset-y-0 left-0 w-64 z-50 bg-sidebar border-r border-sidebar-border"
                : "relative w-64 border-r border-sidebar-border"
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-sidebar-border">
                <Link href="/" className="flex items-center space-x-3">
                  <AmericanHLogo size="sm" />
                  <span className="text-lg font-bold text-sidebar-foreground">
                    American Horizon
                  </span>
                </Link>
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>

              {/* User */}
              <div className="p-4 border-b border-sidebar-border ">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={customerData.passportUrl} alt={customerData.firstName} />
                    <AvatarFallback>
                      {customerData.passportUrl || customerData.firstName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {customerData.firstName}
                    </p>
                    <p className="text-xs text-sidebar-foreground/70 truncate">
                      {customerData.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-auto">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="p-4 border-t border-sidebar-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  asChild
                >
                  <Button variant="secondary"  onClick={logout}>
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </Button>
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          !isMobile && isSidebarOpen ? "" : "ml-0"
        }`}
      >
        {/* Topbar */}
        <header className="bg-background border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                3
              </span>
            </Button>

            {/* Profile Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center space-x-2"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={customerData.passportUrl} alt={customerData.firstName} />
                  <AvatarFallback>
                    {customerData.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium">
                  {customerData.firstName.split(" ")[0]}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50"
                  >
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      Profile Settings
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      Security
                    </Link>
                    <div className="border-t border-border my-1" />
                    <button
                      onClick={()=>router.push("/login")}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
