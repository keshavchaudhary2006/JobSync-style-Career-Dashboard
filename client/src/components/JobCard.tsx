'use client';

import React, { useState } from 'react';
import { JobApplication, JobStatus } from '../types/job';

interface JobCardProps {
  job: JobApplication;
  onStatusChange?: (jobId: string, newStatus: JobStatus) => Promise<void>;
  onDelete?: (jobId: string) => Promise<void>;
}

const ALL_STATUSES: JobStatus[] = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function JobCard({ job, onStatusChange, onDelete }: JobCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Generate deterministic avatar gradient based on company name
  const getGradient = (name: string) => {
    const gradients = [
      'from-blue-600 to-indigo-600',
      'from-purple-600 to-pink-600',
      'from-emerald-600 to-teal-600',
      'from-amber-600 to-orange-600',
      'from-rose-600 to-red-600'
    ];
    const index = (name || 'J').charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const initial = job.companyName ? job.companyName.charAt(0).toUpperCase() : '?';

  const handleStatusSelect = async (newStatus: JobStatus) => {
    if (!onStatusChange || newStatus === job.status) return;
    try {
      setIsUpdating(true);
      await onStatusChange(job._id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (confirm(`Are you sure you want to delete ${job.companyName} (${job.jobTitle})?`)) {
      try {
        setIsDeleting(true);
        await onDelete(job._id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between gap-3 ${
        isDeleting ? 'opacity-40 pointer-events-none scale-95' : ''
      }`}
    >
      {/* Top Header: Company initial + Name + External Link */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${getGradient(
                job.companyName
              )} text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-sm`}
            >
              {initial}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {job.companyName}
              </h4>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                {job.jobTitle}
              </p>
            </div>
          </div>

          {job.jobUrl && (
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
              title="Open job posting"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>

        {/* Notes Preview */}
        {job.notes && (
          <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
            "{job.notes}"
          </p>
        )}
      </div>

      {/* Footer: Date Applied + Interactive Status Selector */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>
            {job.dateApplied
              ? new Date(job.dateApplied).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })
              : 'N/A'}
          </span>
        </div>

        {/* Quick Move Status Dropdown + Delete */}
        <div className="flex items-center gap-1">
          {onStatusChange && (
            <div className="relative inline-flex items-center">
              <select
                disabled={isUpdating}
                value={job.status}
                onChange={(e) => handleStatusSelect(e.target.value as JobStatus)}
                className="text-[11px] font-semibold py-0.5 px-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                title="Change Status"
              >
                {ALL_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    → {status}
                  </option>
                ))}
              </select>
              {isUpdating && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              )}
            </div>
          )}

          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-all disabled:opacity-50"
              title="Delete application"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
