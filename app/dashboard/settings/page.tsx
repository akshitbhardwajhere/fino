'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, QrCode, RefreshCw, Brain, Globe, DollarSign, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [aiProvider, setAiProvider] = useState<'gemini' | 'openai'>('gemini');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [currency, setCurrency] = useState('INR (₹)');
  const [summaryTime, setSummaryTime] = useState('23:00');
  const [isSaved, setIsSaved] = useState(false);

  const [waStatus, setWaStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/whatsapp/status');
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (active) {
          setWaStatus(data.status);
          setQrCode(data.qrCode);
          setIsLoadingStatus(false);
        }
      } catch {
        if (active) {
          setWaStatus('disconnected');
          setQrCode(null);
          setIsLoadingStatus(false);
        }
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 mb-2">
            <ArrowLeft className="h-3 w-3" /> Back to Dashboard
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Settings</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Configure your personal assistant preferences and credentials.</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" /> {isSaved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Core Configurations */}
        <div className="md:col-span-2 space-y-6">
          {/* Card 1: AI Provider Config */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <CardTitle>AI Parsing Configuration</CardTitle>
                  <CardDescription>Select and configure your default AI engine</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAiProvider('gemini')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all ${
                    aiProvider === 'gemini'
                      ? 'border-emerald-600 bg-emerald-50/20 dark:border-emerald-500'
                      : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
                  }`}
                >
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-550">Gemini (Default)</span>
                  <span className="text-xs text-zinc-500 mt-1">Google Flash 1.5</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAiProvider('openai')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all ${
                    aiProvider === 'openai'
                      ? 'border-emerald-600 bg-emerald-50/20 dark:border-emerald-500'
                      : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
                  }`}
                >
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-550">OpenAI</span>
                  <span className="text-xs text-zinc-500 mt-1">GPT-4o Mini</span>
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">API Key</label>
                <input
                  type="password"
                  placeholder={
                    aiProvider === 'gemini'
                      ? 'Enter your Gemini API key...'
                      : 'Enter your OpenAI API key...'
                  }
                  className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900"
                />
                <p className="text-xs text-zinc-400">
                  Your credentials are encrypted and stored securely on your server instance.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Regional Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <CardTitle>Regional Preferences</CardTitle>
                  <CardDescription>Adjust currency formats, timezones, and schedulers</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-zinc-400" /> Currency Symbol
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <option value="INR (₹)">INR (₹)</option>
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-zinc-400" /> Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST/EDT)</option>
                    <option value="Europe/London">Europe/London (BST/GMT)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Daily Summary Broadcast Time</label>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={summaryTime}
                    onChange={(e) => setSummaryTime(e.target.value)}
                    className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900"
                  />
                  <span className="text-xs text-zinc-550">
                    A summary of the day&apos;s total expenses will automatically be sent to your WhatsApp at this time.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - WhatsApp Connection Status */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <CardTitle>WhatsApp Link</CardTitle>
                    <CardDescription>
                      {waStatus === 'connected' ? 'Session active' : 'Scan QR Code to pair'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                {isLoadingStatus ? (
                  <div className="flex h-[220px] w-[220px] items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-950/40">
                    <RefreshCw className="h-6 w-6 animate-spin text-zinc-400" />
                  </div>
                ) : waStatus === 'connected' ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-4 animate-pulse">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">WhatsApp Connected</h3>
                    <p className="text-xs text-zinc-500 mt-1 max-w-[180px]">
                      Your account is linked. Try sending expense messages to start tracking.
                    </p>
                  </div>
                ) : qrCode ? (
                  <div className="relative border-4 border-dashed border-zinc-100 rounded-2xl overflow-hidden p-2 dark:border-zinc-850 bg-white max-w-[240px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrCode}
                      alt="WhatsApp Link QR Code"
                      width={220}
                      height={220}
                      className="rounded-xl"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center h-[220px] w-[220px] rounded-xl bg-zinc-50 dark:bg-zinc-950/40">
                    <RefreshCw className="h-6 w-6 animate-spin text-emerald-600 dark:text-emerald-400 mb-3" />
                    <span className="text-xs font-medium text-zinc-500">Generating QR...</span>
                  </div>
                )}
                
                {waStatus !== 'connected' && (
                  <div className="text-center space-y-1 px-2">
                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      {waStatus === 'connecting' ? 'Ready to Scan' : 'Pairing Code Pending'}
                    </p>
                    <p className="text-xxs text-zinc-450 dark:text-zinc-400 leading-normal">
                      Open WhatsApp on your phone, go to Linked Devices &gt; Link a Device, and scan the QR code above.
                    </p>
                  </div>
                )}
              </CardContent>
            </div>
            <CardFooter className="border-t border-zinc-100 p-4 dark:border-zinc-800 flex justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2"
                disabled={waStatus === 'connected' || isLoadingStatus}
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refresh QR Code
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
