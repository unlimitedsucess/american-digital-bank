"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
  LogOut,
  Clock,
  DollarSign,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLogout } from "@/utils/logout";
import { useDispatch } from "react-redux";

const menuItems = [
  { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pending Users", href: "/admin/pending", icon: Clock },
  { name: "Active Users", href: "/admin/active", icon: UserCheck },

  { name: "Loans & Mortgages", href: "/admin/loans", icon: DollarSign },

];

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
    const dispatch = useDispatch();
    const logout = useLogout(dispatch, true);

  // ✅ track screen size
  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 w-full">
    
      <AnimatePresence>
        {(isOpen || isDesktop) && (
          <motion.aside
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3 }}
            className="w-64  md:w-80 p-8 bg-white shadow-xl px-6 flex flex-col justify-between rounded-r-2xl fixed md:static inset-y-0 z-40"
          >
                {!isDesktop && (
          <button
            className="md:hidden text-gray-700 w-fit absolute top-4 right-4"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
            <div>
              {/* Header */}
              <div className="p-4 text-xl font-bold border-b text-gray-800 pt-10 md:pt-0">
                Admin Dashboard
              </div>

              {/* Navigation */}
              <nav className="mt-4 space-y-1 relative">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => !isDesktop && setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 relative rounded-lg transition-colors",
                        isActive
                          ? "text-white font-semibold"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-lg -z-10"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      <Icon size={18} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Logout at bottom */}
            <div className="p-4 border-t">
              <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-100 text-red-600 font-medium">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <div className="w-full">
        {!isDesktop && (
          <button
            className="md:hidden p-4 text-gray-700 z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
        <main className="flex-1 overflow-auto w-full px-2 md:p-6   ">{children}</main>
      </div>
    </div>
  );
}
