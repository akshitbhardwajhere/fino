'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, ArrowLeft, Trash2, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Expense {
  id: string;
  amount: string;
  category: string;
  description: string | null;
  spentAt: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currency, setCurrency] = useState('INR (₹)');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/expenses', window.location.origin);
      if (searchQuery) {
        url.searchParams.set('search', searchQuery);
      }
      if (selectedCategory) {
        url.searchParams.set('category', selectedCategory);
      }

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.expenses);
        setCurrency(data.currency);
      }
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExpenses();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const getCurrencySymbol = (currencyStr: string) => {
    if (currencyStr.includes('($)')) return '$';
    if (currencyStr.includes('(€)')) return '€';
    if (currencyStr.includes('(£)')) return '£';
    return '₹';
  };

  const formatSpentAt = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const currencySymbol = getCurrencySymbol(currency);

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
        <Button onClick={fetchExpenses} variant="outline" size="sm" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Transactions List</CardTitle>
              <CardDescription>A list of all your recorded expenses.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search expenses..."
                  className="w-full rounded-md border border-zinc-200 bg-white py-1.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Travel">Travel</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <p className="text-sm text-zinc-500">Loading transactions...</p>
            </div>
          ) : expenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-zinc-500 dark:text-zinc-400">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold uppercase text-zinc-400">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">{formatSpentAt(expense.spentAt)}</td>
                      <td className="py-3.5 px-4 font-medium text-zinc-900 dark:text-zinc-100">{expense.description || 'Unspecified'}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-650 dark:text-zinc-355">
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-zinc-900 dark:text-zinc-50">
                        {currencySymbol}{parseFloat(expense.amount).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Button
                          onClick={() => handleDeleteClick(expense.id)}
                          disabled={isDeleting === expense.id}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        >
                          {isDeleting === expense.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
              <p>No expenses found matching the criteria.</p>
              <p className="text-sm mt-1 text-zinc-400">Try sending an expense from WhatsApp! E.g. &quot;150 for dinner&quot;</p>
            </div>
          )}
        </CardContent>
      </Card>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-in zoom-in-95 duration-200">
            <CardHeader>
              <CardTitle className="text-zinc-900 dark:text-zinc-50">Delete Transaction</CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400">
                Are you sure you want to delete this expense? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              {(() => {
                const exp = expenses.find((e) => e.id === deleteConfirmId);
                if (!exp) return null;
                return (
                  <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-150 dark:border-zinc-800 space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-zinc-900 dark:text-zinc-100">{exp.description || 'Unspecified'}</span>
                      <span className="text-rose-600 dark:text-rose-450 font-bold">{currencySymbol}{parseFloat(exp.amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-zinc-500">
                      <span>Category: {exp.category}</span>
                      <span>{formatSpentAt(exp.spentAt)}</span>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 p-4">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting !== null}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!deleteConfirmId) return;
                  setIsDeleting(deleteConfirmId);
                  try {
                    const res = await fetch(`/api/expenses?id=${deleteConfirmId}`, {
                      method: 'DELETE',
                    });
                    if (res.ok) {
                      setExpenses(expenses.filter((exp) => exp.id !== deleteConfirmId));
                      setDeleteConfirmId(null);
                    }
                  } catch (err) {
                    console.error('Failed to delete expense:', err);
                  } finally {
                    setIsDeleting(null);
                  }
                }}
                disabled={isDeleting !== null}
                className="gap-2 bg-rose-600 hover:bg-rose-700 text-white font-medium"
              >
                {isDeleting !== null ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Deleting...
                  </>
                ) : (
                  'Delete Transaction'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
