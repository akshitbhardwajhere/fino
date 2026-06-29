'use client';

import { useState, useEffect, useRef } from 'react';
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
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Comprehensive list of country codes from all over the globe
const countries = [
  { code: 'IN', flag: '🇮🇳', dial: '91', name: 'India' },
  { code: 'US', flag: '🇺🇸', dial: '1', name: 'United States' },
  { code: 'GB', flag: '🇬🇧', dial: '44', name: 'United Kingdom' },
  { code: 'AE', flag: '🇦🇪', dial: '971', name: 'United Arab Emirates' },
  { code: 'SA', flag: '🇸🇦', dial: '966', name: 'Saudi Arabia' },
  { code: 'DE', flag: '🇩🇪', dial: '49', name: 'Germany' },
  { code: 'SG', flag: '🇸🇬', dial: '65', name: 'Singapore' },
  { code: 'AU', flag: '🇦🇺', dial: '61', name: 'Australia' },
  { code: 'CA', flag: '🇨🇦', dial: '1', name: 'Canada' },
  { code: 'FR', flag: '🇫🇷', dial: '33', name: 'France' },
  { code: 'IT', flag: '🇮🇹', dial: '39', name: 'Italy' },
  { code: 'ES', flag: '🇪🇸', dial: '34', name: 'Spain' },
  { code: 'JP', flag: '🇯🇵', dial: '81', name: 'Japan' },
  { code: 'KR', flag: '🇰🇷', dial: '82', name: 'South Korea' },
  { code: 'BR', flag: '🇧🇷', dial: '55', name: 'Brazil' },
  { code: 'MX', flag: '🇲🇽', dial: '52', name: 'Mexico' },
  { code: 'RU', flag: '🇷🇺', dial: '7', name: 'Russia' },
  { code: 'ZA', flag: '🇿🇦', dial: '27', name: 'South Africa' },
  { code: 'NZ', flag: '🇳🇿', dial: '64', name: 'New Zealand' },
  { code: 'CH', flag: '🇨🇭', dial: '41', name: 'Switzerland' },
  { code: 'NL', flag: '🇳🇱', dial: '31', name: 'Netherlands' },
  { code: 'SE', flag: '🇸🇪', dial: '46', name: 'Sweden' },
  { code: 'NO', flag: '🇳🇴', dial: '47', name: 'Norway' },
  { code: 'FI', flag: '🇫🇮', dial: '358', name: 'Finland' },
  { code: 'DK', flag: '🇩🇰', dial: '45', name: 'Denmark' },
  { code: 'IE', flag: '🇮🇪', dial: '353', name: 'Ireland' },
  { code: 'BE', flag: '🇧🇪', dial: '32', name: 'Belgium' },
  { code: 'AT', flag: '🇦🇹', dial: '43', name: 'Austria' },
  { code: 'PT', flag: '🇵🇹', dial: '351', name: 'Portugal' },
  { code: 'MY', flag: '🇲🇾', dial: '60', name: 'Malaysia' },
  { code: 'ID', flag: '🇮🇩', dial: '62', name: 'Indonesia' },
  { code: 'PH', flag: '🇵🇭', dial: '63', name: 'Philippines' },
  { code: 'TH', flag: '🇹🇭', dial: '66', name: 'Thailand' },
  { code: 'VN', flag: '🇻🇳', dial: '84', name: 'Vietnam' },
  { code: 'TR', flag: '🇹🇷', dial: '90', name: 'Turkey' },
  { code: 'EG', flag: '🇪🇬', dial: '20', name: 'Egypt' },
  { code: 'NG', flag: '🇳🇬', dial: '234', name: 'Nigeria' },
  { code: 'KE', flag: '🇰🇪', dial: '254', name: 'Kenya' },
  { code: 'AR', flag: '🇦🇷', dial: '54', name: 'Argentina' },
  { code: 'CL', flag: '🇨🇱', dial: '56', name: 'Chile' },
  { code: 'CO', flag: '🇨🇴', dial: '57', name: 'Colombia' },
  { code: 'PE', flag: '🇵🇪', dial: '51', name: 'Peru' },
  { code: 'PK', flag: '🇵🇰', dial: '92', name: 'Pakistan' },
  { code: 'BD', flag: '🇧🇩', dial: '880', name: 'Bangladesh' },
  { code: 'LK', flag: '🇱🇰', dial: '94', name: 'Sri Lanka' },
  { code: 'NP', flag: '🇳🇵', dial: '977', name: 'Nepal' },
  { code: 'QA', flag: '🇶🇦', dial: '974', name: 'Qatar' },
  { code: 'KW', flag: '🇰🇼', dial: '965', name: 'Kuwait' },
  { code: 'OM', flag: '🇴🇲', dial: '968', name: 'Oman' },
  { code: 'BH', flag: '🇧🇭', dial: '973', name: 'Bahrain' },
  { code: 'UA', flag: '🇺🇦', dial: '380', name: 'Ukraine' },
  { code: 'PL', flag: '🇵🇱', dial: '48', name: 'Poland' },
  { code: 'RO', flag: '🇷🇴', dial: '40', name: 'Romania' },
  { code: 'GR', flag: '🇬🇷', dial: '30', name: 'Greece' },
  { code: 'IL', flag: '🇮🇱', dial: '972', name: 'Israel' },
  { code: 'HK', flag: '🇭🇰', dial: '852', name: 'Hong Kong' },
  { code: 'TW', flag: '🇹🇼', dial: '886', name: 'Taiwan' }
];

// Reusable custom dropdown/select component matching Fino design aesthetics
function CustomSelect({
  value,
  onChange,
  options,
  className
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 text-zinc-900 dark:text-zinc-200 cursor-pointer text-left shadow-sm"
      >
        <span className="flex items-center gap-2">
          {selectedOption.icon}
          {selectedOption.label}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition-transform duration-200", isOpen && "transform rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/95 backdrop-blur-md p-1.5 shadow-xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors text-left cursor-pointer",
                opt.value === value
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Custom Country Select Dropdown with Search Filter and Flags
function CountrySelect({
  value,
  onChange,
  disabled
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find(c => c.dial === value) || countries[0];

  useEffect(() => {
    if (!isOpen) return;
    setSearch('');
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isOpen]);

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
  );

  return (
    <div ref={containerRef} className="relative shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-l-xl">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer h-full select-none outline-none disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span>{selectedCountry.flag}</span>
        <span>+{selectedCountry.dial}</span>
        {!disabled && <ChevronDown className={cn("h-3.5 w-3.5 text-zinc-400 transition-transform duration-200", isOpen && "transform rotate-180")} />}
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 left-0 mt-1.5 w-64 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/95 backdrop-blur-md p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2 py-1.5 border-b border-zinc-100 dark:border-zinc-800 mb-1.5">
            <input
              type="text"
              placeholder="Search country or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2.5 py-1 text-xs rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-900 dark:text-zinc-250 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
              onClick={(e) => e.stopPropagation()} // Prevent closing
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => (
                <button
                  key={`${c.code}-${c.dial}`}
                  type="button"
                  onClick={() => {
                    onChange(c.dial);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between w-full px-2.5 py-1.5 text-xs rounded-lg transition-colors text-left cursor-pointer",
                    c.dial === value
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                      : "text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-white"
                  )}
                >
                  <span className="flex items-center gap-2 truncate mr-2">
                    <span>{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 font-semibold shrink-0">+{c.dial}</span>
                </button>
              ))
            ) : (
              <div className="text-center py-4 text-xs text-zinc-450">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [aiProvider, setAiProvider] = useState<'groq'>('groq');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [currency, setCurrency] = useState('INR (₹)');
  const [summaryTime, setSummaryTime] = useState('23:00');

  // Single, unified phone number states
  const [phoneCountryCode, setPhoneCountryCode] = useState('91');
  const [phoneLocalNumber, setPhoneLocalNumber] = useState('');

  // Backup read-only display for loaded number if any
  const [phoneNumber, setPhoneNumber] = useState('');
  const [connectedNumber, setConnectedNumber] = useState<string | null>(null);

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // WhatsApp connection states
  const [waStatus, setWaStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Phone pairing specific states
  const [activeTab, setActiveTab] = useState<'qr' | 'pairing'>('qr');
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [pairingError, setPairingError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Helper to split full international numbers into country code and local part
  const parsePhoneNumber = (fullNumber: string) => {
    const clean = fullNumber.replace(/\D/g, '');
    const sortedCountries = [...countries].sort((a, b) => b.dial.length - a.dial.length);
    for (const country of sortedCountries) {
      if (clean.startsWith(country.dial)) {
        return {
          countryCode: country.dial,
          localNumber: clean.slice(country.dial.length),
        };
      }
    }
    return {
      countryCode: '91',
      localNumber: clean,
    };
  };

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

          const parsed = parsePhoneNumber(num);
          setPhoneCountryCode(parsed.countryCode);
          setPhoneLocalNumber(parsed.localNumber);
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
          setConnectedNumber(data.connectedNumber);
          setIsLoadingStatus(false);
        }
      } catch {
        if (active) {
          setWaStatus('disconnected');
          setQrCode(null);
          setConnectedNumber(null);
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
    const finalPhoneNumber = phoneLocalNumber ? phoneCountryCode + phoneLocalNumber : phoneNumber;
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiProvider, timezone, currency, summaryTime, phoneNumber: finalPhoneNumber }),
      });
      if (res.ok) {
        setIsSaved(true);
        if (finalPhoneNumber) {
          setPhoneNumber(finalPhoneNumber);
        }
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
    const finalPairingNumber = phoneCountryCode + phoneLocalNumber;
    if (!finalPairingNumber || !phoneLocalNumber) {
      setPairingError('Please enter your phone number.');
      return;
    }

    setIsRequestingCode(true);
    setPairingError(null);
    setPairingCode(null);

    // Save phone settings to database first to ensure linking works
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiProvider, timezone, currency, summaryTime, phoneNumber: finalPairingNumber }),
      });
      setPhoneNumber(finalPairingNumber);
    } catch (err) {
      console.error('Failed to save phone setting prior to pairing:', err);
    }

    try {
      const res = await fetch('/api/whatsapp/pairing-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: finalPairingNumber }),
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

  const currencyOptions = [
    { value: 'INR (₹)', label: 'INR (₹)' },
    { value: 'USD ($)', label: 'USD ($)' },
    { value: 'EUR (€)', label: 'EUR (€)' },
    { value: 'GBP (£)', label: 'GBP (£)' }
  ];

  const timezoneOptions = [
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)', icon: <Globe className="h-3.5 w-3.5 text-zinc-400" /> },
    { value: 'UTC', label: 'UTC', icon: <Globe className="h-3.5 w-3.5 text-zinc-400" /> },
    { value: 'America/New_York', label: 'America/New_York (EST)', icon: <Globe className="h-3.5 w-3.5 text-zinc-400" /> },
    { value: 'Europe/London', label: 'Europe/London (GMT/BST)', icon: <Globe className="h-3.5 w-3.5 text-zinc-400" /> }
  ];

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
            "hidden md:inline-flex gap-2 shadow-md transition-all duration-300 font-semibold active:scale-98 cursor-pointer",
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
        <div className="md:col-span-3 space-y-6 order-2 md:order-1 transition-all duration-300 relative z-10">
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
                  <CustomSelect
                    value={currency}
                    onChange={setCurrency}
                    options={currencyOptions}
                  />
                </div>

                {/* Timezone selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-350 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" /> Timezone
                  </label>
                  <CustomSelect
                    value={timezone}
                    onChange={setTimezone}
                    options={timezoneOptions}
                  />
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
                    className="rounded-xl border border-zinc-200/80 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-250 font-medium"
                  />
                  <span className="text-xxs text-zinc-500 leading-normal">
                    A summary of the day&apos;s total expenses will automatically be sent to your WhatsApp at this time.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: WhatsApp Link Card (Responsive & Animated) */}
        <div className="md:col-span-2 space-y-6 order-1 md:order-2 relative z-20">
          <Card
            className={cn(
              "border bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-500 flex flex-col justify-between",
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

              <CardContent className="p-6 space-y-4">

                {/* Selector Tabs (QR or Phone pairing) - Displayed only if not connected */}
                {waStatus !== 'connected' && (
                  <div className="pb-2">
                    <div className="flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-950/60 border border-zinc-200/30 dark:border-zinc-800/30">
                      <button
                        onClick={() => {
                          setActiveTab('qr');
                          setPairingError(null);
                        }}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer",
                          activeTab === 'qr'
                            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50"
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
                            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50"
                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                        )}
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                        Phone Pairing
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center justify-center pt-2">

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

                      {connectedNumber && (
                        <div className="mt-4 px-3 py-1.5 rounded-lg bg-zinc-55 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/80 text-xs font-semibold text-zinc-650 dark:text-zinc-350">
                          Connected Number: <span className="text-zinc-900 dark:text-zinc-100 font-mono">+{connectedNumber}</span>
                        </div>
                      )}
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

                        /* Phone number input form (placed under Phone Pairing tab) */
                        <div className="space-y-3.5 w-full text-left">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-350">
                              WhatsApp Phone Number
                            </label>

                            <div className="flex rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all w-full shadow-sm">
                              <CountrySelect
                                value={phoneCountryCode}
                                onChange={setPhoneCountryCode}
                              />
                              <input
                                type="tel"
                                placeholder="9622845669"
                                value={phoneLocalNumber}
                                onChange={(e) => setPhoneLocalNumber(e.target.value.replace(/\D/g, ''))}
                                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none border-none text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                              />
                            </div>
                            <span className="text-[10px] text-zinc-500 leading-normal block">
                              Select country code and enter phone number (no spaces).
                            </span>
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
                            disabled={isRequestingCode || !phoneLocalNumber}
                            className="w-full gap-2 text-xs font-semibold py-2.5 shadow-sm active:scale-98 cursor-pointer"
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
                            className="gap-2 transition-all duration-200 active:scale-95 border-emerald-500/25 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-650 dark:text-emerald-450 cursor-pointer"
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
                </div>
              </CardContent>
            </div>

            {/* Footer with Reset Session action */}
            <CardFooter className="border-t border-zinc-100/50 dark:border-zinc-850/50 p-4 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 font-semibold transition-all duration-300 text-xs active:scale-98 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-950 cursor-pointer"
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

      {/* Mobile/Tablet Save Changes Button */}
      <div className="md:hidden pt-2">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "w-full gap-2 shadow-md transition-all duration-300 font-semibold active:scale-98 cursor-pointer justify-center",
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
    </div>
  );
}
