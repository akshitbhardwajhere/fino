'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 mb-2">
            <ArrowLeft className="h-3 w-3" /> Back to Dashboard
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Expenses</h2>
          <p className="text-zinc-500 dark:text-zinc-400">View and manage all your tracked expenses.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Transactions List</CardTitle>
              <CardDescription>A list of all your recent expenses.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  className="w-full rounded-md border border-zinc-200 bg-white py-1.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900"
                  disabled
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-450">
            <p>Database table is empty. Try sending an expense from WhatsApp after Milestone 3 is complete!</p>
            <p className="text-sm mt-1 text-zinc-400">Example format: &quot;2500 for gurez trip&quot; or &quot;300 petrol&quot;</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
