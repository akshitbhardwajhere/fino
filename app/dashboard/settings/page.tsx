'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Save,
  QrCode,
  RefreshCw,
  Globe,
  DollarSign,
  Clock,
  CheckCircle,
  Smartphone,
  Copy,
  Check,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [aiProvider, setAiProvider] = useState<'groq'>('groq');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [currency, setCurrency] = useState('INR (₹)');
  const [summaryTime, setSummaryTime] = useState('23:00');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // WhatsApp connection states
  const [waStatus, setWaStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Phone pairing specific states
  const [activeTab, setActiveTab] = useState<'qr' | 'pairing'>('qr');
  const [pairingPhoneNumber, setPairingPhoneNumber] = useState('');
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [pairingError, setPairingError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setAiProvider(data.aiProvider);
          setTimezone(data.timezone);
          setCurrency(data.currency);
          setSummaryTime(data.summaryTime);
          const num = data.whatsappJid ? data.whatsappJid.split('@')[0] : '';
          setPhoneNumber(num);
          setPairingPhoneNumber(num);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    fetchSettings();
  }, []);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiProvider, timezone, currency, summaryTime, phoneNumber }),
      });
      if (res.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefreshQr = async () => {
    setIsRefreshing(true);
    setPairingCode(null);
    setPairingError(null);
    try {
      const res = await fetch('/api/whatsapp/reset', { method: 'POST' });
      if (res.ok) {
        setQrCode(null);
      }
    } catch (err) {
      console.error('Failed to reset WhatsApp session:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRequestPairingCode = async () => {
    if (!pairingPhoneNumber) {
      setPairingError('Please enter your phone number first.');
      return;
    }
    
    setIsRequestingCode(true);
    setPairingError(null);
    setPairingCode(null);

    try {
      const res = await fetch('/api/whatsapp/pairing-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: pairingPhoneNumber }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPairingCode(data.code);
      } else {
        setPairingError(data.error || 'Failed to generate pairing code. Make sure WhatsApp is not already connected.');
      }
    } catch (err) {
      setPairingError('Network error. Failed to reach WhatsApp server.');
      console.error(err);
    } finally {
      setIsRequestingCode(false);
    }
  };

  const copyToClipboard = () => {
    if (!pairingCode) return;
    navigator.clipboard.writeText(pairingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to split the pairing code for display
  const getCodeParts = () => {
    if (!pairingCode) return { part1: '', part2: '' };
    const clean = pairingCode.replace('-', '');
    return {
      part1: clean.slice(0, 4),
      part2: clean.slice(4),
    };
  };

  const { part1, part2 } = getCodeParts();

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 md:px-0 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
            Settings
          </h2>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Configure your personal assistant preferences and credentials.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "w-full sm:w-auto gap-2 shadow-md transition-all duration-300 font-semibold active:scale-98",
            isSaved && "bg-emerald-650 dark:bg-emerald-600"
          )}
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : isSaved ? (
            <>
              <Check className="h-4 w-4" /> Changes Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        
        {/* Left Column: Regional Settings (Glassmorphic) */}
        <div className="md:col-span-3 space-y-6 order-2 md:order-1 transition-all duration-300">
          <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b border-zinc-100/50 dark:border-zinc-850/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-650 dark:text-emerald-400">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Preferences</CardTitle>
                  <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                    Adjust currency format, timezones, and report scheduler
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="grid gap-4 sm:grid-cols-2">
                
                {/* Currency selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-350 flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-zinc-400" /> Currency Symbol
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200/80 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                  >
                    <option value="INR (₹)">INR (₹)</option>
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                  </select>
                </div>

                {/* Timezone selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-350 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" /> Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200/80 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST/EDT)</option>
                    <option value="Europe/London">Europe/London (BST/GMT)</option>
                  </select>
                </div>
              </div>

              {/* Time broadcast selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-350">
                  Daily Summary Broadcast Time
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={summaryTime}
                    onChange={(e) => setSummaryTime(e.target.value)}
                    className="rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-250 font-medium"
                  />
                  <span className="text-xxs text-zinc-500 leading-normal">
                    A summary of the day&apos;s total expenses will automatically be sent to your WhatsApp at this time.
                  </span>
                </div>
              </div>

              {/* Saved WhatsApp Number linked to account */}
              <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-850">
                <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-350">
                  WhatsApp Account Number
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    type="tel"
                    placeholder="e.g. 919598547460"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full sm:max-w-xs rounded-lg border border-zinc-200/80 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-250"
                  />
                  <span className="text-xxs text-zinc-500 leading-normal">
                    Include country code, no + or spaces. Incoming messages from this number will be matched to your account.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: WhatsApp Link Card (Responsive & Animated) */}
        <div className="md:col-span-2 space-y-6 order-1 md:order-2">
          <Card
            className={cn(
              "border bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden flex flex-col justify-between",
              waStatus === 'connected'
                ? "border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.06)]"
                : "border-zinc-200/50 dark:border-zinc-800/50"
            )}
          >
            <div>
              <CardHeader className="border-b border-zinc-100/50 dark:border-zinc-850/50 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300",
                      waStatus === 'connected'
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-emerald-500/5 text-zinc-400 dark:text-zinc-650"
                    )}
                  >
                    {activeTab === 'qr' ? <QrCode className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 truncate">
                      WhatsApp Link
                    </CardTitle>
                    <CardDescription className="text-xs truncate">
                      {waStatus === 'connected' ? 'Session successfully active' : 'Pair with WhatsApp'}
                    </CardDescription>
                  </div>
                  
                  {/* Small Connected badge */}
                  {waStatus === 'connected' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-750 dark:text-emerald-400 rounded-full animate-pulse">
                      Active
                    </span>
                  )}
                </div>
              </CardHeader>

              {/* Selector Tabs (QR or Phone pairing) - Displayed only if not connected */}
              {waStatus !== 'connected' && (
                <div className="p-4 pb-0">
                  <div className="flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-950/60 border border-zinc-200/30 dark:border-zinc-800/30">
                    <button
                      onClick={() => {
                        setActiveTab('qr');
                        setPairingError(null);
                      }}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer",
                        activeTab === 'qr'
                          ? "bg-white dark:bg-zinc-850 text-zinc-900 dark:text-zinc-50 shadow-sm"
                          : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                      )}
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      QR Code
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('pairing');
                        setPairingError(null);
                      }}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer",
                        activeTab === 'pairing'
                          ? "bg-white dark:bg-zinc-850 text-zinc-900 dark:text-zinc-50 shadow-sm"
                          : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                      )}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      Phone Pairing
                    </button>
                  </div>
                </div>
              )}

              <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                
                {isLoadingStatus ? (
                  <div className="flex h-[200px] w-full items-center justify-center rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20">
                    <RefreshCw className="h-6 w-6 animate-spin text-zinc-400" />
                  </div>
                ) : waStatus === 'connected' ? (
                  
                  /* Connected Success View */
                  <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95 duration-300">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-sm">WhatsApp Connected</h3>
                    <p className="text-xs text-zinc-500 mt-1 max-w-[200px] leading-relaxed">
                      Fino is connected to WhatsApp. Send expense texts to start tracking.
                    </p>
                  </div>
                ) : activeTab === 'qr' ? (
                  
                  /* Tab 1: QR Code View */
                  <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-300 w-full">
                    {qrCode ? (
                      <div className="relative border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden p-2.5 bg-white shadow-sm max-w-[210px] transform hover:scale-102 transition-transform duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={qrCode}
                          alt="WhatsApp Link QR Code"
                          width={190}
                          height={190}
                          className="rounded-xl"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center h-[200px] w-full rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20 border border-dashed border-zinc-200/50 dark:border-zinc-800/50">
                        <RefreshCw className="h-6 w-6 animate-spin text-emerald-500 mb-3" />
                        <span className="text-xs font-semibold text-zinc-500">Generating secure QR code...</span>
                      </div>
                    )}
                    
                    <div className="text-center space-y-1.5 max-w-[240px]">
                      <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Scan with your WhatsApp app
                      </p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">
                        Open WhatsApp &gt; Settings &gt; Linked Devices &gt; Link a Device, and scan the QR code.
                      </p>
                    </div>
                  </div>
                ) : (
                  
                  /* Tab 2: Phone Pairing View */
                  <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-300 w-full">
                    
                    {!pairingCode ? (
                      
                      /* Phone number input form */
                      <div className="space-y-3 w-full">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="e.g. 919598547460"
                            value={pairingPhoneNumber}
                            onChange={(e) => setPairingPhoneNumber(e.target.value.replace(/\D/g, ''))}
                            className="w-full rounded-lg border border-zinc-200/80 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-250"
                          />
                          <p className="text-[10px] text-zinc-400">
                            Enter the phone number in full international format (no spaces, e.g., 919598547460).
                          </p>
                        </div>

                        {pairingError && (
                          <div className="flex items-start gap-1.5 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <span>{pairingError}</span>
                          </div>
                        )}

                        <Button
                          type="button"
                          onClick={handleRequestPairingCode}
                          disabled={isRequestingCode || !pairingPhoneNumber}
                          className="w-full gap-2 text-xs font-semibold py-2.5 shadow-sm active:scale-98"
                        >
                          {isRequestingCode ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              Generating Code...
                            </>
                          ) : (
                            <>
                              <Smartphone className="h-3.5 w-3.5" />
                              Generate Pairing Code
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      
                      /* Pairing Code display */
                      <div className="flex flex-col items-center py-2 w-full animate-in zoom-in-95 duration-300">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-1.5">
                          Pairing Code
                        </span>
                        
                        {/* Beautiful Monospace segmented display */}
                        <div className="flex items-center gap-1.5 mb-4">
                          <div className="flex gap-1">
                            {part1.split('').map((char, index) => (
                              <span
                                key={index}
                                className="flex h-11 w-8 items-center justify-center text-lg font-bold font-mono rounded-lg border bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100"
                              >
                                {char}
                              </span>
                            ))}
                          </div>
                          <span className="text-zinc-400 font-bold px-1">—</span>
                          <div className="flex gap-1">
                            {part2.split('').map((char, index) => (
                              <span
                                key={index}
                                className="flex h-11 w-8 items-center justify-center text-lg font-bold font-mono rounded-lg border bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100"
                              >
                                {char}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Copy Code button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyToClipboard}
                          className="gap-2 transition-all duration-200 active:scale-95 border-emerald-500/25 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-650 dark:text-emerald-450"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-xs font-semibold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span className="text-xs font-semibold">Copy Code</span>
                            </>
                          )}
                        </Button>

                        {/* Step by step manual pairing instruction */}
                        <div className="mt-5 w-full bg-zinc-50 dark:bg-zinc-950/30 rounded-xl p-3 border border-zinc-100 dark:border-zinc-850/50 space-y-2">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                            <HelpCircle className="h-3.5 w-3.5 text-zinc-400" /> How to pair on your phone:
                          </span>
                          <ol className="text-[10px] text-zinc-500 dark:text-zinc-400 space-y-1.5 list-decimal list-inside pl-0.5 leading-relaxed">
                            <li>Open WhatsApp on your phone.</li>
                            <li>Go to <strong className="text-zinc-700 dark:text-zinc-300">Linked Devices</strong> &gt; <strong className="text-zinc-700 dark:text-zinc-300">Link a Device</strong>.</li>
                            <li>Select <strong className="text-emerald-600 dark:text-emerald-400">Link with phone number instead</strong> at the bottom.</li>
                            <li>Enter the 8-character code shown above.</li>
                          </ol>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setPairingCode(null);
                            setPairingError(null);
                          }}
                          className="text-[10px] font-semibold text-zinc-400 hover:text-zinc-650 mt-4 underline transition-colors cursor-pointer"
                        >
                          Use a different phone number
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </div>
            
            {/* Footer with Reset Session action */}
            <CardFooter className="border-t border-zinc-100/50 dark:border-zinc-850/50 p-4 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 font-semibold transition-all duration-300 text-xs active:scale-98 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-950"
                onClick={handleRefreshQr}
                disabled={isLoadingStatus || isRefreshing}
              >
                <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
                {isRefreshing
                  ? 'Resetting...'
                  : waStatus === 'connected'
                  ? 'Disconnect / Reset Session'
                  : 'Refresh WhatsApp Code'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
