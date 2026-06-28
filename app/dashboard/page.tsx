'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  QrCode,
  ArrowRight,
  Plus,
  History,
  AlertTriangle,
  Receipt,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Mock data for Milestone 1
const mockRecentExpenses = [
  { id: '1', amount: '2500.00', category: 'Travel', description: 'Gurez Trip', spentAt: 'Today, 2:30 PM' },
  { id: '2', amount: '150.00', category: 'Food', description: 'Pizza slice', spentAt: 'Today, 1:15 PM' },
  { id: '3', amount: '600.00', category: 'Fuel', description: 'Petrol', spentAt: 'Yesterday, 6:00 PM' },
  { id: '4', amount: '1200.00', category: 'Shopping', description: 'Shoes', spentAt: 'June 26, 11:00 AM' },
  { id: '5', amount: '100.00', category: 'Food', description: 'Burger', spentAt: 'June 25, 9:00 PM' },
];

const mockCategoryBreakdown = [
  { name: 'Travel', amount: '2500.00', percentage: 61, color: 'bg-indigo-500' },
  { name: 'Shopping', amount: '1200.00', percentage: 29, color: 'bg-pink-500' },
  { name: 'Fuel', amount: '600.00', percentage: 14, color: 'bg-amber-500' },
  { name: 'Food', amount: '250.00', percentage: 6, color: 'bg-emerald-500' },
];

export default function DashboardPage() {
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
              Configure AI
            </Button>
          </Link>
          <Link href="/dashboard/expenses">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Add Expense
            </Button>
          </Link>
        </div>
      </div>

      {/* WhatsApp Alert for MVP Connection */}
      <div className="flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-550" />
        <div className="flex-1 space-y-1">
          <h4 className="font-semibold text-amber-900 dark:text-amber-400">WhatsApp Link Required</h4>
          <p className="text-sm text-amber-700 dark:text-amber-500">
            To start tracking expenses automatically from messages, link your WhatsApp account.
          </p>
          <div className="pt-2">
            <Link href="/dashboard/settings">
              <Button size="sm" variant="outline" className="border-amber-250 hover:bg-amber-100/50 dark:border-amber-800 text-amber-850 hover:text-amber-900 dark:text-amber-400 dark:hover:bg-amber-950/40">
                <QrCode className="mr-2 h-4 w-4" /> Scan QR Code
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Today&apos;s Spending
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-450">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,650.00</div>
            <p className="text-xs text-zinc-500 mt-1">From 2 transactions</p>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              This Month
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-450">
              <Receipt className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹4,550.00</div>
            <p className="text-xs text-zinc-500 mt-1">Monthly budget: ₹25,000</p>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Messages Logged
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              <History className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-zinc-500 mt-1">9 intent matched successfully</p>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Daily Summary Time
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              <Plus className="h-4 w-4 rotate-45" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11:00 PM</div>
            <p className="text-xs text-zinc-500 mt-1">Configured timezone: IST</p>
          </CardContent>
        </Card>
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
            {mockRecentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0 last:pb-0 dark:border-zinc-800">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{expense.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-1.5 py-0.5 text-xxs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {expense.category}
                    </span>
                    <span className="text-xs text-zinc-400">{expense.spentAt}</span>
                  </div>
                </div>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  ₹{expense.amount}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Column: Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Expense distribution for this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mockCategoryBreakdown.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-zinc-650 dark:text-zinc-355">{category.name}</span>
                  <span className="text-zinc-900 dark:text-zinc-50 font-semibold">₹{category.amount} ({category.percentage}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className={`h-2 rounded-full ${category.color}`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
