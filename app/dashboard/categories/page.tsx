'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Tag, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface CategoryData {
  name: string;
  desc: string;
  count: number;
  total: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [currency, setCurrency] = useState('INR (₹)');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories);
          setCurrency(data.currency);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getCurrencySymbol = (currencyStr: string) => {
    if (currencyStr.includes('($)')) return '$';
    if (currencyStr.includes('(€)')) return '€';
    if (currencyStr.includes('(£)')) return '£';
    return '₹';
  };

  const currencySymbol = getCurrencySymbol(currency);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
        <p className="text-sm text-zinc-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 mb-2">
          <ArrowLeft className="h-3 w-3" /> Back to Dashboard
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Categories</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Default categories configured for automatic AI mapping.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card key={cat.name} className="hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span>{cat.name}</span>
                <span className="text-xs font-normal text-zinc-400 flex items-center gap-1">
                  <Tag className="h-3 w-3" /> {cat.count} transaction{cat.count === 1 ? '' : 's'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 min-h-[32px]">{cat.desc}</p>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-sm">
                <span className="text-zinc-400 flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" /> Total Spent:
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-50">
                  {currencySymbol}{parseFloat(cat.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
