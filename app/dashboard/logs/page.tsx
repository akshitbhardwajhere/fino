'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface MessageLog {
  id: string;
  incomingMessage: string;
  parsedJson: any;
  intent: string | null;
  response: string | null;
  status: 'pending' | 'processed' | 'failed';
  createdAt: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatTime = (dateStr: string) => {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Processed
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-950/30 dark:text-rose-450">
            <XCircle className="h-3 w-3" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            <AlertCircle className="h-3 w-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 mb-2">
            <ArrowLeft className="h-3 w-3" /> Back to Dashboard
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-550">Message Logs</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Incoming WhatsApp messages and their parsing results.</p>
        </div>
        <Button onClick={fetchLogs} variant="outline" size="sm" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Message Logs</CardTitle>
          <CardDescription>Live incoming stream logs and status audits.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <p className="text-sm text-zinc-550">Loading logs...</p>
            </div>
          ) : logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-zinc-550 dark:text-zinc-400">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold uppercase text-zinc-400">
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Message</th>
                    <th className="py-3 px-4">Intent</th>
                    <th className="py-3 px-4">AI Response / Reply</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors align-top">
                      <td className="py-4 px-4 whitespace-nowrap text-xs">{formatTime(log.createdAt)}</td>
                      <td className="py-4 px-4 font-medium text-zinc-900 dark:text-zinc-100 max-w-[200px] break-words">
                        {log.incomingMessage}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {log.intent ? (
                          <span className="inline-flex items-center rounded-md bg-zinc-150 dark:bg-zinc-800 px-1.5 py-0.5 text-xs font-semibold text-zinc-700 dark:text-zinc-350">
                            {log.intent}
                          </span>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 max-w-[300px] break-words text-xs italic">
                        {log.response || <span className="text-zinc-400">None</span>}
                      </td>
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        {getStatusBadge(log.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500 dark:text-zinc-450">
              <p>No messages received yet.</p>
              <p className="text-sm mt-1 text-zinc-400">Once WhatsApp is connected, all incoming requests will be logged here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
