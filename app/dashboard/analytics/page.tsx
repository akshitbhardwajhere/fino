'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, BarChart3, PieChart, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface DailySpend {
  dateStr: string;
  total: string;
}

interface CategoryDist {
  category: string;
  total: string;
}

export default function AnalyticsPage() {
  const [dailySpending, setDailySpending] = useState<DailySpend[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDist[]>([]);
  const [currency, setCurrency] = useState('INR (₹)');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics');
        if (res.ok) {
          const data = await res.json();
          setDailySpending(data.dailySpending);
          setCategoryDistribution(data.categoryDistribution);
          setCurrency(data.currency);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const getCurrencySymbol = (currencyStr: string) => {
    if (currencyStr.includes('($)')) return '$';
    if (currencyStr.includes('(€)')) return '€';
    if (currencyStr.includes('(£)')) return '£';
    return '₹';
  };

  const formatShortDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const currencySymbol = getCurrencySymbol(currency);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
        <p className="text-sm text-zinc-500">Loading analytics...</p>
      </div>
    );
  }

  // Calculate stats for trends
  const maxSpend = dailySpending.length > 0
    ? Math.max(...dailySpending.map(d => parseFloat(d.total)))
    : 0;

  const totalCatSum = categoryDistribution.reduce((sum, item) => sum + parseFloat(item.total), 0);

  const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-amber-500', 'bg-emerald-500', 'bg-sky-500', 'bg-violet-500'];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 mb-2">
          <ArrowLeft className="h-3 w-3" /> Back to Dashboard
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Analytics</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Analyze your spending trends and distributions.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Spending Trends Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-600" /> Spending Trends
            </CardTitle>
            <CardDescription>Daily spending total for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col justify-between">
            {dailySpending.length > 0 ? (
              <div className="flex-1 flex items-end justify-between gap-2 pt-6 pb-2">
                {dailySpending.map((day) => {
                  const val = parseFloat(day.total);
                  const pct = maxSpend > 0 ? (val / maxSpend) * 100 : 0;
                  return (
                    <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="relative w-full flex justify-center">
                        {/* Tooltip on Hover */}
                        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xxs font-bold py-1 px-1.5 rounded shadow whitespace-nowrap">
                          {currencySymbol}{val.toFixed(2)}
                        </div>
                        {/* Bar */}
                        <div
                          className="w-full sm:w-8 bg-emerald-500/80 group-hover:bg-emerald-500 rounded-t transition-all duration-300"
                          style={{ height: `${Math.max(pct, 6)}%`, minHeight: '6px' }}
                        />
                      </div>
                      <span className="text-xxs text-zinc-400 font-medium">{formatShortDate(day.dateStr)}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                <div className="text-center text-zinc-500">
                  <TrendingUp className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
                  <p className="text-sm">Charts will populate once expense data is recorded.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-indigo-600" /> Category Distribution
            </CardTitle>
            <CardDescription>Visual distribution of overall spending</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] flex flex-col justify-center">
            {categoryDistribution.length > 0 ? (
              <div className="space-y-4">
                {categoryDistribution.map((cat, idx) => {
                  const val = parseFloat(cat.total);
                  const pct = totalCatSum > 0 ? Math.round((val / totalCatSum) * 100) : 0;
                  const color = colors[idx % colors.length];
                  return (
                    <div key={cat.category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-zinc-700 dark:text-zinc-350">{cat.category}</span>
                        <span className="text-zinc-900 dark:text-zinc-50">
                          {currencySymbol}{val.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                          className={`h-2 rounded-full ${color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                <div className="text-center text-zinc-500">
                  <TrendingUp className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
                  <p className="text-sm">Breakdown details will populate here.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
