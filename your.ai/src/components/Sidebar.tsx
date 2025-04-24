"use client";

import type React from "react";
import { useAuth } from "../Context/authContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Newsletter from "../components/newsletter";
import {
  LayoutDashboard,
  Calendar,
  Newspaper,
  Kanban,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isPrimary?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  label,
  isActive,
  isPrimary,
  onClick,
}) => {
  return (
    <li>
      <Link
        to={to}
        className={`
          relative flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 group
          ${
            isPrimary
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : isActive
              ? "bg-indigo-50 text-indigo-600 font-medium"
              : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
          }
        `}
        onClick={onClick}
      >
        <span className="inline-flex items-center justify-center w-6 h-6 mr-3">
          {icon}
        </span>
        <span className="flex-1">{label}</span>
        {!isPrimary && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
            className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
          />
        )}
      </Link>
    </li>
  );
};

// Custom link component for the newsletter that doesn't use react-router
const NewsletterLink: React.FC<
  Omit<SidebarLinkProps, "to"> & { onOpenNewsletter: () => void }
> = ({ icon, label, isActive, isPrimary, onOpenNewsletter }) => {
  return (
    <li>
      <button
        onClick={onOpenNewsletter}
        className={`
          w-full relative flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 group
          ${
            isPrimary
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : isActive
              ? "bg-indigo-50 text-indigo-600 font-medium"
              : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
          }
        `}
      >
        <span className="inline-flex items-center justify-center w-6 h-6 mr-3">
          {icon}
        </span>
        <span className="flex-1 text-left">{label}</span>
        {!isPrimary && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
            className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
          />
        )}
      </button>
    </li>
  );
};

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const openNewsletter = () => {
    setIsNewsletterOpen(true);
    // Close mobile menu if open
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const closeNewsletter = () => {
    setIsNewsletterOpen(false);
  };

  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "5rem" },
  };

  const mobileMenuVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0 },
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar for mobile */}
      <motion.aside
        className="fixed inset-y-0 left-0 z-50 w-64 md:hidden"
        variants={mobileMenuVariants}
        initial="closed"
        animate={isMobileOpen ? "open" : "closed"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col h-full bg-white shadow-xl border-r">
          <SidebarContent
            isActive={isActive}
            isCollapsed={false}
            onCloseMobile={() => setIsMobileOpen(false)}
            user={user}
            onOpenNewsletter={openNewsletter}
          />
        </div>
      </motion.aside>

      {/* Sidebar for desktop */}
      <motion.aside
        className="hidden md:block h-screen bg-white shadow-xl border-r"
        variants={sidebarVariants}
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <SidebarContent
          isActive={isActive}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          user={user}
          onOpenNewsletter={openNewsletter}
        />
      </motion.aside>

      {/* Newsletter Modal */}
      <Newsletter isOpen={isNewsletterOpen} onClose={closeNewsletter} />
    </>
  );
};

interface SidebarContentProps {
  isActive: (path: string) => boolean;
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
  onCloseMobile?: () => void;
  onOpenNewsletter: () => void;
  user?: {
    name?: string;
    email?: string;
    picture?: string;
  };
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  isActive,
  isCollapsed,
  onToggleCollapse,
  onCloseMobile,
  onOpenNewsletter,
  user,
}) => {
  return (
    <>
      {/* Logo */}
      <div className="p-5 flex items-center justify-between border-b">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-20 h-20 bg-white rounded-lg shadow-none border-none outline-none">
            <img
              src="/logo1.png"
              alt="Your.ai"
              className="w-auto h-auto max-w-full max-h-full"
            />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-indigo-600"
            >
              Your.ai
            </motion.span>
          )}
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ChevronRight
              size={18}
              className={`transform transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-3 py-4">
          {!isCollapsed && (
            <div className="px-4 mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Main Menu
            </div>
          )}
          <ul className="space-y-1.5">
            <SidebarLink
              to="/dashboard"
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              isActive={isActive("/dashboard")}
              onClick={onCloseMobile}
            />
            <SidebarLink
              to="/calendar"
              icon={<Calendar size={18} />}
              label="My Calendar"
              isActive={isActive("/calendar")}
              onClick={onCloseMobile}
            />
            <NewsletterLink
              icon={<Newspaper size={18} />}
              label="Newsletter"
              isActive={false}
              onOpenNewsletter={() => {
                if (onCloseMobile) onCloseMobile();
                onOpenNewsletter();
              }}
            />
            <SidebarLink
              to="/kanban"
              icon={<Kanban size={18} />}
              label="Kanban"
              isActive={isActive("/kanban")}
              onClick={onCloseMobile}
            />
          </ul>

          {!isCollapsed && (
            <div className="px-4 mt-8 mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase"></div>
          )}
          <ul className="space-y-1.5"></ul>
        </nav>

        {/* User profile */}
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="relative">
              {user?.picture ? (
                <img
                  src={user.picture || "/placeholder.svg"}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                  {user?.name?.slice(0, 2).toUpperCase() || "US"}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name || "User Name"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
