'use client';

import { useState, useEffect } from 'react';
import { Send, CheckCheck, Wallet, ArrowUpRight, TrendingUp, Pizza, Train } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export default function InteractiveDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [totalSpend, setTotalSpend] = useState(0);
  const [categories, setCategories] = useState<{ name: string; amount: number; color: string; icon: any }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const runDemo = async () => {
      // Step 0: Reset
      if (step === 0) {
        setMessages([]);
        setInputText('');
        setTotalSpend(0);
        setCategories([]);
        timer = setTimeout(() => setStep(1), 1000);
      }

      // Step 1: User typing "50 for lunch"
      else if (step === 1) {
        let text = '50 for lunch';
        let currentText = '';
        let i = 0;
        const interval = setInterval(() => {
          if (i < text.length) {
            currentText += text[i];
            setInputText(currentText);
            i++;
          } else {
            clearInterval(interval);
            setStep(2);
          }
        }, 100);
      }

      // Step 2: Send "50 for lunch"
      else if (step === 2) {
        timer = setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { sender: 'user', text: '50 for lunch', time: '12:01 PM' }
          ]);
          setInputText('');
          setStep(3);
        }, 500);
      }

      // Step 3: Fino Bot replies & Dashboard updates
      else if (step === 3) {
        setIsTyping(true);
        timer = setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              sender: 'bot',
              text: '🤖 *Fino Assistant*\n\n✅ Added *₹50.00* for *lunch*.\n📂 Category: *Food & Dining*',
              time: '12:01 PM'
            }
          ]);
          // Animate counter
          let count = 0;
          const totalInterval = setInterval(() => {
            if (count < 50) {
              count += 2;
              setTotalSpend(count);
            } else {
              setTotalSpend(50);
              clearInterval(totalInterval);
            }
          }, 20);

          setCategories([
            { name: 'Food & Dining', amount: 50, color: 'bg-emerald-500', icon: Pizza }
          ]);
          setStep(4);
        }, 1500);
      }

      // Step 4: User typing "120 for train ticket"
      else if (step === 4) {
        timer = setTimeout(() => {
          let text = '120 for train ticket';
          let currentText = '';
          let i = 0;
          const interval = setInterval(() => {
            if (i < text.length) {
              currentText += text[i];
              setInputText(currentText);
              i++;
            } else {
              clearInterval(interval);
              setStep(5);
            }
          }, 100);
        }, 1500);
      }

      // Step 5: Send "120 for train ticket"
      else if (step === 5) {
        timer = setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { sender: 'user', text: '120 for train ticket', time: '12:02 PM' }
          ]);
          setInputText('');
          setStep(6);
        }, 500);
      }

      // Step 6: Fino Bot replies & Dashboard updates
      else if (step === 6) {
        setIsTyping(true);
        timer = setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              sender: 'bot',
              text: '🤖 *Fino Assistant*\n\n✅ Added *₹120.00* for *train ticket*.\n📂 Category: *Travel*',
              time: '12:02 PM'
            }
          ]);

          // Animate counter from 50 to 170
          let count = 50;
          const totalInterval = setInterval(() => {
            if (count < 170) {
              count += 5;
              setTotalSpend(count);
            } else {
              setTotalSpend(170);
              clearInterval(totalInterval);
            }
          }, 15);

          setCategories([
            { name: 'Travel', amount: 120, color: 'bg-blue-500', icon: Train },
            { name: 'Food & Dining', amount: 50, color: 'bg-emerald-500', icon: Pizza }
          ]);
          setStep(7);
        }, 1500);
      }

      // Step 7: Wait and restart loop
      else if (step === 7) {
        timer = setTimeout(() => {
          setStep(0);
        }, 5000);
      }
    };

    runDemo();

    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-center max-w-5xl mx-auto w-full py-12 px-4">
      {/* WhatsApp Chat Simulation */}
      <div className="relative w-full max-w-[340px] aspect-[9/18] bg-zinc-950 rounded-[48px] p-3 border-4 border-zinc-800 shadow-2xl flex flex-col overflow-hidden ring-1 ring-zinc-700/50">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-950 rounded-b-2xl z-20 flex items-center justify-center">
          <div className="w-12 h-1 bg-zinc-900 rounded-full mb-2"></div>
        </div>

        {/* WhatsApp Header */}
        <div className="bg-[#075e54] text-white pt-6 pb-3 px-4 flex items-center gap-3 shrink-0 rounded-t-[36px]">
          <div className="w-8 h-8 rounded-full bg-[#128c7e] flex items-center justify-center text-sm font-bold shadow-inner mt-2">
            F
          </div>
          <div className="mt-2">
            <h4 className="text-xs font-bold leading-none">Fino Expense Tracker</h4>
            <span className="text-[9px] text-emerald-200">Online</span>
          </div>
        </div>

        {/* WhatsApp Chat Body */}
        <div className="flex-1 bg-[#efeae2] dark:bg-zinc-900 p-3 overflow-y-auto space-y-3 flex flex-col justify-end text-[11px] leading-snug">
          <div className="text-center my-1">
            <span className="bg-white/80 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded text-[8px] shadow-sm">
              TODAY
            </span>
          </div>

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[80%] rounded-lg p-2.5 shadow-sm relative ${
                msg.sender === 'user'
                  ? 'bg-[#d9fdd3] dark:bg-emerald-950/60 text-zinc-900 dark:text-zinc-100 self-end rounded-tr-none'
                  : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 self-start rounded-tl-none border border-zinc-100 dark:border-zinc-700/30'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              <div className="flex items-center justify-end gap-1 mt-1 text-[8px] text-zinc-400">
                <span>{msg.time}</span>
                {msg.sender === 'user' && <CheckCheck className="h-3 w-3 text-sky-500" />}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 self-start rounded-lg rounded-tl-none p-2 shadow-sm border border-zinc-100 dark:border-zinc-700/30">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp Footer */}
        <div className="bg-[#f0f2f5] dark:bg-zinc-950 p-2 flex items-center gap-2 shrink-0 rounded-b-[36px]">
          <div className="flex-1 bg-white dark:bg-zinc-900 rounded-full px-3 py-1.5 flex items-center justify-between border border-zinc-200 dark:border-zinc-800 text-[11px]">
            <span className="text-zinc-400 dark:text-zinc-500 truncate max-w-[180px]">
              {inputText || 'Type a message...'}
            </span>
          </div>
          <button className="w-8 h-8 rounded-full bg-[#128c7e] text-white flex items-center justify-center shrink-0 hover:bg-[#075e54] transition shadow-md">
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Fino Dashboard Simulation */}
      <div className="flex-1 w-full max-w-[440px] bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 ring-1 ring-zinc-700/30">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Fino Dashboard
            </h3>
            <p className="text-[10px] text-zinc-500">Live data streaming</p>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-medium border border-emerald-500/20">
            Active session
          </span>
        </div>

        {/* Total Spending */}
        <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-2xl p-5 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500">Total Spending</span>
            <h2 className="text-3xl font-extrabold text-zinc-100 mt-1 transition-all">
              ₹{totalSpend.toFixed(2)}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/30 border border-emerald-800/30 flex items-center justify-center text-emerald-400">
            <Wallet className="h-5 w-5" />
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-zinc-400">Categories</span>
            <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
              Updated <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>

          {categories.length === 0 ? (
            <div className="h-32 rounded-2xl border border-dashed border-zinc-800/60 flex flex-col items-center justify-center text-zinc-600 gap-1.5">
              <TrendingUp className="h-5 w-5" />
              <span className="text-[10px]">Waiting for first expense...</span>
            </div>
          ) : (
            <div className="space-y-3 h-32 transition-all">
              {categories.map((cat, idx) => {
                const percentage = ((cat.amount / totalSpend) * 100).toFixed(0);
                const Icon = cat.icon;
                return (
                  <div key={idx} className="space-y-1.5 animate-fadeIn">
                    <div className="flex justify-between text-xs font-semibold text-zinc-300">
                      <span className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-zinc-500" />
                        {cat.name}
                      </span>
                      <span>₹{cat.amount.toFixed(2)} ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cat.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
