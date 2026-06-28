'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 mb-2">
          <ArrowLeft className="h-3 w-3" /> Back to Dashboard
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Message Logs</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Incoming WhatsApp messages and their parsing results.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Message Logs</CardTitle>
          <CardDescription>Live incoming stream logs and status audits.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-455">
            <p>No messages received yet. Once WhatsApp is connected, all incoming requests will be logged here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
