import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Shield, Zap, BarChart3, Bell, CheckCircle } from 'lucide-react';
import InteractiveDemo from '@/components/landing/InteractiveUI';

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent blur-3xl rounded-full -z-10"></div>

      {/* Navigation Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
              F
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-50 to-zinc-300 bg-clip-text text-transparent">
              Fino
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400 font-medium">
            <a href="#features" className="hover:text-zinc-100 transition">Features</a>
            <a href="#demo" className="hover:text-zinc-100 transition">How it works</a>
          </nav>

          <div>
            {userId ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 text-xs px-4 py-2 rounded-full font-semibold transition"
              >
                Go to Dashboard <ArrowRight className="h-3 w-3" />
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-full font-semibold transition shadow-md shadow-emerald-500/10"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 pt-16 md:pt-24 pb-20 relative">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium px-3.5 py-1 rounded-full border border-emerald-500/20">
            <MessageSquare className="h-3.5 w-3.5" /> Track expenses right inside WhatsApp
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-b from-zinc-50 to-zinc-400 bg-clip-text text-transparent">
            Your Personal AI Expense Assistant on WhatsApp
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            No new apps to download, no complicated setup. Just text Fino on WhatsApp (like &quot;120 for milk&quot;) and watch your beautiful financial dashboard update in real-time.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-6 py-3 rounded-full transition shadow-lg shadow-emerald-500/10 group"
            >
              {userId ? 'Go to Dashboard' : 'Get Started for Free'}{' '}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-semibold text-sm px-6 py-3 rounded-full transition"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Live Interactive Demo Section */}
        <section id="demo" className="mt-16 md:mt-24 border-t border-zinc-900 pt-16">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">See It In Action</h2>
            <p className="text-zinc-400 text-xs sm:text-sm">Watch Fino parse WhatsApp messages and build analytics on the fly.</p>
          </div>
          <InteractiveDemo />
        </section>

        {/* Features Section */}
        <section id="features" className="mt-24 border-t border-zinc-900 pt-20">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-b from-zinc-50 to-zinc-300 bg-clip-text text-transparent">
              Designed For Ultimate Speed
            </h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Keeping track of money shouldn&apos;t take time. Fino runs on top of your daily communication.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-zinc-900/40 backdrop-blur border border-zinc-900 hover:border-emerald-500/20 p-6 rounded-2xl transition group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all"></div>
              <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center text-emerald-400 mb-4 shadow">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-200 mb-2">Instant Parsing</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Send natural sentences like &quot;50 for lunch with mom&quot;. Our Gemini AI extracts the amount, matches the description, and categorizes it in milliseconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-900/40 backdrop-blur border border-zinc-900 hover:border-emerald-500/20 p-6 rounded-2xl transition group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all"></div>
              <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center text-emerald-400 mb-4 shadow">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-200 mb-2">Beautiful Analytics</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Log in to Fino dashboard to monitor your spend history. View clean charts, category distributions, and daily limits in a premium UI.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-900/40 backdrop-blur border border-zinc-900 hover:border-emerald-500/20 p-6 rounded-2xl transition group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all"></div>
              <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center text-emerald-400 mb-4 shadow">
                <Bell className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-200 mb-2">Daily Summaries</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Receive an automatic daily spending digest on your WhatsApp at your preferred time. Stay aware of your cash flow without visiting the site.
              </p>
            </div>
          </div>
        </section>

        {/* Security & Multi-User Isolated Section */}
        <section className="mt-20 bg-gradient-to-br from-zinc-900/50 via-zinc-900/30 to-transparent border border-zinc-900 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              <Shield className="h-3 w-3 text-emerald-400" /> SECURED BY CLERK
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-100">
              Isolated User Environment
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Your expenses, settings, and message history are fully private. We use Clerk to guarantee secure accounts and database-level rules to isolate your logs from other Fino users.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-950/20 border border-emerald-900/30 px-5 py-3 rounded-2xl text-emerald-400 font-semibold text-sm shrink-0">
            <CheckCircle className="h-5 w-5" /> Fully Private & Encrypted
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
              F
            </div>
            <span className="font-bold text-zinc-300">Fino</span>
          </div>
          <p>© 2026 Fino. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
