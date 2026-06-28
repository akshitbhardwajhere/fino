'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ReceiptText,
  TrendingUp,
  Tags,
  Settings,
  Terminal,
  Menu,
  X,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar for Desktop */}
      <aside className="hidden w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 md:block">
        <div className="flex h-full flex-col justify-between p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
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
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
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
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-850 dark:hover:text-zinc-100'
                    )}
                  >
                    <item.icon className={cn('h-4 w-4', isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-450')} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="text-xs text-zinc-400 dark:text-zinc-650">
            Fino Assistant v1.0.0
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Wallet className="h-4 w-4" />
            </div>
            <span className="font-bold text-zinc-900 dark:text-zinc-50">Fino</span>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-zinc-650 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white p-6 shadow-xl dark:bg-zinc-900 md:hidden">
            <div className="flex h-full flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <Wallet className="h-4.5 w-4.5" />
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-50">Fino</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="text-zinc-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      isWhatsAppConnected ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                    )} />
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
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
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-emerald-50 text-emerald-750 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
