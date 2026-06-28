'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  QrCode,
  ArrowRight,
  History,
  AlertTriangle,
  Receipt,
  Loader2,
  Settings,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  timezone: string;
  currency: string;
  summaryTime: string;
  todayTotal: string;
  todayCount: number;
  monthlyTotal: string;
  totalMessages: number;
  matchedMessages: number;
  recentExpenses: Array<{
    id: string;
    amount: string;
    category: string;
    description: string;
    spentAt: string;
  }>;
  categoryBreakdown: Array<{
    name: string;
    amount: string;
    percentage: number;
    color: string;
  }>;
  whatsappConnected: boolean;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatSpentAt = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getCurrencySymbol = (currencyStr: string) => {
    if (currencyStr.includes('($)')) return '$';
    if (currencyStr.includes('(€)')) return '€';
    if (currencyStr.includes('(£)')) return '£';
    return '₹'; // Default to INR
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
        <p className="text-sm text-zinc-500">Loading dashboard metrics...</p>
      </div>
    );
  }

  const currencySymbol = stats ? getCurrencySymbol(stats.currency) : '₹';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header with Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Welcome to Fino, your personal WhatsApp automation assistant.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/settings">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/expenses">
            <Button size="sm" className="gap-2">
              <History className="h-4 w-4" />
              <span className='font-semibold'>Expenses</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* WhatsApp Alert for MVP Connection */}
      {stats && !stats.whatsappConnected && (
        <div className="flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
          <div className="flex-1 space-y-1">
            <h4 className="font-semibold text-amber-900 dark:text-amber-400">WhatsApp Link Required</h4>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              To start tracking expenses automatically from messages, link your WhatsApp account.
            </p>
            <div className="pt-2">
              <Link href="/dashboard/settings">
                <Button size="sm" variant="outline" className="border-amber-200 hover:bg-amber-100/50 dark:border-amber-800 text-amber-800 hover:text-amber-900 dark:text-amber-400 dark:hover:bg-amber-950/40">
                  <QrCode className="mr-2 h-4 w-4" /> Scan QR Code
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Today&apos;s Spending
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currencySymbol}{stats ? parseFloat(stats.todayTotal).toLocaleString() : '0.00'}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              From {stats ? stats.todayCount : 0} transaction{stats?.todayCount === 1 ? '' : 's'}
            </p>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              This Month
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
              <Receipt className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currencySymbol}{stats ? parseFloat(stats.monthlyTotal).toLocaleString() : '0.00'}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Total spending for this month</p>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        {/* <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Messages Logged
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              <History className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? stats.totalMessages : 0}</div>
            <p className="text-xs text-zinc-500 mt-1">
              {stats ? stats.matchedMessages : 0} parsed successfully as expenses
            </p>
          </CardContent>
        </Card> */}

        {/* Metric 4 */}
        {/* <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Daily Summary Time
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? stats.summaryTime : '23:00'}</div>
            <p className="text-xs text-zinc-500 mt-1">
              Timezone: {stats ? stats.timezone : 'Asia/Kolkata'}
            </p>
          </CardContent>
        </Card> */}
      </div>

      {/* Main Grid Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Recent Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>Latest transactions parsed from WhatsApp</CardDescription>
            </div>
            <Link href="/dashboard/expenses">
              <Button variant="ghost" size="sm" className="gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-500">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats && stats.recentExpenses.length > 0 ? (
              stats.recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0 last:pb-0 dark:border-zinc-800">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{expense.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-zinc-100 px-1.5 py-0.5 text-xxs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {expense.category}
                      </span>
                      <span className="text-xs text-zinc-400">{formatSpentAt(expense.spentAt)}</span>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                    {currencySymbol}{parseFloat(expense.amount).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500 py-4 text-center">No expenses recorded yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Expense distribution for this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {stats && stats.categoryBreakdown.length > 0 ? (
              stats.categoryBreakdown.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-zinc-650 dark:text-zinc-400">{category.name}</span>
                    <span className="text-zinc-900 dark:text-zinc-50 font-semibold">
                      {currencySymbol}{parseFloat(category.amount).toFixed(2)} ({category.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={`h-2 rounded-full ${category.color}`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500 py-4 text-center">No category breakdown available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
