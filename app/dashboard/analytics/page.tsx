'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
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
        <Card>
          <CardHeader>
            <CardTitle>Spending Trends</CardTitle>
            <CardDescription>Daily and monthly trends</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
            <div className="text-center text-zinc-500">
              <TrendingUp className="mx-auto h-8 w-8 text-zinc-450 mb-2" />
              <p>Charts will populate once expense data is recorded.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Visual distribution representation</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
            <div className="text-center text-zinc-500">
              <TrendingUp className="mx-auto h-8 w-8 text-zinc-450 mb-2" />
              <p>Breakdown details will populate here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
