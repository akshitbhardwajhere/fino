'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const defaultCategories = [
  { name: 'Food', desc: 'Meals, restaurants, fast food, and snacks' },
  { name: 'Travel', desc: 'Flights, trains, hotels, and vacation expenses' },
  { name: 'Fuel', desc: 'Petrol, diesel, EV charging, and vehicle running costs' },
  { name: 'Shopping', desc: 'Clothing, gadgets, accessories, and gifts' },
  { name: 'Bills', desc: 'Rent, electricity, water, internet, and subscriptions' },
  { name: 'Entertainment', desc: 'Movies, streaming, outings, and gaming' },
  { name: 'Health', desc: 'Medicines, consultations, gym, and insurance' },
  { name: 'Education', desc: 'Books, courses, tuition, and school fees' },
  { name: 'Groceries', desc: 'Supermarket shopping and daily essentials' },
  { name: 'Other', desc: 'Miscellaneous expenses not fitting standard categories' },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 mb-2">
          <ArrowLeft className="h-3 w-3" /> Back to Dashboard
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Categories</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Default and custom categories used by the AI assistant.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {defaultCategories.map((cat) => (
          <Card key={cat.name} className="hover:shadow-sm transition-shadow duration-150">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">{cat.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{cat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
