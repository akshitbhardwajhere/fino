'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ReceiptText,
  TrendingUp,
  Tags,
  Settings,
  Terminal,
  MoreVertical,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Expenses', href: '/dashboard/expenses', icon: ReceiptText },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { name: 'Categories', href: '/dashboard/categories', icon: Tags },
  { name: 'Message Logs', href: '/dashboard/logs', icon: Terminal },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let active = true;
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/whatsapp/status');
        if (res.ok) {
          const data = await res.json();
          if (active) {
            setIsWhatsAppConnected(data.status === 'connected');
          }
        }
      } catch {
        if (active) setIsWhatsAppConnected(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Handle outside clicks to close the dropdown menu
  useEffect(() => {
    if (!mobileOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      // Don't close if clicking the toggle trigger button itself
      if (
        (menuRef.current && menuRef.current.contains(e.target as Node)) ||
        (triggerRef.current && triggerRef.current.contains(e.target as Node))
      ) {
        return;
      }
      setMobileOpen(false);
    };

    const timer = setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
    }, 0);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
      {/* Sidebar for Desktop */}
      <aside className="hidden w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:block transition-all duration-350 ease-in-out">
        <div className="flex h-full flex-col justify-between p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:scale-105 transition-transform duration-300">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-bold text-zinc-900 dark:text-zinc-50 leading-none">Fino</h1>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">WhatsApp Assistant</span>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-150 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  isWhatsAppConnected ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                )} />
                <span className="text-xs font-medium text-zinc-650 dark:text-zinc-400">
                  WhatsApp: {isWhatsAppConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 hover:translate-x-1',
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                    )}
                  >
                    <item.icon className={cn('h-4 w-4 transition-transform duration-300', isActive ? 'text-emerald-600 dark:text-emerald-400 scale-110' : 'text-zinc-400 group-hover:scale-110')} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-150 pt-4 dark:border-zinc-800">
            <span className="text-xs text-zinc-455 dark:text-zinc-600">Fino v1.0.0</span>
            <div className="hover:scale-105 active:scale-95 transition-transform duration-200">
              <UserButton />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="relative flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900 lg:hidden transition-colors duration-300">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
              <Wallet className="h-4 w-4" />
            </div>
            <span className="font-bold text-zinc-900 dark:text-zinc-50">Fino</span>
          </div>

          {/* Premium Three Vertical Dots Button (More menu) */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "rounded-lg p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 active:scale-95 cursor-pointer",
              mobileOpen && "bg-zinc-100 dark:bg-zinc-800"
            )}
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {/* Dropdown Menu (Overlaying layout options like WhatsApp / Shadcn style) */}
          {mobileOpen && (
            <div
              ref={menuRef}
              className="absolute right-4 top-14 z-50 w-52 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/95 backdrop-blur-md p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col"
            >
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 w-full px-3.5 py-2.5 text-sm rounded-lg transition-all duration-200 text-left font-medium cursor-pointer active:scale-[0.98]",
                      isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", isActive ? "text-emerald-600 dark:text-emerald-400 scale-105" : "text-zinc-400")} />
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Dropdown Divider */}
              <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1.5" />
              
              {/* Connection state & profile settings */}
              <div className="flex items-center justify-between px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    isWhatsAppConnected ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                  )} />
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    WhatsApp: {isWhatsAppConnected ? "Linked" : "Offline"}
                  </span>
                </div>
                <div className="hover:scale-105 active:scale-95 transition-transform duration-200">
                  <UserButton />
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main Content Area with buttery page-in transitions */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 animate-in fade-in duration-500 ease-out">
          {children}
        </main>
      </div>
    </div>
  );
}
