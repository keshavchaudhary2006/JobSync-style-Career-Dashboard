import React from 'react';
import { JobApplication } from '../types/job';

interface StatCardsProps {
  jobs: JobApplication[];
}

export default function StatCards({ jobs }: StatCardsProps) {
  const total = jobs.length;
  const interviews = jobs.filter((j) => j.status === 'Interview').length;
  const offers = jobs.filter((j) => j.status === 'Offer').length;
  const applied = jobs.filter((j) => j.status === 'Applied').length;
  const wishlist = jobs.filter((j) => j.status === 'Wishlist').length;

  const cards = [
    {
      title: 'Total Tracked',
      value: total,
      subtext: `${applied} awaiting response`,
      accent: 'border-l-indigo-500',
      badge: '+3 this week',
      badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      icon: (
        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: 'Active Interviews',
      value: interviews,
      subtext: 'Next: Thursday 2:00 PM',
      accent: 'border-l-amber-500',
      badge: 'In Progress',
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      icon: (
        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Offers Received',
      value: offers,
      subtext: 'Action required by Friday',
      accent: 'border-l-emerald-500',
      badge: '🎉 High Priority',
      badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      icon: (
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Wishlist & Target',
      value: wishlist,
      subtext: 'Ready for outreach',
      accent: 'border-l-purple-500',
      badge: 'Pipeline',
      badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      icon: (
        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-4 ${card.accent} shadow-sm hover:shadow-md transition-all`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {card.title}
            </span>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
              {card.icon}
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {card.value}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
              {card.badge}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {card.subtext}
          </p>
        </div>
      ))}
    </div>
  );
}
